<template>
      <div class="">
        <imgMenuShowComp></imgMenuShowComp>

        <el-breadcrumb separator="/" style="margin:5px 0 50px 0">
          <el-breadcrumb-item :to="{ path: 'report' }">{{$t('report.project')}} {{$store.state.projectName}}</el-breadcrumb-item>
          <el-breadcrumb-item>差异可变剪切分析</el-breadcrumb-item>
        </el-breadcrumb>

        <h2>差异可变剪切分析</h2>

        <el-button type="primary" size="small" icon="el-icon-picture" @click="$store.commit('d3saveSVG', ['junction_plot', 'rectContainer'])">{{$t('button.svg')}}</el-button>
        <i class="el-icon-question cursor-pointer" style="font-size:16px" @click="$store.state.svgDescribeShow = true"></i>

        <div id="rectContainer"></div>
        <br><br>
        <div class="">
          <table v-show="tebleShow" id="patients" width="100%" cellspacing="0" class="display table table-striped table-bordered">
              <thead>
              <tr>
                <th>geneId</th>
                <th>geneName</th>
                <th>featureSignificance</th>
                <th v-for="item in headArr">{{item}}</th>
              </tr>
              </thead>
          </table>
        </div>

      </div>
</template>

<script>
import imgMenuShowComp from '@/components/imgMenuShowComp.vue'
import * as d3 from 'd3'

