<template>
  <div class="login-wrap">
    <!-- Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可 -->
    <!-- 但是需要注意的是prop的属性值要与input绑定的数据的名称四相同的，否则的话，即使输入内容也会报错 -->
    <el-form :model="form" :rules="rules" ref="form" label-width="80px" class="login-form">
      <h2 class="login-title">大傻个会员管理系统</h2>
      <el-form-item label="账号：" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="password">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">立即登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
// 按需导入登录验证函数和获取用户信息函数
import { login, getUserInfo } from "@/api/login";

export default {
  data() {
    return {
      form: {
        name: "",
        password: ""
      },
      rules: {
        name: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  // 下面这个方法的外壳是使用的elementUI登录校验组件
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        console.log(valid);
        if (valid) {
          // 调用登录验证
          login(this.form.name, this.form.password).then(response => {
            console.log(response);
            if (response.data.flag) {
              // 验证成功，通过token去获取用户信息
              getUserInfo(response.data.data.token).then(result => {
                if (result.data.flag) {
                  console.log(result, response.data.data.token);
                  // 保存数据
                  // 1.token
                  // 2.用户信息
                  localStorage.setItem(
                    "dsg-msm-user",
                    JSON.stringify(result.data.data)
                  );
                  localStorage.setItem(
                    "dsg-msm-token",
                    JSON.stringify(response.data.data.token)
                  );
                  this.$message({
                    message: "登录成功，跳转至首页",
                    type: "success"
                  });
                  this.$router.push("/");
                }else{
                  this.$message.error("登录失败，请重新验证用户名或密码是否正确");
                }
              });
            } else {
              this.$message.error("登录失败，请重新输入用户名和密码");
            }
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style scoped>
.login-wrap {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url("../../assets/login-bg.jpg") repeat-y;
}
.login-form {
  width: 350px;
  padding: 25px;
  margin: 150px auto;
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid #eee;
  border-radius: 25px;
}
.login-title {
  color: #333;
  text-align: center;
}
</style>