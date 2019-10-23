<template>
  <div>
    <!-- 数据查询 -->
    <el-form
      :inline="true"
      :model="searchMap"
      class="demo-form-inline"
      ref="ruleForm"
      :rules="rules"
    >
      <!-- 重置会看 el-form-item 组件元素的prop上是否指定了字段名，指定了才会生效 -->
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="供应商名称"></el-input>
      </el-form-item>
      <el-form-item prop="linkman" v-if="isdialog == false">
        <el-input v-model="searchMap.linkman" placeholder="联系人"></el-input>
      </el-form-item>
      <el-form-item prop="mobile" v-if="isdialog == false">
        <el-input v-model="searchMap.mobile" placeholder="联系电话"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
      </el-form-item>
      <el-form-item v-if="isdialog == false">
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </el-form-item>
      <el-form-item v-if="isdialog == false">
        <!-- 在重置的时候需要注意：prop中的属性值要在searchMap对象中定义出来，要不然会产生第二次重置无法输入的Bug -->
        <el-button type="default" @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 数据渲染表格 -->
    <el-table :data="list" height="390" border style="width: 100%" :highlight-current-row="!isdialog" @current-change="handleCurrentChange">
      <!-- type="index"可以设置当前行的序号 -->
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="name" label="供应商名称"></el-table-column>
      <el-table-column prop="linkman" label="联系人"></el-table-column>
      <el-table-column prop="mobile" label="手机号"></el-table-column>
      <el-table-column prop="remark" label="备注" v-if="isdialog == false"></el-table-column>
      <el-table-column label="操作" width="150" v-if="isdialog == false">
        <!--  通过scoped可以获取到row,column,$index的数据 -->
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="fetch"
      @size-change="handleSizeChange"
      @current-change="handleCurrentPage"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      :layout="isdialog==false?'total, sizes, prev, pager, next, jumper':'prev, pager, next, jumper'"
      :total="total"
      background
    ></el-pagination>
    <!-- 供应商编辑 -->
    <el-dialog title="供应商编辑" :visible.sync="dialogFormVisible" width="580px" v-if="isdialog == false">
      <el-form
        :model="pojo"
        ref="pojoForm"
        label-position="right"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="供应商名称" prop="name">
          <el-input v-model="pojo.name" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="pojo.linkman" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="pojo.mobile" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="pojo.remark" style="width:400px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="pojo.id===null?addSupplier('pojoForm'):updateSupplier('pojoForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Supplier from "@/api/supplier";
export default {
  props:{isdialog:Boolean},  
  data() {
    return {
      list: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      searchMap: {
        name: "",
        linkman: "",
        mobile: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "供应商名称为必填项",
            trigger: "blur"
          }
        ],
        linkman: [
          {
            required: true,
            message: "联系人名称为必填项",
            trigger: "blur"
          }
        ]
      },
      dialogFormVisible: false,
      pojo: {
        id: null,
        name: "",
        linkman: "",
        mobile: "",
        remark: ""
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 获取供应商列表数据
    fetchData() {
      Supplier.getList(this.currentPage, this.pageSize, this.searchMap).then(
        result => {
          this.list = result.data.data.rows;
          this.total = result.data.data.total;
        }
      );
    },
    // 编辑数据
    handleEdit(id) {
      this.handleAdd();
      Supplier.getId(id).then(result => {
        if (result.data.flag) {
          console.log(result.data);
          this.pojo = result.data.data;
        }
      });
    },
    updateSupplier(formName){
        this.$refs[formName].validate(valid=>{
            if(valid){
                Supplier.update(this.pojo).then(result=>{
                    if(result.data.flag){
                        console.log(result.data)
                        this.fetchData()
                        this.dialogFormVisible = false
                        this.$message({
                            message:"供应商编辑成功",
                            type:'success'
                        })
                    }else{
                        this.$message({
                            message:'会员编辑失败',
                            type:"warning"
                        })
                    }
                })
            }else{
                this.$message({
                    message:'表单验证失败',
                    type:'warning'
                })
            }
        })
    },
    // 删除数据
    handleDelete(id) {
      this.$confirm('是否删除该供应商的数据','提示',{
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
          Supplier.deleteId(id).then(result => {
            if (result.data.flag) {
              this.fetchData();
              this.$message({
                message: "删除成功",
                type: "success"
              });
            }else{
              this.$message({
                message:"删除失败",
                type:'warning'
              })
            }
          });
        })
        .catch(() => {
          this.$message({
            message: "取消删除",
            type: "warning"
          });
        });
    },
    // 当列表当前每页数据改变时
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    // 当前页改变时
    handleCurrentPage(val) {
      this.currentPage = val;
      this.fetchData();
    },
    // 重置搜索框
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //新增之前先清除表单
    handleAdd() {
      this.dialogFormVisible = true;
      // this.$nextTick()它是一个异步事件，当渲染结束以后，它的回调函数才会被执行
      this.$nextTick(() => {
        // 导出窗口之后，需要加载DOM，就需要花费一点时间，我们就应该等待它加载完DOM之后，再调用重置表单的函数
        this.$refs["pojoForm"].resetFields();
      });
    },
    // 新增供应商
    addSupplier(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          Supplier.add(this.pojo).then(result => {
            if (result.data.flag) {
              this.fetchData();
              this.dialogFormVisible = false;
              this.$message({
                message: "新增供应商成功",
                type: "success"
              });
            } else {
              this.$message({
                message: "新增供应商失败",
                type: "warning"
              });
            }
          });
        } else {
          this.$message({
            message: "表单验证失败，请重新输入",
            type: "warning"
          });
        }
      });
    },
    // 双击选中当前行
    handleCurrentChange(currentRow){
      this.$emit('getSupplier',currentRow)
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