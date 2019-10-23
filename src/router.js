import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
// 当login下面的组件名为Index.vue的时候，会自动访问
import Login from './views/login'
import Layout from '@/components/Layout'
import Home from '@/views/home'
import Goods from '@/views/goods'
import Member from '@/views/member'
import Staff from '@/views/staff'
import Supplier from '@/views/supplier'


export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'layout',
      component: Layout,
      redirect: '/home',
      children: [
        // {
        //   path:'/goods',
        //   component:Goods
        // },
        // {
        //   path:'/member',
        //   component:Member
        // },
        // {
        //   path:'/staff',
        //   component:Staff
        // },
        // {
        //   path:'/supplier',
        //   component:Supplier
        // },
        {
          path: '/home',
          meta: { title: "首页" },
          component: Home
        }
      ]
    },
    // 下面的五个是侧边栏的5个路由
    {
      path: '/member',
      component: Layout,
      children: [
        {
          path: '/member/',
          meta: { title: "会员管理" },
          component: Member
        }
      ]
    },
    {
      path: '/goods',
      component: Layout,
      children: [
        {
          path: '/goods/',
          meta: { title: "商品管理" },
          component: Goods
        }
      ]
    },
    {
      path: '/staff',
      component: Layout,
      children: [
        {
          path: '/staff/',
          meta: { title: "员工管理" },
          component: Staff
        }
      ]
    },
    {
      path: '/supplier',
      component: Layout,
      children: [
        {
          path: '/supplier/',
          meta: { title: "供应商管理" },
          component: Supplier
        }
      ]
    }
  ]
});
