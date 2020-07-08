<template>
      <div class="">
        <imgMenuShowComp></imgMenuShowComp>

        <el-breadcrumb separator="/" style="margin:5px 0 50px 0">
          <el-breadcrumb-item :to="{ path: 'report' }">{{$t('report.project')}} {{$store.state.projectName}}</el-breadcrumb-item>
          <el-breadcrumb-item>时序性差异表达基因轨迹图</el-breadcrumb-item>
        </el-breadcrumb>

        <h2>时序性差异表达基因轨迹图</h2>

        <el-button type="primary" size="small" icon="el-icon-picture" @click="$store.commit('d3saveSVG', ['时序性差异表达基因轨迹图', 'lineContainer'])">{{$t('button.svg')}}</el-button>
        <i class="el-icon-question cursor-pointer" style="font-size:16px" @click="$store.state.svgDescribeShow = true"></i>

        <div id="lineContainer"></div>

      </div>
</template>

<script>
import imgMenuShowComp from '@/components/imgMenuShowComp.vue'
import * as d3 from 'd3'

export default {
  data () {
    return {
      data: null
    }
  },
  components: {
    imgMenuShowComp
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      let gene = JSON.parse(sessionStorage.getItem('time_series_data'))
      this.axios.get('/server/get_gene_time_series_info?p='+ this.$store.state.projectId +'&geneId='+ gene.geneId +'&pAdj='+ gene.pAdj).then(res => {
        if (res.data.message_type === 'success') {
          this.data = res.data
          this.initD3()
        } else {
          this.$message.error('请求出错！')
        }
      })
    },
    initD3 () {
      let self = this
      let hassvg = d3.selectAll('#linesvg')
      if (hassvg) {
        d3.selectAll('#linesvg').remove()
      }
      var width = 900, height = 700;
      var linesvg = d3.select("#lineContainer").append("svg").attr("width", width).attr("height", height).attr("id", "linesvg")

      var data = this.data
      var padding = {top:30,right:100,bottom:60,left:60}
      var xScale = d3.scaleBand().domain(data.x).range([0,width - padding.left - padding.right]).padding(1)
      var yScale = d3.scaleLinear().domain([0, data.y]).range([height - padding.top - padding.bottom,0]).nice()
      var xAxis = d3.axisBottom().scale(xScale)
      var yAxis = d3.axisLeft().scale(yScale)
      let colorScale = d3.scaleOrdinal(d3.schemeCategory10)

      let tooltip = d3.select('#lineContainer')
      	.append('div')
      	.style('position', 'absolute')
        .style('z-index', '10')
      	.style('color', '#3497db')
        .style('visibility', 'hidden')
        .style('font-size', '16px')
      	.style('font-weight', 'bold')
      	.text('')

      var x = linesvg.append("g").call(xAxis).attr("transform","translate("+ padding.left +"," + (height - padding.bottom) +")")

      var y = linesvg.append("g").call(yAxis).attr("transform","translate("+ padding.left +"," + padding.top +")")

      var line = d3.line()
          .x(function(d, i) { return padding.left + xScale(d.time); }) // set the x values for the line generator
          .y(function(d) { return padding.top + yScale(d["fitCount"]); }) // set the y values for the line generator
          .curve(d3.curveMonotoneX) // apply smoothing to the line

      linesvg
          .selectAll('.line-group')
          .data(data.batch).enter()
          .append("path")
          .attr("d", (d) => line((data.fitInfo.filter(item => item.batch === d)).sort((a,b) => a.time - b.time)))
          .attr("fill", "none")
          .attr("stroke", (d,i) => colorScale(data.batchCondition[d]))
          .attr("stroke-width", "3")
          .style("stroke-dasharray", (d, i) => i)

      // 图形部分
      var symbolGenerator = d3.symbol().size(50);
      let symbolScale = d3.scaleOrdinal().domain(data.batch).range(['symbolCircle', 'symbolCross', 'symbolDiamond', 'symbolSquare', 'symbolStar', 'symbolTriangle', 'symbolWye'])
      linesvg
          .selectAll('.symbol-group')
          .data(data.estInfo).enter()
          .append("path")
          .attr('d', function(d) {
            symbolGenerator.type(d3[symbolScale(d.batch)]);
        		return symbolGenerator();
          })
          .attr("fill", (d,i) => colorScale(data.batchCondition[d.batch]))
          .attr('transform', function(d, i) {
        		return 'translate(' + (padding.left + xScale(d.time)) + ', '+ (padding.top + yScale(d.estCount)) +')';
        	})
          .on('mouseover', function (d, i) {
            return tooltip.style('visibility', 'visible').text(d.estCount)
          })
          .on('mousemove', function (d, i) {
            return tooltip.style('top', (d3.event.pageY-10)+'px').style('left',(d3.event.pageX+10)+'px')
          })
          .on('mouseout', function (d, i) {
            return tooltip.style('visibility', 'hidden')
          })

      // x 轴文字
      linesvg.append("text")
        .attr("transform", "translate("+ (width / 2) +", " + height + ")")
        .text(data.geneInfo.geneId)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")

      // y 轴文字
      linesvg.append("text")
        .text("Read counts")
        .attr("transform", "translate("+ 15 +", " + (height / 2) + ") rotate(-90)")

      // legend: Condition
      let legendHeight = 20
      let legendCondition = linesvg.append("g").attr("transform","translate("+ (width - padding.right) +","+ (height / 6) +")")

      legendCondition.append("text")
                .attr("transform","translate(5,0)")
                .text("Condition")

      legendCondition.selectAll(".legend")
                .data(Array.from(new Set(Object.values(data.batchCondition))))
                .enter()
                .append("line")
                .attr("x1", 5)
                .attr("y1", (d, i) => i * legendHeight + 10)
                .attr("x2", 30)
                .attr("y2", (d, i) => i * legendHeight + 10)
                .attr("stroke", d => colorScale(d))
                .attr("stroke-width", 3)

        legendCondition.selectAll(".legend")
                  .data(Array.from(new Set(Object.values(data.batchCondition))))
                  .enter()
                  .append("circle")
                  .attr("cx", 18)
                  .attr("cy", (d, i) => i * legendHeight + 10)
                  .attr("r", 4)
                  .attr("fill", d => colorScale(d))

        legendCondition.selectAll(".text")
                  .data(Array.from(new Set(Object.values(data.batchCondition))))
                  .enter()
                  .append("text")
                  .attr("transform",(d,i) => "translate(35,"+ (i * legendHeight + 15) +")")
                  .text(d => d)

      // legend: Batch
      let legendBatch = linesvg.append("g").attr("transform","translate("+ (width - padding.right) +","+ (height / 3) +")")

      legendBatch.append("text")
                .attr("transform","translate(5,0)")
                .text("Batch")

      legendBatch.selectAll(".legend")
                .data(data.batch)
                .enter()
                .append("path")
                .attr('d', function(d) {
                  symbolGenerator.type(d3[symbolScale(d)]);
              		return symbolGenerator();
                })
                .attr("fill", (d,i) => "black")
                .attr('transform', function(d, i) {
              		return 'translate(15, '+ (i * legendHeight + 12) +')'
              	})

        legendBatch.selectAll(".text")
                  .data(data.batch)
                  .enter()
                  .append("text")
                  .attr("transform",(d,i) => "translate(35,"+ (i * legendHeight + 15) +")")
                  .text(d => d)

      // legend: BatchFit
      let legendBatchFit = linesvg.append("g").attr("transform","translate("+ (width - padding.right) +","+ (height / 1.5) +")")

      legendBatchFit.append("text")
                .attr("transform","translate(5,0)")
                .text("BatchFit")

      legendBatchFit.selectAll(".legend")
                .data(data.batch)
                .enter()
                .append("line")
                .attr("x1", 5)
                .attr("y1", (d, i) => i * legendHeight + 10)
                .attr("x2", 30)
                .attr("y2", (d, i) => i * legendHeight + 10)
                .attr("stroke", "black")
                .attr("stroke-width", 3)
                .style("stroke-dasharray", (d, i) => i)

        legendBatchFit.selectAll(".text")
                  .data(data.batch)
                  .enter()
                  .append("text")
                  .attr("transform",(d,i) => "translate(35,"+ (i * legendHeight + 15) +")")
                  .text(d => d)
    },
  }
}
</script>

<style scoped="true">
</style>
