import request from '@/utils/request'
// 导出登录验证函数
export function login(name,password){
    return request({
        url:'/user/login',
        method:'post',
        data:{
            name,
            password
        }
    })
}
// 导出获取用户信息的函数
export function getUserInfo(token){
    return request({
        url:`/user/info/${token}`,
        method:'get'
    })
}

// 导出退出登录的函数
export function logout(token){
    return request ({
        url:'/user/logout',
        method:'post'
    })
}