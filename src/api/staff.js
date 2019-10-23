import request from '@/utils/request'

export default {
    getList(page,size,searchMap){
        return request ({
            url:`/staff/list/search/${page}/${size}`,
            method:'post',
            data:searchMap
        })
    },
    add(pojo){
        return request({
            url:'/staff',
            method:'post',
            data:pojo
        })
    },
    getById(id){
        return request({
            url:`/staff/${id}`,
            method:'get'
        })
    },
    update(pojo){
        return request({
            url:`/staff/${pojo.id}`,
            method:'post',
            data:pojo
        })
    },
    delete(id){
        return request({
            url:`/staff/${id}`,
            method:'delete'
        })
    }
}