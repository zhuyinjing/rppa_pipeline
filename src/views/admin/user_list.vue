<template>
  <el-row :gutter="20">
    <el-col :span="18" :offset="2">
      <div class="grid-content bg-purple">
        <br>

        <el-button type="primary" size="medium" @click="createUserDialog = true">+ 创建用户</el-button><br><br>

        <el-card class="" shadow="hover">
          <el-row :gutter="22">
            <el-col :span="3"><div class="grid-content bg-purple line-height-40">用户名</div></el-col>
            <el-col :span="8"><div class="grid-content bg-purple">
              <el-input v-model="selectUsername" placeholder="请输入内容" clearable></el-input>
            </div></el-col>
            <el-col :span="6"><div class="grid-content bg-purple line-height-40">
              <el-button type="primary" size="small" @click="search()">查询</el-button>
              <el-button type="" size="small" @click="clear()">清空</el-button>
            </div></el-col>
          </el-row>
        </el-card>
        <br>

        <div class="">
          <table id="table" cellspacing="0" width="100%" class="display table table-striped table-bordered">
            <thead>
              <tr>
                <th>用户ID</th>
                <th>用户名</th>
                <th>用户角色</th>
                <th>操作</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
      <div class="clear">

      </div>
      </div>
    </el-col>

    <el-dialog title="新建用户" :visible.sync="createUserDialog" width="30%">
      <el-form :model="form" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username" :rules="{required: true, message: '用户名不能为空', trigger: 'blur'}">
          <el-input v-model="form.username" auto-complete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="form.pass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="form.checkPass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createUser('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="修改密码" :visible.sync="updatePwdDialog" width="30%">
      <el-form :model="pwdForm" status-icon :rules="rulesPwd" ref="pwdForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username" :rules="{required: true, message: '用户名不能为空', trigger: 'blur'}">
          <el-input v-model="pwdForm.username" auto-complete="off" :disabled="true" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="pwdForm.pass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="pwdForm.checkPass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changePassword('pwdForm')">提交</el-button>
          <el-button @click="resetForm('pwdForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="关联项目" :visible.sync="projectDialog" width="30%">
      <el-form :model="projectForm" ref="dynamicValidateForm" label-width="100px">
        <el-form-item
          prop="username"
          label="用户名"
        >
        {{projectUsername}}
        </el-form-item>
        <el-form-item
          prop="username"
          label="已关联项目"
        >
        {{existsProject}}
        </el-form-item>
        <el-form-item
          v-for="(item, index) in projectForm.projectIdArr"
          :label="'项目ID'"
          :key="index + 'id'"
          :prop="'projectIdArr.' + index + '.id'"
          :rules="{
            required: true, message: '项目 ID 不能为空', trigger: 'blur'
          }"
        >
          <el-input v-model="item.id" style="width: 70%" clearable></el-input> <el-button @click.prevent="projectForm.projectIdArr.splice(index, 1)">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changeProject('dynamicValidateForm')">提交</el-button>
          <el-button type="danger" @click="projectForm.projectIdArr.push({id: ''})">新增项目</el-button>
          <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </el-row>
