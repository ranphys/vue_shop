<template>
  <div>
     <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>
    <el-card class="box-card">
  <el-row :gutter="20">
  <el-col :span="8">
      <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUsers">
    <el-button slot="append" icon="el-icon-search" @click="getUsers"></el-button>
  </el-input>
  </el-col>
  <el-col :span="4"><el-button type="primary" @click="userClick">添加用户</el-button></el-col>
</el-row>
  <el-table :data="userList" border stripe>
    <el-table-column type="index"></el-table-column>
    <el-table-column label="姓名" prop="username"></el-table-column>
    <el-table-column label="邮箱" prop="email"></el-table-column>
    <el-table-column label="电话" prop="mobile"></el-table-column>
    <el-table-column label="角色" prop="role_name"></el-table-column>
    <el-table-column label="状态" prop="mg_state">
     <template slot-scope="scope">
       <el-switch
      v-model="scope.row.mg_state"
      @change="changeState(scope.row)">
      </el-switch>
     </template>
    </el-table-column>
    <el-table-column label="操作" >
      <template slot-scope="scope">
        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUser(scope.row.id)"></el-button>
        <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
          <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
        </el-tooltip>
        
     </template>
    </el-table-column>
  </el-table>
  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="this.total">
    </el-pagination>
</el-card>
  <el-dialog
  title="提示"
  :visible.sync="dialogVisible"
  width="50%"
  @close="dialogClose">
  <el-form :model="addUserForm" :rules="addUserRules" ref="addUserForm" label-width="70px">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="addUserForm.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input v-model="addUserForm.password"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="addUserForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机号码" prop="mobile">
    <el-input v-model="addUserForm.mobile"></el-input>
  </el-form-item>
   </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
</el-dialog>
<el-dialog
  :visible.sync="editDialogVisible"
  width="50%"
  @close="editDialogClose"
  >
  <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="editForm.username" disabled></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="editForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机号" prop="mobile">
    <el-input v-model="editForm.mobile"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addEditForm">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data() {
     var checkEmail= (rule, value, cb) => {
        const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        if(regEmail.test(value))return cb() ;
        cb(new Error('请输入合法邮箱'))
      }
      var checkMobile = (rule, value, cb) => {
        const regMobile = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
        if(regMobile.test(value)) return cb() ;
        cb(new Error('请输入合法手机号'))
      }
    return {
      queryInfo: {
        query : '',
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      total: 0,
      dialogVisible:false,
      addUserForm: {
      },
      addUserRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' },
        { validator: checkEmail, trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' },
        { validator: checkMobile, trigger: 'blur' }],
      },
      editDialogVisible: false,
      editForm:{},
      editFormRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' },
        { validator: checkEmail, trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' },
        { validator: checkMobile, trigger: 'blur' }],
      },
    }
  },
  created() {
    this.getUsers()
  },
  methods: {
    async getUsers() {
      const{data:res} = await this.$http.get('users', {
        params: this.queryInfo
      })
      if(res.meta.status!==200)return this.$message.error('获取用户列表失败');
      this.userList =res.data.users;
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUsers()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUsers()
    },
    async changeState(userInfo) {
      const{data: res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if(res.meta.status!==200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新状态失败')
      }
      return this.$message.success('更新状态成功')
    },
    userClick() {
      this.dialogVisible = true
    },
    dialogClose() {
      this.$refs.addUserForm.resetFields()
    },
    addUser() {
      this.$refs.addUserForm.validate(async valid => 
      {
        if(!valid) return
        const {data:res} = await this.$http.post('users',this.addUserForm)
        if(res.meta.status!=201)return this.$message.error('添加用户失败');
        this.$message.success('添加用户成功')
        this.dialogVisible = false
        this.getUsers()
      })
    },
    async showEditDialog(id) {
      const {data:res} = await this.$http.get('users/'+ id)
      if(res.meta.status!=200) return this.$message.error('查询用户信息失败')
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    addEditForm() {
      this.$refs.editFormRef.validate(async valid=>{
        if(!valid)return
        const{data:res} = await this.$http.put('users/'+this.editForm.id,
        this.editForm)
        console.log(res);
        if(res.meta.status!==200) return this.$message.error('修改用户信息失败');
        this.$message.success('修改用户信息成功')
        this.editDialogVisible = false
        this.getUsers()
      })
    },
    async removeUser(id) {
       const result = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(result !== 'confirm') return this.$message.info('已取消删除');
        const{data:res} = await this.$http.delete('users/'+id)
        if(res.meta.status!==200)return this.$message.error('删除用户失败');
        this.$message.success('删除用户成功')
        this.getUsers()

    }
  }
  
}
</script>

<style lang="less" scoped>
  .el-pagination {
    margin: 15px;
  }
</style>