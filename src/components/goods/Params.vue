<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <el-row class="cate_opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectedKeys"
            :options="cateList"
            :props="{
              expandTrigger: 'hover',
              label: 'cat_name',
              value: 'cat_id',
              children: 'children',
              checkStrictly: 'true',
            }"
            @change="cateChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="isBtnDisable"
            size="mini"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <el-table :data="manyData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="tag in scope.row.attr_vals"
                  :key="tag"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag,scope.row)">{{tag}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="deleteParam(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="isBtnDisable"
            size="mini"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <el-table :data="onlyData" border stripe>
                        <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="tag in scope.row.attr_vals"
                  :key="tag"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag,scope.row)">{{tag}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="deleteParam(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog
      :title="'添加' + addText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="addText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="'修改' + addText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="addText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      selectedKeys: [],
      activeName: "many",
      manyData: [],
      onlyData: [],
      addForm: {},
      addRules: {
        attr_name: [{ required: true, message: "请输入名称", trigger: "blur" }],
      },
      addDialogVisible: false,
      editForm: {},
      editRules: {
        attr_name: [{ required: true, message: "请输入名称", trigger: "blur" }],
      },
      editDialogVisible: false,
    };
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200)
        return this.$message.error("获取分类列表失败");
      this.cateList = res.data;
    },
    async cateChange() {
      this.getParams();
    },
    tabClick() {
      this.getParams();
    },
    async getParams() {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = [];
        this.manyData = []
        this.onlyData = []
        return;
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: this.activeName,
          },
        }
      );
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals.trim() ? item.attr_vals.split(' ') : []
        item.inputVisible=false,
        item.inputValue=''
      })
      if (res.meta.status !== 200) return this.$message.error("获取参数失败");
      if (this.activeName === "many") {
        this.manyData = res.data;
      } else {
        this.onlyData = res.data;
      }
      console.log(res.data);
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 201) return this.$message.error("添加参数失败");
        this.$message.success("添加参数成功");
        this.getParams();
        this.addDialogVisible = false;
      });
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    async showEditDialog(attr_id) {
      this.editDialogVisible = true;
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: {
            attr_sel: this.activeName,
          },
        }
      );
      if (res.meta.status !== 200) return this.$message.error("获取参数失败");
      this.editForm = res.data;
    },
    async editParams() {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
        {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName,
        }
      );
      if (res.meta.status !== 200) return this.$message.error("修改参数失败");
      this.$message.success("修改参数成功");
      this.getParams();
      this.editDialogVisible = false;
    },
    async deleteParam(attr_id) {
      const result = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (result !== "confirm") return this.$message.info("已取消");
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      );
      this.getParams();
    },
   handleInputConfirm(row) {
        if(row.inputValue.trim().length===0){
            row.inputValue = ''
            row.inputVisible=false
            return
        }
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue=''
        row.inputVisible=false
        this.saveVals(row)
    },
    handleClose(tag,row) {
      row.attr_vals.splice(row.attr_vals.indexOf(tag),1)
      for(var i = 0;i<row.attr_vals.length;i++){
      if(row.attr_vals[i]==''||row.attr_vals[i]==null||typeof(row.attr_vals[i])==undefined){
        row.attr_vals.splice(i,1);
        }
      }
      this.saveVals(row)
    },
   async saveVals(row) {
        const{data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.join(' ')
        })
        if(res.meta.status!==200) {
          return this.$message.error('修改参数项失败')
        }
        this.$message.success('修改参数项成功')
    },
    showInput(row) {
        row.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    }
  },
  created() {
    this.getCateList();
  },
  computed: {
    isBtnDisable() {
      if (this.selectedKeys.length !== 3) return true;
      return false;
    },
    cateId() {
      if (this.selectedKeys.length === 3) return this.selectedKeys[2];
      return null;
    },
    addText() {
      return this.activeName === "many" ? "动态参数" : "静态属性";
    },
  },
};
</script>

<style lang="less" scoped>
.cate_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
    width: 120px;
}
</style>