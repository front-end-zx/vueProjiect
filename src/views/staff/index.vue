<template>
  <div>
    <!-- 数据查询 -->
    <el-form :inline="true" :model="searchMap" class="demo-form-inline" ref="ruleForm">
      <!-- 重置会看 el-form-item 组件元素的prop上是否指定了字段名，指定了才会生效 -->
      <el-form-item prop="account">
        <el-input v-model="searchMap.account" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleAdd('ruleForm')">新增</el-button>
      </el-form-item>
      <el-form-item>
        <!-- 在重置的时候需要注意：prop中的属性值要在searchMap对象中定义出来，要不然会产生第二次重置无法输入的Bug -->
        <el-button type="default" @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 渲染职工数据 -->
    <el-table :data="list" height="390" border style="width: 100%">
      <!-- type="index"可以设置当前行的序号 -->
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="account" label="账号"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="age" label="年龄"></el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column prop="wages" label="账户"></el-table-column>
      <el-table-column label="操作" width="150">
        <!--  通过scoped可以获取到row,column,$index的数据 -->
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="职工编辑"
      :visible.sync="dialogFormVisible"
      width="580px"
    >
      <el-form
        :model="pojo"
        ref="pojoForm"
        label-position="right"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="账户" prop="account">
          <el-input v-model="pojo.account" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="pojo.name" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="pojo.age" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="pojo.phone" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="薪酬" prop="wages">
          <el-input v-model="pojo.wages" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="date">
          <el-date-picker type="date" placeholder="选择日期" v-model="pojo.date" style="width: 400px;"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="pojo.id===null?addStaff('pojoForm'):upStaff('pojoForm')"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分页 -->
    <el-pagination
      class="fetch"
      @size-change="handleSizeChange"
      @current-change="handleCurrentPage"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background
    ></el-pagination>
  </div>
</template>
<script>
import Staff from "@/api/staff";
export default {
  data() {
    return {
      list: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      searchMap: {
        account: null,
        name: ""
      },
      dialogFormVisible:false,
      pojo:{
          id:null,
          account:0,
          name:'',
          age:0,
          phone:0,
          wages:0,
          date:''
      },
      rules:{
          account:[{
              required:true,
              message:'职员账户为必填项',
              trigger:'blur'
          }],
          name:[{
              required:true,
              message:'职员姓名为必填项',
              trigger:'blur'
          }]
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    //   渲染数据
    fetchData() {
      Staff.getList(this.currentPage, this.pageSize, this.searchMap).then(
        result => {
          if (result.data.flag) {
            this.list = result.data.data.rows;
            this.total = result.data.data.total;
          }
        }
      );
    },
    // 编辑当前行数据
    handleEdit(id) {
      this.handleAdd()
      Staff.getById(id).then(result=>{
          this.pojo = result.data.data
      })
    },
    // 更新当前行数据
    upStaff(formName){
        this.$refs[formName].validate(valid=>{
            if(valid){
                Staff.update(this.pojo).then(result=>{
                    if(result.data.flag){
                        this.fetchData()
                        this.dialogFormVisible = false
                        this.$message({
                            message:'更新职工信息成功',
                            type:'success'
                        })
                    }else{
                        this.$message({
                            message:'更新职员信息失败',
                            type:'warning'
                        })
                    }
                })
            }else{
                this.$message({
                    message:'表单数据校验失败，请重新输入',
                    type:'success'
                })
            }
        })
    },
    // 删除当前行数据
    handleDelete(id) {
      this.$confirm('确认删除当前职工的信息?','提示',{
          confirmButtonText:'确认删除',
          cancelButtonText:'取消删除'
      }).then(()=>{
          Staff.delete(id).then(result=>{
              if(result.data.flag){
                  this.fetchData()
                  this.$message({
                      message:'删除成功',
                      type:'success'
                  })
              }else{
                  this.$message({
                      message:'删除失败',
                      type:'warning'
                  })
              }
          })
      }).catch(()=>{
          this.$message({
              message:'取消删除',
              type:'warning'
          })
      })
    },
    // 当前页的总数据发生改变的时候
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    // 当前页发生改变时触发
    handleCurrentPage(val) {
      this.currentPage = val;
      this.fetchData();
    },
    // 新增数据之前先清除原弹出表单的内容
    handleAdd() {
        this.dialogFormVisible = true
        this.$nextTick(()=>{
            this.$refs['pojoForm'].resetFields()
        })
    },
    // 重置输入表单
    resetForm(formName){
        this.$refs[formName].resetFields()
    },
    // 新增员工
    addStaff(formName){
        this.$refs[formName].validate(valid=>{
            if(valid){
                Staff.add(this.pojo).then(result=>{
                    if(result.data.flag){
                        this.fetchData()
                        this.dialogFormVisible = false
                        this.$message({
                            message:'新增职工成功',
                            type:'success'
                        })
                    }else{
                        this.$message({
                            message:'新增职工失败',
                            type:'warning'
                        })
                    }
                })
            }else{
                this.$message({
                    message:'表单验证失败，请重新输入',
                    type:'warning'
                })
            }
        })
    }
  }
};
</script>
<style scoped>
.fetch,
.demo-form-inline {
  margin-top: 30px;
}
</style>