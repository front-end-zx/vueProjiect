<template>
  <div>
    <!-- 数据查询 -->
    <el-form :inline="true" :model="searchMap" class="demo-form-inline" ref="ruleForm">
      <!-- 重置会看 el-form-item 组件元素的prop上是否指定了字段名，指定了才会生效 -->
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="商品名称"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="searchMap.code" placeholder="商品编号"></el-input>
      </el-form-item>
      <el-form-item prop="supplierName">
        <!-- 在组件中绑定原生事件需要在事件的名字后缀.native -->
        <el-input
          v-model="searchMap.supplierName"
          placeholder="选择供应商"
          readonly="readonly"
          @click.native="dialogSupplierVisible=true"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="$refs['ruleForm'].resetFields()">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 数据渲染表格 -->
    <el-table :data="list" height="390" border style="width: 100%">
      <!-- type="index"可以设置当前行的序号 -->
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="name" label="商品名称"></el-table-column>
      <el-table-column prop="code" label="商品编码"></el-table-column>
      <el-table-column prop="spec" label="商品规格"></el-table-column>
      <el-table-column prop="retailPrice" label="零售价"></el-table-column>
      <el-table-column prop="purchasePrice" label="进货价"></el-table-column>
      <el-table-column prop="storageNum" label="库存数量"></el-table-column>
      <el-table-column prop="supplierName" label="供应商"></el-table-column>
      <el-table-column label="操作" width="150">
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
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background
    ></el-pagination>
    <!-- 弹出选择供应商 -->
    <el-dialog title="选择供应商" :visible.sync="dialogSupplierVisible" width="580px">
      <supplier @getSupplier="supplieroption" :isdialog="true"></supplier>
    </el-dialog>
    <!-- 弹出添加商品 -->
    <el-dialog title="商品编辑" :visible.sync="dialogFormVisible" width="580px">
      <el-form
        :model="pojo"
        ref="pojoForm"
        label-position="right"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="pojo.name" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="商品编号" prop="code">
          <el-input v-model="pojo.code" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="商品规格" prop="spec">
          <el-input v-model="pojo.spec" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="零售价" prop="retailPrice">
          <el-input v-model="pojo.retailPrice" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="进货价" prop="purchasePrice">
          <el-input v-model="pojo.purchasePrice" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="库存数量" prop="storageNum">
          <el-input v-model="pojo.storageNum" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="供应商" prop="supplierName">
          <el-input
            v-model="pojo.supplierName"
            style="width:400px"
            placeholder="选择供应商"
            readonly="readonly"
            @click.native="addSupplierName"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="pojo.id===null?addGoods('pojoForm'):updateGoods('pojoForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Goods from "@/api/goods";
import Supplier from "@/views/supplier";
export default {
  // 将supplier组件作为当前组件的子组件
  components: {
    Supplier
  },
  data() {
    return {
      list: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      searchMap: {
        name: "",
        code: "",
        supplierName: 0.0,
        purchasePrice: 0.0,
        storageNum: 0,
        supplierName: ""
      },
      dialogSupplierVisible: false,
      dialogFormVisible: false,
      pojo: {
        name: "",
        code: "",
        spec: "",
        retailPrice: "",
        supplierName:'',
        supplierId:null
      },
      rules: {
        name: [
          {
            required: true,
            message: "商品名称为必填项",
            trigger: "blur"
          }
        ],
        code: [
          {
            required: true,
            message: "商品编号为必填项",
            trigger: "blur"
          }
        ]
      },
      isEdit: false //是否为编辑窗口
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 获取数据
    fetchData() {
      Goods.getList(this.currentPage, this.pageSize, this.searchMap).then(
        result => {
          console.log(result.data);
          if (result.data.flag) {
            this.list = result.data.data.rows;
            this.total = result.data.data.total;
          }
        }
      );
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    supplieroption(currentRow) {
      if (this.isEdit == false) {
        this.searchMap.supplierName = currentRow.name;
        this.searchMap.supplierId = currentRow.id;
      }else{
        this.pojo.supplierName = currentRow.name
        this.pojo.supplierId = currentRow.id
      }
      this.isEdit = false
      this.dialogSupplierVisible = false;
    },
    handleAdd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["pojoForm"].resetFields();
      });
    },
    // 在新增商品的表单里面打开选择供应商
    addSupplierName() {
      this.isEdit = true;
      this.dialogSupplierVisible = true;
    },
    // 新增商品
    addGoods(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          Goods.add(this.pojo).then(result => {
            if (result.data.flag) {
              this.fetchData();
              this.dialogFormVisible = false;
              this.$message({
                message: "新增成功",
                type: "success"
              });
            } else {
              this.$message({
                message: "新增失败，请重新输入",
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
    // 编辑当前行
    handleEdit(id) {
      this.handleAdd()
      Goods.getById(id).then(result=>{
        console.log('正在进入编辑状态')
        this.pojo = result.data.data
      })
    },
    // 确认编辑
    updateGoods(formName){
      this.$refs[formName].validate(valid=>{
        if(valid){
          Goods.update(this.pojo).then(result=>{
            if(result.data.flag){
              this.fetchData()
              this.dialogFormVisible = false
              this.$message({
                message:'商品信息编辑成功',
                type:'succesee'
              })
            }else{
              this.$message({
                message:'商品编辑失败',
                type:'warning'
              })
            }
          })
        }else{
          this.$message({
            message:'商品列表刷新失败，请稍后重试',
            type:'warning'
          })
        }
      })
    },
    // 删除当前行
    handleDelete(id) {
      this.$confirm('是否删除该商品数据','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      })
      .then(()=>{
        Goods.delete(id).then(result=>{
          console.log(result.data)
          if(result.data.flag){
            this.fetchData()
            this.$message({
              message:'删除成功',
              type:'success'
            })
          }else{
            this.$message({
              message:'删除失败，请稍后重试',
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