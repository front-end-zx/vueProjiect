import Vue from "vue";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from "./App.vue";
import './promission.js'
import router from "./router";

Vue.use(ElementUI);
Vue.config.productionTip = false;
// console.log(process.env.NODE_ENV);  production生产环境  development是开发环境

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
