import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入登录页面
import Login from '../views/login'
// 引入后台主页
import Home from '../views/home/indexHome.vue'
Vue.use(VueRouter)

const routes = [
  // 重定向
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: Login },
  { path: '/home', name: 'home', component: Home }
]

const router = new VueRouter({
  routes
})
// 设置全局守卫
router.beforeEach((to, from, next) => {
  // 首先获取用户登录信息
  let userinfo = window.sessionStorage.getItem('userinfo')
  // 如果是null的话，证明用户不在登录状态
  if (!userinfo && to.path !== '/login') {
    return next('/login')
  }
  // 放行
  next()
})
export default router
