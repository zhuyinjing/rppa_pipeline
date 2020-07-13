<template>
  <el-row :gutter="20">
    <el-col :span="18" :offset="2">
      <div class="grid-content bg-purple">
        <br>

        <el-button type="primary" size="medium" @click="createProjectDialog = true">+ 创建分析项目</el-button><br><br>

        <el-card class="" shadow="hover">
          <el-row :gutter="22">
            <el-col :span="2"><div class="grid-content bg-purple line-height-40">分析ID</div></el-col>
            <el-col :span="4"><div class="grid-content bg-purple">
              <el-input v-model="projectId" placeholder="请输入内容" clearable></el-input>
            </div></el-col>
            <el-col :span="2"><div class="grid-content bg-purple line-height-40">分析名称</div></el-col>
            <el-col :span="4"><div class="grid-content bg-purple">
              <el-input v-model="projectName" placeholder="请输入内容" clearable></el-input>
            </div></el-col>
            <el-col :span="2"><div class="grid-content bg-purple line-height-40">分析时间</div></el-col>
            <el-col :span="10"><div class="grid-content bg-purple">
              <el-date-picker
                v-model="analysisTime"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right">
              </el-date-picker>
            </div></el-col>
            <el-col :span="4" :offset="18"><div class="grid-content bg-purple line-height-40">
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
                <th>分析ID</th>
                <th>分析名称</th>
                <th>创建时间</th>
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

    <el-dialog :title="$t('project_list.create_project')" :visible.sync="createProjectDialog" width="30%">
      <el-form :model="form">
        <el-form-item :label="$t('project_list.project_name')">
          <el-input v-model="form.name" auto-complete="off" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('project_list.project_introduction')">
          <el-input v-model="form.description" auto-complete="off" clearable></el-input>
        </el-form-item>
        <div class="margin-bottom-10">
          <label for="">{{$t('project_list.species_type')}}</label>
        </div>
        <el-select v-model="form.species" :placeholder="$t('project_list.species_type')">
          <el-option :value="key" v-for="(item, key) in $store.state.speciesArr" :key="key">{{key}}</el-option>
        </el-select>
        <div class="selectDiv">
          <label for="">{{$t('project_list.sequencing_type')}}</label>
        </div>
        <el-select v-model="form.type" :placeholder="$t('project_list.species_type')">
          <el-option v-for="item in typeList" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createProjectDialog = false">{{$t('button.cancel')}}</el-button>
        <el-button v-if="createLoading === false" type="primary" @click="createClick()">{{$t('button.confirm')}}</el-button>
        <el-button v-else type="primary" :loading="true">正在创建中...</el-button>
      </div>
  </el-dialog>

  </el-row>
