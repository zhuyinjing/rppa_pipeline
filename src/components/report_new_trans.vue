<template>
      <div class="">
        <imgMenuShowComp></imgMenuShowComp>

        <el-breadcrumb separator="/" style="margin:5px 0 50px 0">
          <el-breadcrumb-item :to="{ path: 'report' }">{{$t('report.project')}} {{$store.state.projectName}}</el-breadcrumb-item>
          <el-breadcrumb-item>{{$t('leftMenu.new_trans')}}</el-breadcrumb-item>
        </el-breadcrumb>

        <h2>{{$t('leftMenu.new_trans')}}</h2>

        <el-button type="primary" class="margin-bottom-btn" @click="classcodeShow = true"><i class="el-icon-question"></i>{{$t('new_trans.view_classcode')}}</el-button>

        <el-card class="" shadow="hover" style="width:1400px;min-width:1400px">
          <div class="" style="display:inline-block;vertical-align:top;">
            <div class="">
              <div class="labelStyle">
                <label for="maxpval" class="label-font">gene</label>
              </div>
              <el-input
                style="width:200px;"
                type="textarea"
                :rows="3"
                :placeholder="$t('input.split')"
                v-model="genetextarea">
              </el-input>
            </div>
             <br>
            <div class="">
              <div class="labelStyle">
                <label for="maxfdr" class="label-font">reference TranscriptId</label>
              </div>
              <el-input
                style="width:200px;"
                type="textarea"
                :rows="2"
                :placeholder="$t('input.split')"
                v-model="referenceTranscriptIdtextarea">
              </el-input>
            </div>
          </div>
          <div class="" style="display:inline-block;vertical-align:top;">
            <div class="">
              <div class="labelStyle">
                <label class="radio-inline control-label">class code</label>
              </div>
              <el-input
                style="width:220px;"
                type="textarea"
                :rows="2"
                :placeholder="$t('input.split')"
                v-model="classCodetextarea">
              </el-input>
            </div>
            <br>
            <div class="">
              <div class="labelStyle">
                <label class="radio-inline control-label">exonNum from</label>
              </div>
             <el-input style="width: 100px;" size='mini' v-model="exonNumStart"></el-input>
            to  <el-input style="width: 100px;" size='mini' v-model="exonNumEnd"></el-input>
            </div>
            <br>
            <div class="">
              <div class="labelStyle">
                <label class="radio-inline control-label">transcript length from</label>
              </div>
              <el-input style="width: 100px;" size='mini' v-model="transcriptLengthStart"></el-input>
           to <el-input style="width: 100px;" size='mini' v-model="transcriptLengthEnd"></el-input>
            </div>
          </div>
          <div class="" style="display:inline-block;vertical-align:top;">
            <div class="">
              <div class="labelStyle">
                <label class="radio-inline control-label">coding probability from</label>
              </div>
              <el-input style="width: 100px;" size='mini' v-model="codingProbabilityStart"></el-input>
           to <el-input style="width: 100px;" size='mini' v-model="codingProbabilityEnd"></el-input>
            </div>
            <br>
            <div class="">
              <div class="labelStyle">
                <label class="radio-inline control-label">peptide length from</label>
              </div>
              <el-input style="width: 100px;" size='mini' v-model="peptideLengthStart"></el-input>
           to <el-input style="width: 100px;" size='mini' v-model="peptideLengthEnd"></el-input>
            </div>
            <br>
            <div class="">
              <div class="labelStyle">
                <label class="radio-inline control-label">coding</label>
              </div>
              <el-checkbox v-model="coding">coding</el-checkbox>
              <el-checkbox v-model="noncoding">noncoding</el-checkbox>
            </div>
            <br>
            <div class="">
              <div class="labelStyle">
              </div>
              <el-button type="primary" @click="search()">{{$t('button.select')}}</el-button>
              <el-button type="info" @click="clear()">{{$t('button.clear')}}</el-button>
            </div>
          </div>
        </el-card>
        <br>

        <a :href="fileUrl" download ref="downloadA"></a>

        <el-button size="mini" type="primary" icon="el-icon-download" plain @click="exportTable()">导出</el-button> <br><br>

        <!-- <div class="overflow-auto"> -->
        <div class="">
          <table id="patients" cellspacing="0" width="100%" class="display table table-striped table-bordered">
              <thead>
              <tr>
                  <th></th>
                  <th>gene</th>
                  <th>transcriptId</th>
                  <th>referenceTranscriptId</th>
                  <th>exonNum</th>
                  <th>classCode</th>
                  <th>transcriptLength</th>
                  <th>peptideLength</th>
                  <th>codingProbability</th>
                  <th>coding</th>
              </tr>
              </thead>
          </table>
        </div>


        <el-dialog
          :title="$t('button.describe')"
          :visible.sync="classcodeShow"
          width="40%"
          center>
          <img src="../assets/img/classcode.gif" alt="" class="imgStyle">
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="classcodeShow = false">{{$t('button.close')}}</el-button>
          </span>
        </el-dialog>
      </div>

