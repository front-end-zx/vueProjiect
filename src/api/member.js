// 导入自定义的路由对象
import request from '@/utils/request'


// 暴露渲染会员列表函数
export default {
    getMemberList() {
        return request({
            url: '/member/list',
            method: 'get'
        })
    },
    // 导出会员列表分页函数
    // page是当前页码
    // size是每页查询的条数
    // searchMap条件查询的条件值
    getPage(page, size, searchMap) {
        return request({
            url: `/member/list/search/${page}/${size}`,
            method: 'post',
            data: searchMap
        })
    },
    // 添加会员接口
    add(pojo) {
        return request({
            url: '/member',
            method: 'post',
            data: pojo
        })
    },
    // 返回目标会员ID
    getMemberId(id) {
        return request({
            url: `/member/${id}`,
            method: 'get'
        })
    },
    // 更新会员数据接口
    update(pojo) {
        return request({
            url: `/member/${pojo.id}`,
            method: 'put',
            data: pojo
        })
    },
    // 删除会员接口
    deleteId(id) {
        return request({
            url: `/member/${id}`,
            method: "delete"
        })
    }
}