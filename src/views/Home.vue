<template>
    <el-container class="home">
  <el-header><div>
      <img src="@/assets/img/heima.png" alt="">
      <span>电商后台管理系统</span>
      </div> <el-button type="info" @click="logout">退出</el-button></el-header>
  <el-container>
    <el-aside :width="isCollapse? '64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
      background-color="#313743"
      text-color="#fff"
      active-text-color="#3fa1fd"
      :collapse="isCollapse"
      :collapse-transition="false"
      router
      :default-active="this.$route.path">
      <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
        <template slot="title">
          <i :class="iconfont[item.id]" class="icon"></i>
          <span>{{item.authName}}</span>
        </template>
       <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
        <i class="el-icon-menu"></i>
        <span>{{subItem.authName}}</span>
      </el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
    <el-main><router-view></router-view></el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
    data() {
        return {
            menuList:{},
            iconfont:{
                '125':'iconfont icon-user',
                '103':'iconfont icon-tijikongjian',
                '101':'iconfont icon-shangpin',
                '102':'iconfont icon-danju',
                '145':'iconfont icon-baobiao'
            },
            isCollapse: true
        }
    },
    created() {
        this.getMenu()
    },
    methods: {
        logout() {
            sessionStorage.clear();
            this.$router.push('/login')
        },
        async getMenu() {
            const{ data:res} = await this.$http.get('menus')
            if(res.meta.status!==200)return this.$message.error(res.meta.msg)
            this.menuList = res.data
            console.log(this.menuList);
        },
        toggleCollapse() {
            this.isCollapse = !this.isCollapse
        }
    }
}
</script>

<style lang="less" scoped>
    .el-header {
        background-color: #363d40;
        display: flex;
        justify-content: space-between;
        padding-left: 0;
        align-items: center;
        color: #fff;
        font-size: 20px;
        div {
            display: flex;
            align-items: center;
            span {
                margin-left: 15px;
            }
        }
    }
    .el-aside {
        background-color: #313743;
    }
    .el-main {
        background-color: #e9edf1;
    }
    .home {
        height: 100%;
    }
    .icon {
        margin-right: 10px;
    }
    .toggle-button {
        font-size: 10px;
        line-height: 24px;
        color: #fff;
        background-color: #475163;
        text-align: center;
        letter-spacing: 0.2em;
    }
</style>