export default {
  data () {
    return {
      data: null,
      tebleShow: false,
      listArr: [{
          "mDataProp" : "geneId"
      }, {
          "mDataProp" : "geneName"
      }, {
          "mDataProp" : "featureSignificance"
      }],
      headArr: []
    }
  },
  components: {
    imgMenuShowComp
  },
  mounted () {
    this.getTableHead()
  },
  methods: {
    // 科学计数法
    num2e(num) {
      var p = Math.floor(Math.log(num) / Math.LN10)
      var n = num * Math.pow(10, -p)
      return n.toFixed(1) + 'e' + p
    },
    getTableHead () {
      let gene = JSON.parse(sessionStorage.getItem('junction_data'))
      this.axios('/server/get_junction_seq_result_info?p=' + this.$store.state.projectId + '&geneId=' + gene.geneId + '&sEcho=1&iDisplayStart=0&iDisplayLength=1').then((res) => {
        if (res.data.aData.length > 0)  {
          this.headArr = Object.keys(res.data.aData[0].normCount)
          this.headArr.map(item => {
            this.listArr.push({
                "mDataProp" : "normCount." + item
            })
          })
        }
        this.data = res.data
        this.initD3()
        this.initTable()
      })
    },
    initTable () {
      let self = this
      let gene = JSON.parse(sessionStorage.getItem('junction_data'))
      this.tebleShow = true
      $(document).ready(function() {
          self.table = $('#patients').DataTable({
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
              //通过ajax实现分页的url路径
              "sAjaxSource" : "/server/get_junction_seq_result_info?p=" + self.$store.state.projectId +'&geneId='+ gene.geneId,
              "aoColumns" : [...self.listArr],
          });
        })
      },
    initD3 () {
      let self = this
      let hassvg = d3.selectAll('#rectSvg')
      if (hassvg) {
        d3.selectAll('#rectSvg').remove()
      }
      var width = 1500, height = 900, lineChartHeight = 200
      var rectSvg = d3.select("#rectContainer").append("svg").attr("width", width).attr("height", height).attr("id", "rectSvg")
      var data = this.data
      var padding = {top:30,right:150,bottom:60,left:60}
      var xData = data.feature
      let leftWidth = width - padding.left - padding.right - 100
      let leftHeight = height - padding.top - padding.bottom - lineChartHeight
      var xScale = d3.scaleBand().domain(xData).range([0,leftWidth]).padding(0.8)
      var yScale = d3.scaleLinear().domain([data.normCountMin, data.normCountMax]).range([leftHeight,0]).nice()
      var xAxis = d3.axisBottom().tickSize(-(leftHeight)).scale(xScale)
      var yAxis = d3.axisLeft().scale(yScale)
      let colorScale = d3.scaleOrdinal(d3.schemeCategory10)

      let tooltip = d3.select('#rectContainer')
        .append('div')
        .style('position', 'absolute')
        .style('z-index', '10')
        .style('color', '#3497db')
        .style('visibility', 'hidden')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .text('')

      var x = rectSvg.append("g")
                    .call(xAxis)
                    .attr("transform","translate("+ padding.left +"," + (height - padding.bottom - lineChartHeight) +")")
                    .selectAll("text")
                    .style("font-size", "14px")
                    .style("text-anchor", "middle")
                    .attr("transform", "rotate(45 -20 10)")
      // grid line style
      d3.selectAll(".tick line")
        .attr("stroke-dasharray", 3)
        .attr("stroke", (d, i) => {
          let temp = data.junctionSeqResultList.find(item => item.geneFeature === d)
          if (temp.featureSignificance === "yes") {
            // featurePadj
            rectSvg.append("text")
                   .attr("transform", d => {
                     let yCoor = i % 2 === 0 ? padding.top : padding.top + 20
                     return "translate(" + (padding.left + xScale(temp.geneFeature)) +"," + yCoor + ")"
                   })
                   .text(self.num2e(temp.featurePadj))
                   .attr("stroke", "#f019ea")
                   .style("text-anchor", "middle")
                   .style("font-size", "12px")

            return "#f019ea"
          } else {
            return "lightgrey"
          }
        })

      var y = rectSvg.append("g").call(yAxis).attr("transform","translate("+ padding.left +"," + padding.top +")")

      //  折线图
      // var line = d3.line()
      //     .x(function(d, i) { return padding.left + xScale(d.geneFeature) + xScale.bandwidth() / 2; }) // set the x values for the line generator
      //     .y(function(d) { return padding.top + yScale(d["normCount"]); }) // set the y values for the line generator
      //     .curve(d3.curveLinear) // apply smoothing to the line
      //
      // rectSvg
      //     .selectAll('.line-group')
      //     .data(data.sampleName).enter()
      //     .append("path")
      //     .attr("d", (d) => line((data.junctionSeqResultList.filter(item => item.sampleName === d))))
      //     .attr("fill", "none")
      //     .attr("stroke", (d,i) => colorScale(d.split("_")[0]))
      //     .style("stroke-dasharray", (d, i) => i)

      let linePlotData = data.junctionSeqResultList.filter(d => d.testable === 'TRUE'  && xData.indexOf(d.geneFeature) !== -1)

      // 小横杠
      rectSvg.selectAll(".line")
             .data(linePlotData)
             .enter()
             .append("path")
             .attr("d", (d, i) => {
               return "M " + (padding.left + xScale(d.geneFeature)) + " " + (padding.top + yScale(d.normCount)) + "L " + (padding.left + xScale(d.geneFeature) + xScale.bandwidth()) + " " + (padding.top + yScale(d.normCount))
             })
             .attr("stroke", d => colorScale(d.sampleGroup))

      // 虚线
      for (let i = 0;i < data.sampleName.length;i++) {
        let arr = linePlotData.filter(item => item.sampleName === data.sampleName[i]) // 筛选出 sampleName 为 data.sampleName[i]
        let temp = JSON.parse(JSON.stringify(arr))
        temp.splice(0, 1)
        rectSvg.selectAll(".line")
               .data(temp)
               .enter()
               .append("path")
               .attr("d", (d, index) => {
                 return "M " + (padding.left + xScale(arr[index].geneFeature) + xScale.bandwidth()) + " " + (padding.top + yScale(arr[index].normCount)) + "L " + (padding.left + xScale(arr[index + 1].geneFeature)) + " " + (padding.top + yScale(arr[index + 1].normCount))
               })
               .attr("stroke", d => colorScale(d.sampleGroup))
               .style("stroke-dasharray", i)
      }


       // 折线图的 circle
       // rectSvg.selectAll(".circle")
       //        .data(data.junctionSeqResultList)
       //        .enter()
       //        .append("circle")
       //        .attr("cx", d => padding.left + xScale(d.geneFeature) + xScale.bandwidth() / 2)
       //        .attr("cy", d => padding.top + yScale(d.normCount))
       //        .attr("r", d => xScale.bandwidth() / 2)
       //        .attr("fill", d => colorScale(d.sampleGroup))

       // legend ： sampleGroup
       let legendGroupHeight = 100
       var geneYScale = d3.scaleLinear().domain([data.normCountMin, data.normCountMax]).range([height - padding.top - padding.bottom,0]).nice()
       let legendGroup = rectSvg.append("g").attr("transform", "translate("+ (width - 100) +","+ padding.top +")")

       let legendRectWidth = 20, legendRectHeight = 20, legendRectMargin = 5
       legendGroup.selectAll(".rect")
                  .data(data.sampleGroup)
                  .enter()
                  .append("rect")
                  .attr("x", 0)
                  .attr("y", (d, i) => i * (legendRectHeight + legendRectMargin))
                  .attr("width", legendRectWidth)
                  .attr("height", legendRectHeight)
                  .attr("fill", d => colorScale(d))

        legendGroup.selectAll(".text")
                   .data(data.sampleGroup)
                   .enter()
                   .append("text")
                   .attr("transform", (d,i) => "translate("+ (legendRectWidth + legendRectMargin) +","+ (i * (legendRectHeight + legendRectMargin) + (legendRectHeight / 2 + legendRectMargin)) +")")
                   .text(d => d)

         // legend: sample
         let legendBatchFit = rectSvg.append("g").attr("transform","translate("+ (width - 100) +","+ legendGroupHeight +")")
         let legendHeight = 20

         legendBatchFit.selectAll(".legend")
                   .data(data.sampleName)
                   .enter()
                   .append("line")
                   .attr("x1", 0)
                   .attr("y1", (d, i) => i * legendHeight + 10)
                   .attr("x2", 20)
                   .attr("y2", (d, i) => i * legendHeight + 10)
                   .attr("stroke", "black")
                   .style("stroke-dasharray", (d, i) => i)

           legendBatchFit.selectAll(".text")
                     .data(data.sampleName)
                     .enter()
                     .append("text")
                     .attr("transform",(d,i) => "translate(30,"+ (i * legendHeight + 15) +")")
                     .text(d => d)

           // 右侧的图
           let rightRectWidth = 50
           let rightGroupStartX = leftWidth + padding.left + 20
           let rightGroup = rectSvg.append("g").attr("transform","translate("+ rightGroupStartX +","+ padding.top +")")
           var geneScale = d3.scaleLinear().domain([data.normGeneMin, data.normGeneMax]).range([leftHeight,0]).nice()
           var geneAxis = d3.axisRight().scale(geneScale)
           var yGene = rightGroup.append("g").call(geneAxis).attr("transform","translate("+ rightRectWidth +",0)")
           rightGroup.append("rect")
                     .attr("x", 0)
                     .attr("y", 0)
                     .attr("width", rightRectWidth)
                     .attr("height", leftHeight)
                     .attr("stroke", "black")
                     .attr("fill", "none")

          // 右侧图里的线
           rightGroup.selectAll(".path")
                     .data(data.sampleName)
                     .enter()
                     .append("path")
                     .attr("d", d => {
                       let temp = data.junctionSeqResultList.find(item => item.sampleName === d)
                       return "M 0 " + geneScale(temp.normGene) + "L" + rightRectWidth + " " + geneScale(temp.normGene)
                     })
                     .attr("stroke", d => colorScale(d.split("_")[0]))
                     .attr("stroke-dasharray", (d, i) => i)
                     // .on('mouseover', function (d, i) {
                     //   return tooltip.style('visibility', 'visible').text(d)
                     // })
                     // .on('mousemove', function (d, i) {
                     //   return tooltip.style('top', (d3.event.pageY-20)+'px').style('left',(d3.event.pageX+10)+'px')
                     // })
                     // .on('mouseout', function (d, i) {
                     //   return tooltip.style('visibility', 'hidden')
                     // })

           // 左侧到右侧图的连线
           rectSvg.selectAll(".path")
                  .data(data.junctionSeqResultList.filter(k => k.geneFeature === xData[xData.length - 1]))
                  .enter()
                  .append("path")
                  .attr("d", d => {
                    return "M " + (padding.left + xScale(d.geneFeature) + xScale.bandwidth()) + " " + (padding.top + yScale(d.normCount)) + "L" + rightGroupStartX  + " " + (padding.top + geneScale(d.normGene))
                  })
                  .attr("stroke", d => colorScale(d.sampleGroup))
                  .attr("stroke-dasharray", (d, i) => i)

          // 下边的图
           let xCoorScale = d3.scaleLinear().domain([data.coordMin, data.coordMax]).range([padding.left,leftWidth + padding.left])
           let xCoorAxis = d3.axisBottom().scale(xCoorScale)
           let xCoor = rectSvg.append("g")
                         .call(xCoorAxis)
                         .attr("transform","translate("+ 0 +"," + (height - padding.bottom) +")")
                         .selectAll("text")
                         .style("font-size", "14px")
                         .style("text-anchor", "start")

          // intron path
          let intronPathY = height - padding.bottom - 50
          rectSvg.append("path")
                 .attr("d", "M " + padding.left + " " + intronPathY + "L " + (leftWidth + padding.left) + " " + intronPathY)
                 .attr("stroke", "black")

          // exon rect
          let exonGroupStartY = height - padding.bottom - 70
          let exonGroup = rectSvg.append("g").attr("transform","translate("+ 0 +"," + exonGroupStartY +")")
          let exonRectHeight = 40

          let exonGreyRectTemp = data.junctionSeqResultList.filter(d => d.featureType === "exonic_part")
          let exonGreyRectData = exonGreyRectTemp.reduce((all, next) => all.some((item) => item['geneFeature'] == next['geneFeature']) ? all : [...all, next],[]);

          exonGroup.selectAll(".rect")
                     .data(exonGreyRectData)
                     .enter()
                     .append("rect")
                     .attr("x", d => xCoorScale(d.start))
                     .attr("y", d => 0)
                     .attr("width", d => xCoorScale(d.end) - xCoorScale(d.start))
                     .attr("height", exonRectHeight)
                     .attr("stroke", "#999")
                     .attr("fill", d => {
                       if (d.featureSignificance === "yes") {
                         return "#f019ea"
                       } else if (d.testable === "FALSE") {
                         return "#f3f3f3"
                       } else if (d.testable === "TRUE") {
                         return "#c5c5c5"
                       }
                     })

          // exon 之间的连线
          let tempLineData = data.junctionSeqResultList.filter(d => d.featureType !== "exonic_part")
          let lineData = tempLineData.reduce((all, next) => all.some((item) => item['geneFeature'] == next['geneFeature']) ? all : [...all, next],[]);
          let lineStartY = exonGroupStartY - 30
          rectSvg.selectAll(".path")
                   .data(lineData)
                   .enter()
                   .append("path")
                   .attr("d", (d, i) => {
                      return "M " + xCoorScale(d.start) + " " + exonGroupStartY + "L " + xCoorScale(d.start) + " " + lineStartY
                              + "L " + xCoorScale(d.end) + " " + lineStartY + "L " + xCoorScale(d.end) + " " + exonGroupStartY
                   })
                   .attr("stroke", "#d5d5d5")
                   .attr("fill", "none")

          // 横坐标与 exon 的连线
          let xAxisLineStartY = lineStartY - 50
          let middleLineStartY = xAxisLineStartY + 10
          rectSvg.selectAll(".path")
                   .data(xData)
                   .enter()
                   .append("path")
                   .attr("d", (d, i) => {
                     let rectData = data.junctionSeqResultList.find(item => item.geneFeature === d)
                     let rectMiddleX = xCoorScale(rectData.start + (rectData.end - rectData.start) / 2)
                     let endStartY
                     if (d.featureType === "exonic_part") {
                       endStartY = exonGroupStartY
                     } else {
                       endStartY = lineStartY
                     }
                     let middleY = endStartY - 5
                      return "M " + (padding.left + xScale(d) + xScale.bandwidth() / 2) + " " + xAxisLineStartY + "L " + rectMiddleX + " " + middleY
                              + "L " + rectMiddleX + " " + exonGroupStartY
                   })
                   .attr("stroke", d => data.junctionSeqResultList.find(item => item.geneFeature === d).featureSignificance !== "yes" ? "#d5d5d5" : "#f019ea")
                   .attr("fill", "none")

          //染色体序号
          rectSvg.append("text")
                 .attr("transform", "translate(" + (padding.left - 5) +"," + (height - padding.bottom + 5) + ")")
                 .text(data.junctionSeqResultList[0]["chrom"])
                 .style("text-anchor", "end")

        // y 轴文字 (左图)
         rectSvg.append('text')
           .text('Relative Coverage')
           .attr('fill', '#000')
           .attr('transform', 'translate(15, '+ leftHeight / 2 +') rotate(-90)')
           .style("text-anchor", "middle")

         // y 轴文字 (右图)
          rectSvg.append('text')
            .text('Read-Pairs per Sample, Gene-Level')
            .attr('fill', '#000')
            .attr('transform', 'translate('+ (width - 120) +', '+ leftHeight / 2 +') rotate(90)')
            .style("text-anchor", "middle")

    },
  }
}
</script>

<style scoped="true">
</style>