</template>

<script>
import imgMenuShowComp from './imgMenuShowComp.vue'

export default {
  data () {
    return {
      classcodeShow: false,
      table: null,
      genetextarea: '',
      referenceTranscriptIdtextarea: '',
      classCodetextarea: '',
      exonNumStart: null,
      exonNumEnd: null,
      transcriptLengthStart: null,
      transcriptLengthEnd: null,
      peptideLengthStart: null,
      peptideLengthEnd: null,
      codingProbabilityStart: null,
      codingProbabilityEnd: null,
      coding: false,
      noncoding: false,
      fileUrl: '',
      filterArgObj: {}, // 用来保存点击筛选后的条件
    }
  },
  components: {
    imgMenuShowComp
  },
  mounted () {
    this.initTable()
  },
  methods: {
    search () {
      this.initTable()
      setTimeout(() => {
        this.table.ajax.reload()  // 重新 load table
      }, 0)
    },
    getPage () {
      var table = $('#patients').dataTable()
      console.log(table.fnSettings()._iDisplayStart)  // page start 0 , 25...
      console.log(table.fnSettings()._iDisplayLength)  // page length 10 , 25...
      this.table.ajax.reload()  // 重新 load table
    },
    numFormat (num) {
        num=num.toString().split(".");  // 分隔小数点
        var arr=num[0].split("").reverse();  // 转换成字符数组并且倒序排列
        var res=[];
        for(var i=0,len=arr.length;i<len;i++){
          if(i%3===0&&i!==0){
             res.push(",");   // 添加分隔符
          }
          res.push(arr[i]);
        }
        res.reverse(); // 再次倒序成为正确的顺序
        if(num[1]){  // 如果有小数的话添加小数部分
          res=res.join("").concat("."+num[1]);
        }else{
          res=res.join("");
        }
        return res;
    },
    initTable () {
      let self = this

      this.genetextarea = this.genetextarea.replace(/\s/g,'')
      let exonNumStart = this.exonNumStart?this.exonNumStart:0
      let exonNumEnd = this.exonNumEnd?this.exonNumEnd:2147483647
      let transcriptLengthStart = this.transcriptLengthStart?this.transcriptLengthStart:0
      let transcriptLengthEnd = this.transcriptLengthEnd?this.transcriptLengthEnd:2147483647
      let codingProbabilityStart = this.codingProbabilityStart?this.codingProbabilityStart:0
      let codingProbabilityEnd = this.codingProbabilityEnd?this.codingProbabilityEnd:1
      let peptideLengthStart = this.peptideLengthStart?this.peptideLengthStart:0
      let peptideLengthEnd = this.peptideLengthEnd?this.peptideLengthEnd:2147483647
      let codingtemp = []
      if (this.coding === true) {
        codingtemp.push("coding")
      }
      if (this.noncoding === true) {
        codingtemp.push("noncoding")
      }
      if (codingtemp.length === 0) {
        codingtemp = null
      } else {
        codingtemp.join(',')
      }

      // 保存筛选条件
      this.filterArgObj['gene'] = this.genetextarea
      this.filterArgObj['referenceTranscriptId'] = this.referenceTranscriptIdtextarea
      this.filterArgObj['classCode'] = this.classCodetextarea
      this.filterArgObj['exonNumStart'] = exonNumStart
      this.filterArgObj['exonNumEnd'] = exonNumEnd
      this.filterArgObj['transcriptLengthStart'] = transcriptLengthStart
      this.filterArgObj['transcriptLengthEnd'] = transcriptLengthEnd
      this.filterArgObj['codingProbabilityStart'] = codingProbabilityStart
      this.filterArgObj['codingProbabilityEnd'] = codingProbabilityEnd
      this.filterArgObj['peptideLengthStart'] = peptideLengthStart
      this.filterArgObj['peptideLengthEnd'] = peptideLengthEnd
      this.filterArgObj['label'] = codingtemp

      $(document).ready(function() {
          var table = $('#patients').DataTable({
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
              "sAjaxSource" : "/server/new_transcripts?p=" + self.$store.state.projectId + "&username=" + self.$store.state.username + "&gene=" + self.genetextarea + "&referenceTranscriptId=" + self.referenceTranscriptIdtextarea + "&classCode=" + self.classCodetextarea + "&exonNumStart=" + exonNumStart + "&exonNumEnd=" + exonNumEnd + "&transcriptLengthStart=" + transcriptLengthStart + "&transcriptLengthEnd=" + transcriptLengthEnd + "&peptideLengthStart=" + peptideLengthStart + "&peptideLengthEnd=" + peptideLengthEnd + "&codingProbabilityStart=" + codingProbabilityStart + "&codingProbabilityEnd=" + codingProbabilityEnd + "&label=" + codingtemp,
              "aoColumns" : [ {
                  "class": "details-control",
                  "orderable": false,
                  "mDataProp": 1,
                  "defaultContent": ""
              }, {
                  "mDataProp" : "gene"
              }, {
                  "mDataProp" : "transcriptId"
              }, {
                  "mDataProp" : "referenceTranscriptId"
              },{
                  "mDataProp" : "exonNum"
              },{
                  "mDataProp" : "classCode"
              },{
                  "mDataProp" : "cpc2Entry",
                  "mRender" : function(data, type, full) {
                      return self.numFormat(data['transcriptLength'])
                  }
              },{
                  "mDataProp" : "cpc2Entry",
                  "mRender" : function(data, type, full) {
                      return self.numFormat(data['peptideLength'])
                  }
              }, {
                  "mDataProp" : "cpc2Entry",
                  "mRender" : function(data, type, full) {
                      return Number(data['codingProbability']).toFixed(3)
                  }
              },{
                  "mDataProp" : "cpc2Entry",
                  "mRender" : function(data, type, full) {
                      return data['label']
                  }
              }],
          });
          function format ( d ) {
            return `<div class='detailDiv'>classCode: ${d.classCode}</div>
                    <div class='detailDiv'>exonNum: ${d.exonNum}</div>
                    <div class='detailDiv'>gene: ${d.gene}</div>
                    <div class='detailDiv'>referenceTranscriptId: ${d.referenceTranscriptId}</div>
                    <div class='detailDiv'>transcriptId: ${d.transcriptId}</div>
                    <div class='detailDiv'>codingProbability: ${d.cpc2Entry.codingProbability}</div>
                    <div class='detailDiv'>fickettScore: ${d.cpc2Entry.fickettScore}</div>
                    <div class='detailDiv'>coding: ${d.cpc2Entry.label}</div>
                    <div class='detailDiv'>pI: ${d.cpc2Entry.pI}</div>
                    <div class='detailDiv'>peptideLength: ${d.cpc2Entry.peptideLength}</div>
                    <div class='detailDiv'>transcriptLength: ${d.cpc2Entry.transcriptLength}</div>
                    <div class='detailDiv font-overflow'>sequence: ${d.sequence}</div>`
          }

          var detailRows = [];
          // 防止报 _detailsShow undefined 错误
          $('#patients tbody').off('click', 'tr td.details-control');
          $('#patients tbody').on( 'click', 'tr td.details-control', function () {
              var tr = $(this).closest('tr');
              var row = table.row( tr );
              var idx = $.inArray( tr.attr('id'), detailRows );

              if ( row.child.isShown() ) {
                  tr.removeClass( 'details' );
                  row.child.hide();

                  // Remove from the 'open' array
                  detailRows.splice( idx, 1 );
              }
              else {
                  tr.addClass( 'details' );
                  row.child( format( row.data() ) ).show();

                  // Add to the 'open' array
                  if ( idx === -1 ) {
                      detailRows.push( tr.attr('id') );
                  }
              }
          });
          table.on( 'draw', function () {
              $.each( detailRows, function ( i, id ) {
                  $('#'+id+' td.details-control').trigger( 'click' );
              } );
          });
          self.table = table
        })
      },
      clear () {
        this.genetextarea = ''
        this.referenceTranscriptIdtextarea = ''
        this.classCodetextarea = ''
        this.exonNumStart = null
        this.exonNumEnd = null
        this.transcriptLengthStart = null
        this.transcriptLengthEnd = null
        this.peptideLengthStart = null
        this.peptideLengthEnd = null
        this.codingProbabilityStart = null
        this.codingProbabilityEnd = null
        this.coding = false
        this.noncoding = false
      },
      exportTable () {
        this.axios.get("/server/export_transcripts?p=" + this.$store.state.projectId + "&username=" + this.$store.state.username + "&gene=" + this.filterArgObj.gene + "&referenceTranscriptId=" + this.filterArgObj.referenceTranscriptId + "&classCode=" + this.filterArgObj.classCode + "&exonNumStart=" + this.filterArgObj.exonNumStart + "&exonNumEnd=" + this.filterArgObj.exonNumEnd + "&transcriptLengthStart=" + this.filterArgObj.transcriptLengthStart + "&transcriptLengthEnd=" + this.filterArgObj.transcriptLengthEnd + "&peptideLengthStart=" + this.filterArgObj.peptideLengthStart + "&peptideLengthEnd=" + this.filterArgObj.peptideLengthEnd + "&codingProbabilityStart=" + this.filterArgObj.codingProbabilityStart + "&codingProbabilityEnd=" + this.filterArgObj.codingProbabilityEnd + "&label=" + this.filterArgObj.label).then(res => {
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
.content {
  float:left;
  /* width: 60%; */
  width: calc(100% - 350px);
  padding: 0 20px;
  margin: 19px auto;
}
.imgStyle {
  width: 100%;
}
.margin-bottom-btn {
  margin-bottom: 10px;
}
.overflow-auto {
  overflow: auto;
}
.label-font {
  font-size: 14px;
}
.overflow-auto {
  overflow: auto;
}
.labelStyle {
  display:inline-block;
  width:170px;
  text-align:end;
}
.filterbtnDiv {
  float: right;
  margin-bottom: 10px;
}
.text-align-center {
  text-align: center;
}
</style>
<style>
td.details-control {
    background: url('../assets/img/details_open.png') no-repeat center center;
    cursor: pointer;
}
tr.details td.details-control {
    background: url('../assets/img/details_close.png') no-repeat center center;
}
.detailDiv {
  padding: 5px 35px;
}
.font-overflow {
  word-break: break-all;
  word-wrap: break-word;
}
</style>