</template>
<script>
export default {
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.form.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    var validateChangePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.pwdForm.checkPass !== '') {
          this.$refs.pwdForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validateChangePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.pwdForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      createUserDialog: false,
      form: {
        username: '',
        pass: '',
        checkPass: '',
      },
      updatePwdDialog: false,
      pwdForm: {
        username: '',
        pass: '',
        checkPass: '',
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      rulesPwd: {
        pass: [
          { validator: validateChangePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validateChangePass2, trigger: 'blur' }
        ]
      },
      table: '',
      projectId: '',
      type: '',
      selectUsername: '',
      projectDialog: false,
      projectForm: {
        projectIdArr: [{id: ''}]
      },
      projectUsername: '',
      existsProject: ''
    }
  },
  components: {
  },
  created () {
    this.axios.get('/server/get_species_info?username=' + this.$store.state.username).then(res => {
      if (res.data.message_type === 'success') {
        this.form.species = Object.keys(res.data.speciesInfo)[0] // 默认显示第一个
        this.$store.commit('setspeciesArr', res.data.speciesInfo)
      }
    })
  },
  mounted () {
    this.getUsers()
  },
  methods: {
    search () {
      this.getUsers()
      setTimeout(() => {
        this.table.ajax.reload()  // 重新 load table
      }, 0)
    },
    getUsers () {
      let self = this
      $(document).ready(function() {
          self.table = $('#table').DataTable(
            {
              "pageLength": 25,
              "bPaginate" : true,//分页工具条显示
              //"sPaginationType" : "full_numbers",//分页工具条样式
              "bStateSave" : true, //是否打开客户端状态记录功能,此功能在ajax刷新纪录的时候不会将个性化设定回复为初始化状态
              "bScrollCollapse" : true, //当显示的数据不足以支撑表格的默认的高度
              "bLengthChange" : true, //每页显示的记录数
              "bFilter" : false, //搜索栏
              "bSort" : false, //是否支持排序功能
              "bInfo" : true, //显示表格信息
              "bAutoWidth" : true, //自适应宽度
              "bJQueryUI" : false,//是否开启主题
              "bDestroy" : true,
              "bProcessing" : true, //开启读取服务器数据时显示正在加载中……特别是大数据量的时候，开启此功能比较好
              "bServerSide" : true,//服务器处理分页，默认是false，需要服务器处理，必须true
              "sAjaxDataProp" : "aData",
              //通过ajax实现分页的url路径
              "sAjaxSource" : "/admin/get_user_list?username=" + self.selectUsername,
              "aoColumns" : [
                  {
                    "mDataProp" : "id"
                },
                  {
                    "mDataProp" : "username"
                }, {
                    "mDataProp" : "authorities",
                    "mRender" : function(data, type, full) {
                        return data.map(item => item.authority).join(", ")
                    }
                }, {
                    "mDataProp" : "username",
                    "mRender" : function(data, type, full) {
                      return '<button id="passwordBtn" class="el-button el-button--danger el-button--mini">修改密码</button>' + '<button id="projectBtn" class="el-button el-button--primary el-button--mini">关联项目</button>' + '<button id="deleteBtn" class="el-button el-button--danger el-button--mini is-plain">'+ '<i class="el-icon-delete"></i>'+'</button>'
                    }
                }
              ],
            }
          );

          $('#table tbody').on( 'click', '#passwordBtn', function () {
            var row = $(this).parents('tr')[0]
            var data = $("#table").dataTable().fnGetData(row)
            self.pwdForm.username = data.username
            self.updatePwdDialog = true
          })

          $('#table tbody').on( 'click', '#projectBtn', function () {
            var row = $(this).parents('tr')[0]
            var data = $("#table").dataTable().fnGetData(row)
            self.axios.get('/server/get_project_by_user?user=' + data.username).then(res => {
              if (res.data.message_type === 'success') {
                self.existsProject = res.data.projectList.length > 0 ? res.data.projectList.map(d => d.id).join(', ') : '暂无'
              }
            })
            self.projectDialog = true
            self.projectUsername = data.username
          })

          $('#table tbody').on( 'click', '#deleteBtn', function () {
            var row = $(this).parents('tr')[0]
            var data = $("#table").dataTable().fnGetData(row)
            self.deleteUser(data.username)
          })
        })
    },
    createUser (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.axios.get('/admin/create_user?username=' + this.form.username + '&password=' + this.form.pass).then((res) => {
            if (res.data.message_type === 'success') {
              this.$message.success('用户创建成功！');
              this.createUserDialog = false
              this.resetForm(formName) // 清空 form 表单数据
              this.getUsers()
            } else {
              this.$message.error(res.data.message);
            }
          })
        } else {
          return false;
        }
      });
    },
    changePassword (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.axios.get('/admin/change_password?username=' + this.pwdForm.username + '&password=' + this.pwdForm.pass).then((res) => {
            if (res.data.message_type === 'success') {
              this.$message.success('密码修改成功！');
              this.updatePwdDialog = false
              this.resetForm(formName) // 清空 form 表单数据
            } else {
              this.$message.error(res.data.message);
            }
          })
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
       this.$refs[formName].resetFields();
     },
    deleteUser (username) {
      this.$confirm('确认删除该用户吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.axios.get('/admin/delete_user?username=' + username).then((res) => {
            if (res.data.message_type === 'success') {
              this.$message({
                type: 'success',
                message: '删除成功!',
                duration: 1000
              })
              this.getUsers()
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!',
                duration: 1000
              });
            }
          })
        }).catch(() => {});
    },
    changeProject (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let pList = this.projectForm.projectIdArr.map(item => item.id)
          this.axios.get('/admin/change_project_user?changeUserName=' + this.projectUsername + '&pList=' + pList).then(res => {
            if (res.data.message_type === 'success') {
              this.$message.success('项目关联成功！');
              this.projectDialog = false
              this.resetForm(formName) // 请求成功后清空 form 表单数据
            } else {
              this.$message.error(res.data.message);
            }
          })
        } else {
          return false;
        }
      });
    },
    clear () {
      this.projectId = ''
      this.selectUsername = ''
      this.type = ''
    },
  }
}
</script>

<style scoped="true">
.line-height-40 {
  line-height: 40px;
}
.text {
    font-size: 16px;
  }

  .item {
    margin: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 500px;
    margin: 0 auto;
  }

  .float-right {
    float: right;
  }

  .tableDiv {
    width: 60%;
    margin: 0 auto;
  }

  .table-item {
    border:1px solid #eee;
    margin-bottom:20px;
  }

  .titleDiv {
    color: #fff;
    border-bottom: 1px solid #64b5ff;
    line-height: 40px;
    padding-left: 10px;
    background-color: #64b5ff;
  }

  .btnDiv {
    padding:10px;
  }

  .margin-bottom-10 {
    margin-bottom: 10px;
  }

  .selectDiv {
    margin-top:20px;
    margin-bottom:10px;
  }

  .createbtn {
    width: 60%;
    margin: 19px auto;
  }
  .clear {
    clear: both;
  }
  .min-width-div {
    min-width: 1300px;
  }
</style>
