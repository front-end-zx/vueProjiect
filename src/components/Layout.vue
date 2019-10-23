<template>
    <div>
        <app-header></app-header>
        <app-navbar></app-navbar>
        <app-main></app-main>
    </div>
</template>
<script>
// 导入组件
import AppHeader from './AppHeader'
import AppNavbar from './AppNavbar'
import AppMain from './AppMain'
// 将组件挂载到页面中去
export default {
    components:{
        AppHeader,
        AppNavbar,
        AppMain
    }
}
</script>
<style scoped>
/* 主页中的样式不需要分到每个组件中去 */
.header {   
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    line-height: 50px;
    background-color: #2b3a4b;
}
.navbar {
    position: absolute;
    top: 50px;
    left: 0px;
    bottom: 0px;
    width: 230px;
    background-color: #545c64;
    overflow-y: auto;
}
.main {
    position: absolute;
    left: 230px;
    top: 50px;
    right: 0px;
    bottom: 0px;
    padding: 10px;
    overflow-y: auto;
}
</style>