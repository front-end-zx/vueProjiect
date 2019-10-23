// 权限校验
// Vue Router中的前置钩子函数 beforeEach(to,from,next)
// 当进行路由跳转的之前，进行判断，是否已经登录过，登录过则允许访问页面，反之，则返回登录页面


// 因为该行为是发生在路由跳转的过程中，先导入路由表
import router from './router'
import {getUserInfo} from '@/api/login'
router.beforeEach((to,from,next)=>{
    // 1.首先验证是否有token
    // 1.1 没有token值
    // 1.1.1 是否前往登录页面，前往登录页面就去
    // 1.1.2 不是前往登录页面，让他前往登录页面
    const token = localStorage.getItem('dsg-msm-token')
    if(!token){
        if(to.path==='/login'){
            next()
        }else{
            next({path:'/login'})
        }
    }else{
        // 1.2 如果有token值
        // 1.2.1 如果去登录页面，就去吧
        // 1.2.2 如果不去登录页面，检查是否有用户名 因为过期
        // 1.2.2.1 如果有用户名，就想去哪去哪
        // 1.2.2.2 如果没有用户名，就需要从后台重新获取数据
        if(to.path==='/login'){
            next()
        }else{
            const userInfo = localStorage.getItem('dsg-msm-user')
            if(userInfo){
                next()
            }else{
                getUserInfo(token).then(result=>{
                    // 获取数据
                    if(result.data.flag){
                        localStorage.setItem('dsg-msm-user',JSON.stringify(result.data.data))
                        next()
                    }else{
                        // 获取数据失败，返回登录界面
                        next({path:'/login'})
                    }
                })
            }
        }
    }
})