import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './views/Home.vue'
import Welcome from './views/HomeChildcomps/Welcome.vue'
import User from './components/user/user.vue'



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
                { path: '/users', component: User }
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