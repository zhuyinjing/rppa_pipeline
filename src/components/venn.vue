<template>
<div class="">

    <imgMenuShowComp></imgMenuShowComp>

    <el-breadcrumb separator="/" style="margin:5px 0 50px 0">
      <el-breadcrumb-item :to="{ path: 'report' }">{{$t('report.project')}} {{$store.state.projectName}}</el-breadcrumb-item>
      <el-breadcrumb-item>维恩图</el-breadcrumb-item>
    </el-breadcrumb>

    <h2>维恩图</h2>

    <el-checkbox-group v-model="checkedArr">
      <el-checkbox style="width:33%" v-for="(item, index) in $store.state.info.experimentDesign.experiments" :key="index" :label="item['_case']+ ' ' + item['_control']">{{item['_case']+ ' vs ' + item['_control']}}</el-checkbox>
    </el-checkbox-group>

    <br>
    <el-button type="primary" size="small" @click="initData()">{{$t('button.confirm')}}</el-button>
    <el-button type="info" size="small" @click="checkedArr = []">{{$t('button.clear')}}</el-button>
    &nbsp;&nbsp;&nbsp;
    <!-- {{$t('d3.width')}}：<el-input-number size="mini" v-model="width" :step="100" :min="0" @change="initVenn()"></el-input-number>
    {{$t('d3.height')}}：<el-input-number size="mini" v-model="height" :step="100" :min="0" @change="initVenn()"></el-input-number> -->

    <el-button type="primary" size="small" icon="el-icon-picture" @click="$store.commit('d3saveSVG', ['venn', 'venn'])">{{$t('button.svg')}}</el-button>
    <i class="el-icon-question cursor-pointer" style="font-size:16px" @click="$store.state.svgDescribeShow = true"></i>

    <div id="venn"></div>

    <div class="" v-show="tableShow">
      <table id="table" cellspacing="0" width="100%" class="display table table-striped table-bordered">
        <thead>
          <tr>
            <th>targetId</th>
            <th>name</th>
            <th>chr</th>
            <th>start</th>
            <th>end</th>
            <th>type</th>
          </tr>
        </thead>
      </table>
    </div>

  </div>

</template>

<script>
import imgMenuShowComp from './imgMenuShowComp.vue'

import * as d3 from 'd3'
import * as venn from 'venn.js'

export default {
  data() {
    return {
      checkedArr: [],
      data: [],
      table: null,
      tableShow: false,
      geneId: null,
      width: 700,
      height: 600,
    }
  },
  components: {
    imgMenuShowComp
  },
  mounted() {
    if (this.$store.state.info.experimentDesign.experiments) {
      let temp0 = this.$store.state.info.experimentDesign.experiments[0]
      let temp1 = this.$store.state.info.experimentDesign.experiments[1]
      this.checkedArr = [temp0['_case'] + ' ' + temp0['_control'], temp1['_case'] + ' ' + temp1['_control']]
      this.initData()
    }
  },
  methods: {
    initData () {
      if (this.checkedArr.length === 0) {
        this.$message.error('选项不能为空！')
        return
      }
      if (this.checkedArr.length > 5) {
        this.$message.error('最多选择 5 个!')
        return
      }
      this.axios.get('/server/get_deg_venn_info?p=' + this.$store.state.projectId + '&case_control=' + this.checkedArr.join(',')).then(res => {
        if (res.data.resultList) {
          this.data = res.data.resultList
          this.initVenn()
        } else if (res.data.message_type === 'error') {
          this.$message.error(res.data.message)
        }
      })

    },
    initVenn () {
      let self = this
      var sets = this.data;

      var chart = venn.VennDiagram().width(this.width).height(this.height);
      var div = d3.select("#venn")
      div.datum(sets).call(chart);

      d3.selectAll('.venntooltip').remove()
      var tooltip = d3.select("#venn").append("div")
          .attr("class", "venntooltip");

      div.selectAll("path")
          .style("stroke-opacity", 0)
          .style("stroke", "#fff")
          .style("stroke-width", 3)

      div.selectAll("g")
          .on("click", function(d, i) {
            self.geneId = d.data
            self.reloadTable()
          })
          .on("mouseover", function(d, i) {
              // sort all the areas relative to the current item
              venn.sortAreas(div, d);

              // Display a tooltip with the current size
              tooltip.transition().duration(400).style("opacity", .9);
              tooltip.text(d.size);

              // highlight the current path
              var selection = d3.select(this).transition("tooltip").duration(400);
              selection.select("path")
                  .style("fill-opacity", d.sets.length == 1 ? .4 : .1)
                  .style("stroke-opacity", 1);
          })

          .on("mousemove", function() {
              tooltip.style("left", (d3.event.pageX) + "px")
                     .style("top", (d3.event.pageY - 28) + "px");
          })

          .on("mouseout", function(d, i) {
              tooltip.transition().duration(400).style("opacity", 0);
              var selection = d3.select(this).transition("tooltip").duration(400);
              selection.select("path")
                  .style("fill-opacity", d.sets.length == 1 ? .25 : .0)
                  .style("stroke-opacity", 0);
          });

    },
    initTable () {
      this.tableShow = true
      let self = this
      $(document).ready(function() {
          self.table = $('#table').DataTable(
            {
              "pageLength": 10,
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
              "sServerMethod": "POST",
              "oLanguage": {
                "sProcessing": "loading data..."
               },
               "sAjaxSource" : "/server/get_deg_by_venn_info",
               "fnServerData": function ( sSource, aoData, fnCallback ) {
                 aoData.push({name: 'p', value: self.$store.state.projectId})
                 aoData.push({name: 'geneId', value: self.geneId})
                 $.ajax( {
                       "dataType": 'json',
                       "type": "POST",
                       "url": sSource,
                       "data": aoData,
                       "success": fnCallback
                   } );
               },
              "aoColumns" : [
                  {
                    "mDataProp" : "targetId"
                },
                {
                    "mDataProp" : "name"
                },
                {
                    "mDataProp" : "chr"
                }, {
                    "mDataProp" : "start",
                }, {
                    "mDataProp" : "end",
                }, {
                    "mDataProp" : "type",
                }
              ],
            }
          );
        })
    },
    reloadTable () {
      this.initTable()
      setTimeout(() => {
        this.table.ajax.reload()  // 重新 load table
      }, 0)
    },

  }
}
</script>

<style scoped="true">
.el-checkbox+.el-checkbox {
  margin-left: 0 !important;
}
.margin-top-10 {
  margin-top: 10px;
}
</style>
<style media="screen">
.venntooltip {
  position: absolute;
  text-align: center;
  width: 128px;
  height: 22px;
  background: #333;
  color: #ddd;
  border: 0px;
  border-radius: 8px;
  opacity: 0;
}
</style>
