import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import el from "element-ui/src/locale/lang/el";
Vue.use(VueRouter)

  const routes = [
    {
      path: '/',
      redirect:'/login'
    },
    {
      path:'/login',
      component:Login
    },
    {
      path:'/home',
      component:Home
    }

]

const router = new VueRouter({
  routes
})


//挂载路由导航守卫
router.beforeEach((to,from,next) =>{
  /*to 将要访问的路径
  from 表示从哪个路径来
  next 是一个函数 ，表示放行
  **/
  if (to.path === '/login'){
    return next();
  }else {
    //获取token
    const tokenStr = window.sessionStorage.getItem('token');
    if (!tokenStr){
      return next('/login')
    }else {
      next();
    }
  }
})
export default router
