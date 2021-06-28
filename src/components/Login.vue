<template>
  <div class="login_container">
      <div class="login_box">
          <div class="avater_box">
              <img src="@/assets/logo.png" alt="">
          </div>
          <el-form label-width="0px" class="form" :model="loginForm" :rules="loginRules" ref="loginRef">
              <el-form-item prop="username">
                  <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
              </el-form-item>
              <el-form-item prop="password">
                  <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" type="password"></el-input>
              </el-form-item>
              <el-form-item class="btns">
                  <el-button type="primary" @click="login">登录</el-button>
                  <el-button type="info" @click="reset">重置</el-button>
              </el-form-item>
          </el-form>
      </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            loginForm: {
                username: 'admin',
                password: '123456'
            },
            loginRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ],
            }
        }
    },
    methods: {
        reset() {
            this.$refs.loginRef.resetFields()
        },
        login() {
            this.$refs.loginRef.validate(async valid =>{
                if (!valid) return;
                const{data:res} = await this.$http.post("login", this.loginForm)
                console.log(res);
                if(res.meta.status!==200)return this.$message.error('登陆失败');
                this.$message.success('登陆成功');
                sessionStorage.setItem('token',res.data.token);
                this.$router.push('/home')
            })
        }
    }
}
</script>

<style lang="less" scoped>

.login_container {
    background-color: #2b4b6b;
    height: 100%;
}
.login_box {
    background-color: #fff;
    width: 450px;
    height: 300px;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    .avater_box {
        width: 130px;
        height: 130px;
        border-radius: 50%;
        padding: 10px;
        border: 1px solid #eee;
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: #fff;
        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
    .form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
        .btns {
            display: flex;
            justify-content: flex-end;
        }
    }
}
</style>