</template>
<script>
import login from '@/components/login'
export default {
  data () {
    return {
      loginBtnShow: false,
      createProjectDialog: false,
      projectList: null,
      form: {
        id: '',
        name: '',
        description: '',
        species: 'Human (Homo sapiens)',
        type: 'BulkRNA'
      },
      typeList: ['BulkRNA', 'DEG', 'Time_Series'],
      deleteId: '',
      table: '',
      projectId: '',
      type: '',
      projectName: '',
      createLoading: false,
      pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        analysisTime: ''
    }
  },
  components: {
    login
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
    this.getProjects()
  },
  methods: {
    search () {
      this.getProjects()
      setTimeout(() => {
        this.table.ajax.reload()  // 重新 load table
      }, 0)
    },
    getProjects () {
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
              "sAjaxSource" : "/server/projects?username=" + self.$store.state.username + '&p=' + self.projectId + '&projectName=' + self.projectName + '&type=' + self.type,
              "aoColumns" : [
                  {
                    "mDataProp" : "id"
                },
                  {
                    "mDataProp" : "name"
                },{
                    "mDataProp" : "openTime",
                    "mRender" : function(data, type, full) {
                        let time = data.split('T')[0] + ' ' + data.split('T')[1].split('.')[0]
                        return time
                    }
                }, {
                    "mDataProp" : "id",
                      "mRender" : function(data, type, full) {
                        return '<button id="uploadFileBtn" value="'+ data + '" class="el-button el-button--warning el-button--mini" @click="createExperiment()">上传文件</button>' + '<button id="runTaskBtn" value="'+ data + '" class="el-button el-button--success el-button--mini" @click="createExperiment()">运行分析</button>'
                    }
                }
              ],
            }
          );
          $('#table tbody').on( 'click', '#uploadFileBtn', function () {
            var row = $(this).parents('tr')[0]
            var data = $("#table").dataTable().fnGetData(row)
            self.upload(data)
          })
          $('#table tbody').on( 'click', '#runTaskBtn', function () {
            var row = $(this).parents('tr')[0]
            var data = $("#table").dataTable().fnGetData(row)
            self.runTask(data)
          })
          $('#table tbody').on( 'click', '#deleteBtn', function () {
            var row = $(this).parents('tr')[0]
            var data = $("#table").dataTable().fnGetData(row)
            self.deleteProject(data.id)
          })
        })
    },
    login () {
      window.location.href = document.location.origin + '/login'
    },
    createClick () {
      let self = this
      if (!this.form.name) {
        this.$message.error('项目名不能为空!')
        return
      }
      this.createLoading = true // 正在创建中... 显示
      let formData = new FormData()
      formData.append('username', this.$store.state.username)
      formData.append('name', this.form.name)
      formData.append('description', this.form.description)
      formData.append('speciesId', this.$store.state.speciesArr[this.form.species])
      formData.append('type', this.form.type)
      this.axios.post('/server/create_project', formData).then((res) => {
        if (res.data.message_type === 'success') {
          this.$message.success('项目创建成功！');
          this.table.ajax.reload(function () {
              self.table.columns.adjust().draw();
          },false);
        } else {
          this.$message.error(res.data.message);
        }
        this.createLoading = false
        this.form.name = ''
        this.form.description = ''
        this.createProjectDialog = false
      })
    },
    deleteProject (id) {
      this.deleteId = id
      this.$confirm('确认删除该项目吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          let formData = new FormData()
          formData.append('username', this.$store.state.username)
          formData.append('p', this.deleteId)
          this.axios.post('/server/delete_project', formData).then((res) => {
            if (res.data.message_type === 'success') {
              this.$message({
                type: 'success',
                message: '删除成功!',
                duration: 1000
              })
              this.getProjects()
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
    createExperiment (item) {
      this.commitStore(item)
      this.$router.push({'name': 'create_experiment'})
    },
    upload (item) {
      this.commitStore(item)
      this.$router.push({'name': 'upload_file'})
    },
    runTask (item) {
      this.commitStore(item)
      this.$router.push({'name': 'run_task'})
    },
    report (item) {
      this.commitStore(item)
      this.axios.get('/server/rnaseq_report_index?username=' + this.$store.state.username + '&p=' + this.$store.state.projectId).then((res) => {
        if (res.data.experimentDesign !== null) {
          this.$store.commit('setinfo', res.data)
          this.$router.push({'name': 'report'})
        } else {
          this.$message.error('实验设计为空！')
        }
      }).catch(e => {
        this.$message.error('请求出错！')
      })
    },
    commitStore (item) {
      this.$store.commit('setprojectType', item.type)
      this.$store.commit('setprojectName', item.name)
      this.$store.commit('setprojectId', item.id)
      this.$store.commit('setspecies', item.speciesInfoEntity.id)
    },
    clear () {
      this.projectId = ''
      this.projectName = ''
      this.type = ''
    },
  }
}
</script>

<style scoped="true">
.line-height-40 {
  line-height: 40px;
}
.textStyle {
  text-align: center;
  margin-top: 20px;
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
