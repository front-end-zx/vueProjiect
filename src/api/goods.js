import request from '@/utils/request'

export default ({
    getList(page,size,searchMap){
        return request({
            url:`/goods/list/search/${page}/${size}`,
            method:'post',
            data:searchMap
        })
    },
    add(pojo){
        return request ({
            url:'/goods',
            method:'post',
            data:pojo
        })
    },
    getById(id){
        return request({
            url:`/goods/{id}`,
            method:'get'
        })
    },
    update(pojo){
        return request({
            url:`/goods/{pojo.id}`,
            method:'post',
            data:pojo
        })
    },
    delete(id){
        return request({
            url:`/goods/{id}`,
            method:'delete'
        })
    }
})