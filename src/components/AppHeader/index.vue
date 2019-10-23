<template>
  <div class="header">
    <a href="#/">
      <img src="@/assets/logo.png" width="25px" alt class="logo" />
      <span class="company">大傻个后台管理系统</span>
    </a>
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        欢迎您，{{user.name}}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-edit" command="a">修改密码</el-dropdown-item>
        <el-dropdown-item icon="el-icon-error" command="b">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog 
      title="修改密码"
      :visible.sync="dialogFormVisible"
      width="580px">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="旧密码" prop="oldPass">
          <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { logout } from "@/api/login";
import Password from "@/api/password"
export default {
  data(){
    // 密码验证规则
    const validateOldPass = (rule, value, callback)=>{
      Password.checkPwd(this.user.id,this.ruleForm.oldPass).then(result=>{
        if(result.data.flag){
          callback()
        }else{
          callback(new Error(result.data.message))
        }
      })
    }
    const validateNewPass = (rule,value,callback)=>{
      if(value!==this.ruleForm.pass){
        callback(new Error("两次输入的密码不一致"))
      }else{
        callback()
      }
    }
    return {
      user: JSON.parse(localStorage.getItem('dsg-msm-user')),
      dialogFormVisible:false,
      ruleForm:{
        oldPass:'',
        pass:'',
        checkPass:''
      },
      rules:{
        oldPass:[
          {
            required:true,
            message:'旧密码不能为空',
            trigger:'blur'
          },
          {
            validator: validateOldPass, 
            trigger: 'blur' 
          }
        ],
        pass:[{
          required:true,
          message:'新密码不能为空',
          trigger:'blur'
        }],
        checkPass:[
          {
            required:true,
            message:'确认密码不能为空',
            trigger:'blur'
          },
          {
            validator: validateNewPass, 
            trigger: 'change' 
          }
        ]
      }
    }
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case "a":
          this.handlePwd()
          break;
        case "b":
          this.handleLayout();
      }
    },
    // 退出登录
    handleLayout() {
      // 获取当前的token值
      const token = localStorage.getItem("dsg-msm-token");
      // 调用退出登录函数
      logout(token).then(result => {
        if (result.data.flag) {
          // 当返回退出成功的时候
          // 清除token
          // 清除user
          // 路由指向登录界面
          localStorage.removeItem("dsg-msm-token");
          localStorage.removeItem("dsg-msm-user");
          this.$router.push("/login");
        }
      });
    },
    // 修改密码
    handlePwd() {
      this.dialogFormVisible = true
    },
    // 提交密码
    submitForm(formName){
      this.$refs[formName].validate(valid=>{
        if(valid){
          Password.updatePwd(this.user.id,this.ruleForm.newPass).then(result=>{
            console.log(result)
            if(result.data.flag){
              this.$message({
                message:'密码修改成功，请重新登录...',
                type:'success'
              })
              this.dialogFormVisible = false
              this.handleLayout()
            }else{
              this.$message({
                message:'密码修改失败，请稍后重试',
                type:'warning'
              })
            }
          })
        }else{
          return false
        }
      })
    },
    // 重置修改密码表单
    resetForm(formName){
      this.$refs[formName].resetFields()
    }
  }
};
</script>
<style scoped>
.logo {
  vertical-align: middle;
  padding: 0px 10px 0px 40px;
}
.company {
  position: absolute;
  color: #fff;
}
.el-dropdown {
  float: right;
  margin-right: 40px;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
</style>