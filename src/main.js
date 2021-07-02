import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'

Vue.config.productionTip = false
Vue.component('t-table', TreeTable)

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
    config.headers.Authorization = sessionStorage.getItem('token')
    return config
})
Vue.prototype.$http = axios
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')