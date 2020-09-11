import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
/*导入全局样式表*/
import './assets/css/global.css'
import axios from 'axios'


Vue.prototype.$http=axios
//配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {

  config.headers.Authorization = window.sessionStorage.getItem('token')
  //在最后必须返回config
  return config
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')