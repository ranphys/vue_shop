import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './views/Home.vue'
import Welcome from './views/HomeChildcomps/Welcome.vue'
import User from './components/user/user.vue'
import Rights from './components/power/Rights.vue'
import Roles from './components/power/Roles.vue'
import Category from './components/goods/Category'
import Params from './components/goods/Params'
import GoodsList from './components/goods/List'
import Add from './components/goods/Add'
import Order from './components/order/Order'



Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: Login },
        {
            path: '/home',
            component: Home,
            redirect: '/welcome',
            children: [
                { path: '/welcome', component: Welcome },
                { path: '/users', component: User },
                { path: '/rights', component: Rights },
                { path: '/roles', component: Roles },
                { path: '/categories', component: Category },
                { path: '/params', component: Params },
                { path: '/goods', component: GoodsList },
                { path: '/goods/add', component: Add },
                { path: '/orders', component: Order }
            ]
        }
    ]
})
router.beforeEach((to, from, next) => {
    if (to.path == '/login') return next()
    const token = sessionStorage.getItem('token')
    if (!token) return next('/login')
    next()
})
export default router