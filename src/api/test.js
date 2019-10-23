// 以对象配置的方式进行指定请求方式
import request from '@/utils/request.js'
// const BASE_URL = process.env.VUE_APP_BASE_API
request({
    methods:'get',
    // url:BASE_URL+'/db.json'
    url:'/db.json'
}).then(response=>{
    console.log('get2',response.data)
})

// 下面的这串代码做测试来用
export default {
    getList(){
        const req = request({
            methods:'get',
            // url:BASE_URL+'/db.json'
            url:'/db.json'            
        })
        return req
    }
}