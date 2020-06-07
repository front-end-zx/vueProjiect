

[TOC]

# 1. 项目环境搭建

# 2. 初始化项目

1. 更改标题
2. 更改ico图标，暂时还没处理
3. 配置vue.config.js  
   1. 主要是对vue的端口号进行设置
4. 整合第三方库
   1. axios
   2. pubsub-js


# 3. 封装请求对象

1. src目录下面新建一个utils文件夹，文件夹下面新建request文件,自定义封装请求方法和拦截器
2. src下面新建一个api文件夹，来定义获取接口数据的方法
3. 将获取的接口数据暴露给目标vue文件
4. 同源策略：是指协议、域名和端口号都要相同，其中有一个不相同都会产生跨域
5. 怎么进行跨域请求：在vue.config.js添加代理(proxy)
6. 不同环境变量值配置和跨域代理配置重构（这个地方的配置只为开发环境）
   1. 请求地址
   2. 请求前缀

**前面的这些步骤就是项目的基础配置**

# 4. 进入项目

1. 会员登录系统
   1. 会员登录系统所用的表单和表单验证均来源于ElementUI组件
   2. 对登录界面添加了一些css样式
   3. 进行登录验证
      1. 在mock里面添加登录校验接口
      2. 在mock里面添加token返回用户数据
   4. 登录验证的几个步骤：
      1. 首先在api文件夹下面新建一个login.js文件，用来导出登录验证函数和返回用户数据函数
      2. 接着再index.vue登录组件中，导入创建好的两个函数，验证用户输入的内容，首先是登录返回的数据，如果返回true，调用登录返回的token进行调用用户数据，将用户的数据存储在本地存储中，将路径跳转至首页 this.$router.push('/')
2. 首页
   1. 首先将首页的路由添加到路由表中
   2. 将首页分为上、左、中三个组件
      1. header组件
         1. header组件主要是在当前组件中运用elementUI组件定义了一些样式和下拉列表
      2. navbar组件
         1. 这个组件做的事情比较多，首先是调用elementUI中的导航菜单组件；然后对每一个项目新建一个组件，为每一个项目组件设置路由，将路由挂载到路由表中，最后在main组件里面添加一个路由坑
      3. Main组件就是负责渲染navbar里面的那些组件的
   3. 退出登录的功能
      1. 首先在mock新建一个退出登录的接口
      2. 在Login.js中定义退出登录的函数
      3. 在header组件中按需导入这个函数
      4. 配合elementUI组件的command函数，进行退出登录操作，退出登录主要是包含响应服务器数据，清除本地user和token值，将页面跳转至登录页面
3. 权限校验
   1. 需求：在用户为登录的时候，不让访问登录页面，应该回到登录页面进行登录
   2. 采用Vue Router中的路由前置钩子函数（beforeEach），在前置中根据路由地址校验是否次路由是否允许访问。
4. 调试渲染会员列表
   1. 现在mock服务器端新建一个会员列表接口
   2. 在api文件夹下面新建member.js来导出渲染列表的函数
   3. 在member路由组件里面插入elementUI里面的表格模板
   4. 调用渲染列表函数，将从后台获取到的数据渲染到表格模板中去
   5. 自定义过滤器更改支付类型
5. 正式渲染会员列表
   1. 在mock服务器里面新建一个分页渲染的接口
   2. 在member.js文件夹下面来导出分页渲染的函数
   3. 在member路由组件里面导入表格模板，分页模板，和表单模板
   4. 表格模板按照分页渲染函数请求得到的数据渲染到页面中
   5. 分页模板一部分按照分页函数请求到的数据进行渲染（如：总页数，每一页的数量）；另一部分自己定义
      1. 当前页改变时
      2. 当前页总数改变时
      3. 以上两者需要定义两个函数来向服务器重新获取数据
   6. 表单模板
      1. 表单模板主要是用来筛选数据
      2. 功能主要是通过请求函数中的searchMap来实现的
      3. 在表单中输入相应的查询数据，点击查询按钮，就可以将请求信息发送给服务器
6. 实现新增会员的功能
   1. 新增会员模板来自于elementUI
   2. 新增会员接口 /member
   3. 当点击添加的时候，调用接口，将信息请求给服务器
   4. 需要解决的问题：每次点击新增会员的时候都需要清除表单内容
7. 实现会员的删除和编辑功能
   1. 编辑功能，mock两个接口，第一个接口是查询这个id，第二个接口是根据这个id来更新数据
   2. 删除功能
      1. elementUI的弹框组件
      2. mock的删除接口