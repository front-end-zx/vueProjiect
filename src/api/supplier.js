import request from '@/utils/request'

export default {
    getList(page,size,searchMap) {
        return request({
            url: `/supplier/list/search/${page}/${size}`,
            method:'post',
            data:searchMap
        })
    },
    add(pojo){
        return request({
            url:'/supplier',
            method:'post',
            data:pojo
        })
    },
    getId(id){
        return request({
            url:`/supplier/${id}`,
            method:'get'
        })
    },
    update(pojo){
        return request({
            url:`/supplier/${pojo.id}`,
            method:'post',
            data:pojo
        })
    },
    deleteId(id){
        return request({
            url:`/supplier/{id}`,
            method:'delete'
        })
    }
}