<template>
  <div class="">
      <div class="">
        <imgMenuShowComp></imgMenuShowComp>

        <el-breadcrumb separator="/" style="margin:5px 0 50px 0">
          <el-breadcrumb-item :to="{ path: 'report' }">{{$t('report.project')}} {{$store.state.projectName}}</el-breadcrumb-item>
          <el-breadcrumb-item>基因融合鉴定与注释</el-breadcrumb-item>
        </el-breadcrumb>

        <h2>基因融合鉴定与注释</h2>

        <el-card class="" style="width:1300px;min-width:1300px" shadow="hover">
          <div class="" style="display:inline-block;vertical-align:top;">
            <div class="">
              <div class="labelStyle">
                <label for="maxpval" class="label-font">geneId</label>
              </div>
              <el-input
                style="width:400px;"
                type="textarea"
                :rows="3"
                :placeholder="$t('input.split')"
                v-model="textareaGeneId">
              </el-input>
            </div>
          </div>
          <div class="" style="display:inline-block;vertical-align:top;">
            <div class="">
              <div class="labelStyle">
                <label for="maxpval" class="label-font">sampleName</label>
              </div>
              <el-input
                style="width:400px;"
                type="textarea"
                :rows="3"
                :placeholder="$t('input.split')"
                v-model="textareaSampleName">
              </el-input>
            </div>
            <br>
            <div class="">
              <div class="labelStyle">
              </div>
              <el-button style="float:right" type="info" @click="clear()">{{$t('button.clear')}}</el-button>
              <el-button style="float:right;margin-right:10px;" type="primary" @click="search()">{{$t('button.select')}}</el-button>
            </div>
          </div>
        </el-card>
        <br>

        <!-- <a :href="fileUrl" download ref="downloadA"></a>

        <el-button size="mini" type="primary" icon="el-icon-download" plain @click="exportTable()">导出</el-button> <br><br> -->

        <!-- <div class="overflow-auto"> -->
        <div class="">
          <table id="patients" cellspacing="0" class="display table table-striped table-bordered">
              <thead>
              <tr>
                <th>geneId</th>
                <th>geneName</th>
                <th>sampleName</th>
                <th>pfamId</th>
                <th>pfamDesc</th>
                <th>操作</th>
              </tr>
              </thead>
          </table>
        </div>
      </div>
      <div class="clear">

      </div>

      </div>
</template>

<script>
import imgMenuShowComp from '@/components/imgMenuShowComp.vue'

export default {
  data () {
    return {
      textareaSampleName: '',
      textareaGeneId: '',
      fileUrl: '',
    }
  },
  components: {
    imgMenuShowComp
  },
  mounted () {
    this.initTable()
  },
  methods: {
    initTable () {
      let self = this
      $(document).ready(function() {
          self.table = $('#patients').DataTable({
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
              "sAjaxSource" : "/server/get_gene_fusion_list?p=" + self.$store.state.projectId +  "&sampleName=" + self.textareaSampleName.replace(/\s/g,'') +  "&geneId=" + self.textareaGeneId.replace(/\s/g,''),
              "aoColumns" : [{
                  "mDataProp" : "geneId"
              }, {
                  "mDataProp" : "geneName"
              }, {
                  "mDataProp" : "sampleName"
              }, {
                  "mDataProp" : "pfamId"
              }, {
                  "mDataProp" : "pfamDesc"
              },{
                  "mDataProp" : "geneId",
                  "mRender" : function(data, type, full) {
                    return '<button id="lineChart" class="el-button el-button--primary el-button--mini">svg</button>'
                  }
              }],
          });

          $('#patients tbody').on( 'click', '#lineChart', function () {
            var row = $(this).parents('tr')[0]
            var data = $("#patients").dataTable().fnGetData(row)
            sessionStorage.setItem('gene_fusion_data', JSON.stringify(data))
            self.$router.push({'name': 'gene_fusion_plot'})
          })

        })
      },
      search () {
        this.initTable()
        setTimeout(() => {
          this.table.ajax.reload()  // 重新 load table
        }, 0)
      },
      clear () {
        this.textareaSampleName = ''
        this.textareaGeneId = ''
      },
      exportTable () {
        this.axios.get("/server/export_gene_counts?p=" + this.$store.state.projectId + "&username=" + this.$store.state.username +  "&geneName=" + this.textareaSampleName.replace(/\s/g,'') +  "&geneId=" + this.textareaGeneId.replace(/\s/g,'')).then(res => {
          this.fileUrl = res.data.filePath
          setTimeout(() => {
            this.$refs.downloadA.click()
          }, 0)
        })
      },
  }
}
</script>

<style scoped="true">
.clear {
  clear: both;
}
.labelStyle {
  display: inline-block;
  width: 95px;
  text-align: end;
}
.label-font {
  font-size: 14px;
}
</style>
