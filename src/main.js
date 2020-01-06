import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入全局样式
import './assets/css/global.css'

// 引入axios
import axios from 'axios'
// 引入注册组件
import ElementUI from 'element-ui'
// 配置公共根地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/'
// 配置Vue的(原型)继承
Vue.prototype.$http = axios

// 注册组件
Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
