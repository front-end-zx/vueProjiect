<template>
  <div>
    <el-form :inline="true" :model="searchMap" class="demo-form-inline" ref="ruleForm">
      <!-- 重置会看 el-form-item 组件元素的prop上是否指定了字段名，指定了才会生效 -->
      <el-form-item prop="cardNum">
        <el-input v-model="searchMap.cardNum" placeholder="会员卡号"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item label="支付类型" prop="payType">
        <el-select v-model="searchMap.payType" placeholder="支付类型">
          <el-option
            v-for="item in payTypeOption"
            :key="item.type"
            :label="item.name"
            :value="item.type"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="birthday">
        <el-date-picker
          v-model="searchMap.birthday"
          type="date"
          value-format="yyyy-mm-dd"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchDate">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </el-form-item>
      <el-form-item>
        <!-- 在重置的时候需要注意：prop中的属性值要在searchMap对象中定义出来，要不然会产生第二次重置无法输入的Bug -->
        <el-button type="default" @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" height="390" border style="width: 100%">
      <!-- type="index"可以设置当前行的序号 -->
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="cardNum" label="卡号"></el-table-column>
      <el-table-column prop="name" label="姓名" width="70"></el-table-column>
      <el-table-column prop="birthday" label="生日"></el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column prop="integral" label="积分" width="80"></el-table-column>
      <el-table-column prop="money" label="账户余额"></el-table-column>
      <el-table-column prop="payType" label="支付方式" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.payType | payTypeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
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
    <!-- 新增会员对话框 -->
    <el-dialog title="会员编辑" :visible.sync="dialogFormVisible" width="580px">
      <el-form
        :model="pojo"
        ref="pojoForm"
        label-position="right"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="会员卡号" prop="cardNum">
          <el-input v-model="pojo.cardNum" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="会员姓名" prop="name">
          <el-input v-model="pojo.name" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="会员生日" prop="birthday">
          <el-date-picker
            v-model="pojo.birthday"
            type="date"
            value-format="yyyy-mm-dd"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="会员手机" prop="phone">
          <el-input v-model="pojo.phone" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="会员积分" prop="integer">
          <el-input v-model="pojo.integry" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="开户金额" prop="money">
          <el-input v-model="pojo.money" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="支付方式" prop="payType">
          <el-select v-model="pojo.payType" placeholder="支付类型">
            <el-option
              v-for="item in payTypeOption"
              :key="item.type"
              :label="item.name"
              :value="item.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员地址" prop="address">
          <el-input type="textarea" v-model="pojo.address" style="width:400px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="pojo.id===null?addMember('pojoForm'):upDateMember('pojoForm')"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import MemberApi from "@/api/member";
// 定义过滤器需要的数据
const payTypeOption = [
  { type: "1", name: "现金" },
  { type: "2", name: "支付宝" },
  { type: "3", name: "微信" },
  { type: "4", name: "银行卡" }
];
export default {
  data() {
    return {
      list: [],
      total: 0, //总记录数
      currentPage: 1, //当前页码
      pageSize: 10, //每页多少条数据
      searchMap: {
        cardNum: "",
        name: "",
        payType: "",
        birthday: ""
      }, //条件查询绑定的条件值
      payTypeOption,
      dialogFormVisible: false, //控制新增对话框的显示和隐藏
      pojo: {
        id: null,
        cardNum: "",
        name: "",
        birthday: "",
        phone: "",
        integer: 0,
        money: 0,
        payType: "",
        address: ""
      },
      rules: {
        cardNum: [
          { required: true, message: "请输入会员卡号", trigger: "blur" }
        ],
        name: [{ required: true, message: "请输入会员姓名", trigger: "blur" }],
        payType: [
          { required: true, message: "请输入支付类型", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.fetchDate();
  },
  methods: {
    // 当前页码改变时触发
    handleCurrentChange(val) {
      console.log(val);
      this.currentPage = val;
      this.fetchDate();
    },
    // 当前页的总数发生改变时触发
    handleSizeChange(val) {
      console.log(val);
      this.pageSize = val;
      this.fetchDate();
    },
    // 分页函数
    fetchDate() {
      MemberApi.getPage(this.currentPage, this.pageSize, this.searchMap).then(
        result => {
          this.list = result.data.data.rows;
          this.total = result.data.data.total;
        }
      );
    },
    //目标会员编辑功能
    handleEdit(id) {
      this.handleAdd();
      MemberApi.getMemberId(id).then(result => {
        console.log(result.data);
        this.pojo = result.data.data;
        console.log(this.pojo);
      });
    },
    // upDateMember(){
    //   console.log('update')
    // },
    //目标会员编辑后提交
    upDateMember(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          MemberApi.update(this.pojo).then(result => {
            if (result.data.flag) {
              this.fetchDate();
              this.dialogFormVisible = false;
              this.$message({
                message: "编辑会员信息成功",
                type: "success"
              });
            } else {
              this.$message({
                message: "编辑会员信息失败，请返回",
                type: "warning"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    // 删除会员信息
    handleDelete(id) {
      this.$confirm("是否删除该会员信息", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          MemberApi.deleteId(id).then(result => {
            if (result.data.flag) {
              this.fetchDate();
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
    // 表单重置功能（高功能来自于element表单）
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 新增会员
    addMember(formName) {
      console.log(this.pojo);
      this.$refs[formName].validate(valid => {
        if (valid) {
          MemberApi.add(this.pojo).then(result => {
            console.log(result.data);
            if (result.data.flag) {
              this.fetchDate();
              this.$message({
                message: "新增会员成功！",
                type: "success"
              });
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: "新增会员失败，请联系管理人员",
                type: "warning"
              });
            }
          });
        }
      });
    },
    // 新增窗口之前先清除新增表单数据
    handleAdd() {
      this.dialogFormVisible = true;
      // this.$nextTick()它是一个异步事件，当渲染结束以后，它的回调函数才会被执行
      this.$nextTick(() => {
        // 导出窗口之后，需要加载DOM，就需要花费一点时间，我们就应该等待它加载完DOM之后，再调用重置表单的函数
        this.$refs["pojoForm"].resetFields();
      });
    }
  },
  filters: {
    payTypeFilter(type) {
      //   获取自定义数据中type样式和渲染的列表中type相同的
      const payObj = payTypeOption.find(obj => obj.type === type);
      //   返回该type对应的name给列表
      return payObj ? payObj.name : null;
    }
  }
};
</script>
<style scoped>
.fetch,
.demo-form-inline {
  margin-top: 20px;
}
</style>