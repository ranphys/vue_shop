<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>
            <el-table :data="rolesList" stripe border>
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id"
                        :class="['bdbottom',i1===0? 'bdtop': '','vcenter'],">
                            <el-col :span="5"  >
                                <el-tag closable @close="removeRight(scope.row,item1.id)">{{item1.authName}}</el-tag>
                                
                            </el-col>
                            <el-col :span="19">
                                <el-row v-for="(item2,i2) in item1.children"
                                 :class="[i2===0? '': 'bdtop','vcenter']" :key="item2.id">
                                    <el-col :span="6"><el-tag type="success" closable @close="removeRight(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i></el-col>
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="(item3,i3) in item2.children"
                                    :key="item3.id" closable @close="removeRight(scope.row,item3.id)">{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                    <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightsDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog 
            title="分配权限"
            :visible.sync="setRightDialogVisible"
            width="50%"
            @close="setRightDialogClosed">
  <el-tree :data="rightsList" :props="defaultProps" show-checkbox node-key="id"
  default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRight">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            rolesList: [],
            setRightDialogVisible: false,
            rightsList:[],
            defaultProps: {
                label: 'authName',
                children:'children'
            },
            defKeys:[],
            setRightRoleId: ''
        }
    },
    methods: {
        async getRolesList() {
            const {data:res}  = await this.$http.get('roles')
            if(res.meta.status!==200) return this.$message.error('获取角色列表失败')
            this.rolesList = res.data
        },
        async removeRight(role,id) {
            const result = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
            if(result !== 'confirm') return this.$message.info('已取消删除');
            const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${id}`)
            if(res.meta.status!==200) return this.$message.error('删除失败')
            this.$message.success('删除成功')
            role.children = res.data
        },
        async showSetRightsDialog(role) {
            const {data:res} = await this.$http.get('rights/tree')
            if(res.meta.status!==200)return this.$message.error('获取权限失败')
            this.setRightDialogVisible = true
            this.rightsList=res.data
            this.getDefKeys(role,this.defKeys)
            this.setRightRoleId = role.id
        },
        getDefKeys(node,arr) {
            if(!node.children)return arr.push(node.id)
            node.children.forEach(item =>{
                this.getDefKeys(item,arr)
            })
        },
        setRightDialogClosed() {
            this.defKeys=[]
        },
        async allotRight() {
            const keys = [
             ...this.$refs.treeRef.getCheckedKeys(),
             ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            const strKeys = keys.join(',')
            const {data:res} = await this.$http.post(`roles/${this.setRightRoleId}/rights`,{
                rids: strKeys
            })
            if(res.meta.status!==200) return this.$message.error('更新用户权限失败');
            this.$message.success('更新用户权限成功')
            this.setRightDialogVisible = false
            this.getRolesList()
        }
    },
    created() {
        this.getRolesList()
    }
}
</script>

<style lang="less" scoped>
    .el-tag {
        margin: 7px;
    }
    .bdtop {
        border-top: 1px solid #eee;
    }
    .bdbottom {
        border-bottom: 1px solid #eee;
    }
    .vcenter {
        display: flex;
        align-items: center;
    }
</style>