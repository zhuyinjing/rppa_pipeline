<template>
  <div class="">
      <div class="">
        <imgMenuShowComp></imgMenuShowComp>

        <el-breadcrumb separator="/" style="margin:5px 0 50px 0">
          <el-breadcrumb-item :to="{ path: 'report' }">{{$t('report.project')}} {{$store.state.projectName}}</el-breadcrumb-item>
          <el-breadcrumb-item>{{$t('leftMenu.expr_matrix')}}</el-breadcrumb-item>
        </el-breadcrumb>

        <h2>{{$t('leftMenu.expr_matrix')}} (COUNT 数)</h2>

        <p>一个基因表达水平的直接体现就是看有多少 reads 回帖到该基因区域，这个可以称之为基因的表达丰度。我们利用 <a href="https://pachterlab.github.io/kallisto/">kallisto</a> 软件来进行转录本定量，基因表达量为该基因所有转录本表达量之和。</p>

        <p>{{$t('mappingqc.references')}} : Nicolas L Bray, Harold Pimentel, Páll Melsted and Lior Pachter, <a href="http://www.nature.com/nbt/journal/v34/n5/full/nbt.3519.html">Near-optimal probabilistic RNA-seq quantification</a>, Nature Biotechnology 34, 525–527 (2016), doi:10.1038/nbt.3519</p>

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
                <label for="maxpval" class="label-font">geneName</label>
              </div>
              <el-input
                style="width:400px;"
                type="textarea"
                :rows="3"
                :placeholder="$t('input.split')"
                v-model="textareaGeneName">
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

        <a :href="fileUrl" download ref="downloadA"></a>

        <el-button size="mini" type="primary" icon="el-icon-download" plain @click="exportTable()">导出</el-button> <br><br>

        <!-- <div class="overflow-auto"> -->
        <div class="">
          <table id="patients" cellspacing="0" class="display table table-striped table-bordered">
              <thead>
              <tr>
                  <th v-for="item in countsArray">{{item}}</th>
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
import imgMenuShowComp from './imgMenuShowComp.vue'

export default {
  data () {
    return {
      countsArray: [],
      arr: [{
          "mDataProp" : "geneId"
      }, {
          "mDataProp" : "geneName"
      }],
      textareaGeneName: '',
      textareaGeneId: '',
      fileUrl: '',
    }
  },
  components: {
    imgMenuShowComp
  },
  mounted () {
    this.getTableHead()  // 获取动态表头
  },
  methods: {
    getTableHead () {
      this.axios('/server/gene_counts?p=' + this.$store.state.projectId + '&username=' + this.$store.state.username + '&sEcho=1&iDisplayStart=0&iDisplayLength=1').then((res) => {
        if (res.data.aData.length > 0)  {
          let obj = res.data.aData[0].counts
          for (let k in obj) {
            this.countsArray.push(k)
          }
          // table head 按照 a～z 排序
          this.countsArray.sort()
          this.countsArray.map((item) => {
            this.arr.push({
                "mDataProp" : "counts",
                "mRender" : function(data, type, full) {
                    return Math.ceil(data[item])
                }
            })
          })
          this.countsArray.unshift('geneName')
          this.countsArray.unshift('geneId')
        }
        this.initTable()
      })
    },
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
              "sAjaxSource" : "/server/gene_counts?p=" + self.$store.state.projectId + "&username=" + self.$store.state.username +  "&geneName=" + self.textareaGeneName.replace(/\s/g,'') +  "&geneId=" + self.textareaGeneId.replace(/\s/g,''),
              "aoColumns" : self.arr,
          });
        })
      },
      search () {
        this.initTable()
        setTimeout(() => {
          this.table.ajax.reload()  // 重新 load table
        }, 0)
      },
      clear () {
        this.textareaGeneName = ''
        this.textareaGeneId = ''
      },
      exportTable () {
        this.axios.get("/server/export_gene_counts?p=" + this.$store.state.projectId + "&username=" + this.$store.state.username +  "&geneName=" + this.textareaGeneName.replace(/\s/g,'') +  "&geneId=" + this.textareaGeneId.replace(/\s/g,'')).then(res => {
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
