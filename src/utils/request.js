// 自定义封装Axios异步对象
import axios from 'axios';
const request = axios.create({
    baseURL:process.env.VUE_APP_BASE_API,
    timeout:5000 // 请求超时 5000毫秒
})
// 导入loading服务
import { Loading } from 'element-ui';
const loading = {
    loadingInstance:null,
    open:function(){
        if(this.loadingInstance === null) {
            this.loadingInstance = Loading.service({
                target:'.main',
                text:'拼命加载中...',
                background:'rgba(0,0,0,0.5)'
            })
        }
    },
    close:function(){
        if(this.loadingInstance!=null){
            this.loadingInstance.close()
        }
    }
}
// 请求拦截器
request.interceptors.request.use(config=>{
    loading.open()
    return config
},error=>{
    return Promise.reject(error)
})
// 响应拦截器
request.interceptors.response.use(response=>{
    loading.close()
    return response
},error=>{
    return Promise.reject(error)
})

// 导出自定义创建的axios对象
export default request