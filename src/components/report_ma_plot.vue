<template>
<div class="">
  <imgMenuShowComp></imgMenuShowComp>

      <degComp></degComp>

      <div class="">
        <p>{{$t('ma_plot.introduction')}}
        <p>$$  \frac{500 + 2000}{2} = 1250 $$</p>
        {{$t('ma_plot.yaxis_introduction')}}
        <p>$$ \log_{2}{\frac{500}{2000}} = -2 $$</p>
        <!-- <el-button type="primary" size="small" icon="el-icon-document" @click="$store.commit('d3savePDF', 'MA plot')">生成 PDF</el-button> -->
        <el-button type="primary" size="small" icon="el-icon-picture" @click="$store.commit('d3saveSVG', ['ma_' + $store.state._case + '_' + $store.state._control])">{{$t('button.svg')}}</el-button>
        <i class="el-icon-question cursor-pointer" style="font-size:16px" @click="$store.state.svgDescribeShow = true"></i>

        <div class="min-width-div">
              <div id="d3container" class="display-inline-block vertical-align-top"></div>

              <div class="clear"></div>

              <table class="gridtable" v-show="rangeShow">
                <tr>
                    <th>{{$t('d3.args')}}</th><th>{{$t('d3.option')}}</th>
                </tr>
                <tr>
                  <td>pvalue &le;</td>
                  <td>
                    <el-input-number size="mini" v-model="pvalue" :step="0.1" @change="xLeftChange"></el-input-number>
                  </td>
                </tr>
                <tr>
                  <td>FDR &le;</td>
                  <td>
                    <el-input-number size="mini" v-model="FDR" :step="0.1" @change="xLeftChange"></el-input-number>
                  </td>
                </tr>
                <tr>
                  <td>Log2FoldChange ({{$t('deg.abs')}}) &ge;</td>
                  <td>
                    <el-input-number size="mini" v-model="log2FoldChange" :step="0.1" @change="xLeftChange"></el-input-number>
                  </td>
                </tr>
                <tr>
                  <td>{{$t('d3.gene_name_show')}}</td>
                  <td>
                    <el-switch
                      style="display: block"
                      v-model="geneNameShow"
                      active-color="#409EFF"
                      inactive-color="#e4e7ed"
                      @change="initD3"
                    >
                    </el-switch>
                  </td>
                </tr>
                <tr>
                  <td>{{$t('d3.gene_num')}}</td>
                  <td>
                    <el-input-number size="mini" v-model="showNum" @change="getData" :min="0" label="描述文字"></el-input-number>
                  </td>
                </tr>
                <tr>
                  <td>{{$t('d3.xmin')}}</td>
                  <td>
                    <el-input-number size="mini" :min=0 v-model="xmin" @change="initD3"></el-input-number>
                  </td>
                </tr>
                <tr>
                  <td>{{$t('d3.xmax')}}</td>
                  <td>
                    <el-input-number size="mini" v-model="xmax" @change="initD3"></el-input-number>
                  </td>
                </tr>
                <tr>
                  <td>{{$t('d3.ymin')}}</td>
                  <td>
                    <el-input-number size="mini" v-model="ymin" @change="initD3"></el-input-number>
                  </td>
                </tr>
                <tr>
                  <td>{{$t('d3.ymax')}}</td>
                  <td>
                    <el-input-number size="mini" v-model="ymax" @change="initD3"></el-input-number>
                  </td>
                </tr>
                <tr>
                  <td>{{$t('d3.width')}}</td>
                  <td>
                    <el-input-number size="mini" v-model="width" @change="initD3"></el-input-number>
                  </td>
                </tr>
                <tr>
                  <td>{{$t('d3.height')}}</td>
                  <td>
                    <el-input-number size="mini" v-model="height" @change="initD3"></el-input-number>
                  </td>
                </tr>
                <tr>
                  <td>{{$t('d3.radius')}}</td>
                  <td>
                    <el-input-number size="mini" v-model="radius" :min="0" :step="0.1" @change="initD3"></el-input-number>
                  </td>
                </tr>
              </table>
        </div>
    </div>
  </div>
</template>

<script>
import degComp from './degComp.vue'
import imgMenuShowComp from './imgMenuShowComp.vue'

import * as d3 from 'd3'

export default {
  data () {
    return {
      rangeShow: false,
      showNum: 3000,
      arr: [],
      geneNameShow: false,
      xLeft: 1,
      yTop: 0,
      xmin: 0,
      xmax: 8000,
      ymin: -3,
      ymax: 3,
      radius: 1.8,
      width: 800,
      height: 605,
      pvalue: 0.05,
      FDR: 0.05,
      log2FoldChange: 1,
    }
  },
  components: {
    degComp,
    imgMenuShowComp
  },
  created () {
    this.pvalue = this.$store.state.degFilterArgs.pvalue
    this.FDR = this.$store.state.degFilterArgs.FDR
    this.log2FoldChange = this.$store.state.degFilterArgs.log2FoldChange
  },
  mounted () {
    this.getData()
    this.$nextTick(function() {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub])
    })
  },
  watch: {
    '$route': 'getDataReset'
  },
  methods: {
    getDataReset () {
      this.geneNameShow = false
      this.showNum = 3000
      this.xLeft = 1
      this.yTop = 2
      this.xmin = -3
      this.xmax = 3
      this.ymin = 0
      this.ymax = 12
      this.width = 800
      this.height = 600
      this.radius = 1.5
      this.getData()
    },
    getData () {
      let _case = sessionStorage.getItem('_case')
      let _control = sessionStorage.getItem('_control')
      this.axios.get('/server/ma_data?username=' + this.$store.state.username + '&p=' + this.$store.state.projectId + '&_case=' + _case + '&_control=' + _control + '&gene_num=' + this.showNum).then((res) => {
        if (res.data.length > 0) {
          res.data = res.data.slice(1)
          this.arr = res.data
          this.rangeShow = true
          this.initD3()
          this.xLeftChange()
        } else {
          this.$message({
            message: '暂无数据!',
            duration: 1000
          })
        }
      })
    },
    backReport () {
      this.$router.push({'name': 'report'})
    },
    change () {
      let all = d3.selectAll('.red')
      all.attr('class', 'green')
    },
    initD3 () {
      let hassvg = d3.selectAll('svg')
      if (hassvg) {
        d3.selectAll('svg').remove()
      }
      let self = this
      let width = this.width
      let height = this.height
      let padding = {left: 50, right: 30, top: 30, bottom: 30}
      let svg = d3.select('#d3container')
        .append('svg')
        .attr('id', 'svg')
        .attr('width', width)
        .attr('height', height)
      let xScale = d3.scaleLinear()
        .domain([this.xmin - 100, this.xmax])
        .range([0, width - padding.left - padding.right])
      let yScale = d3.scaleLinear()
        .domain([this.ymin - 0.2, this.ymax])
        .range([height - padding.top - padding.bottom, 0])
      let tooltip = d3.select('body')
      	.append('div')
      	.style('position', 'absolute')
        .style('z-index', '10')
      	.style('color', '#3497db')
        .style('visibility', 'hidden')
        .style('font-size', '16px')
      	.style('font-weight', 'bold')
      	.text('')
      // 封闭的 box 上边和右边两条线
      svg.append("rect")
        .attr("x", 50)
        .attr("y", 0)
        .attr("width", width - 50)
        .attr("height", height - 30)
        .attr("fill", 'none')
        .attr("stroke", 'black')
      svg.append('line')
        .attr('x1', padding.left + xScale(self.xmin))
        .attr('y1', padding.bottom + yScale(0))
        .attr('x2', padding.left * 2 + xScale(self.xmax))
        .attr('y2', padding.bottom + yScale(0))
        .attr("stroke","red")
      // .style("stroke-dasharray", "5")
      let circles = svg.selectAll('circle')
        .data(self.arr)
        .enter()
        .append('circle')
        .filter((d) => {
          return d[2] > self.ymin && d[2] < self.ymax
        })
        .attr('cx', (d) => {
          return padding.left + xScale(d[1])
        })
        .attr('cy', (d) => {
          return padding.bottom + yScale(d[2])
        })
        .attr('r', self.radius)
        .on('mouseover', function (d, i) {
          return tooltip.style('visibility', 'visible').text(d[5])
        })
        .on('mousemove', function (d, i) {
          return tooltip.style('top', (d3.event.pageY-10)+'px').style('left',(d3.event.pageX+10)+'px')
        })
        .on('mouseout', function (d, i) {
          return tooltip.style('visibility', 'hidden')
        })
      // 超出y轴最小值用倒三角形表示
      svg.selectAll('.triangle')
        .data(self.arr)
        .enter()
        .append("path")
        .filter((d) => {
          return d[2] < self.ymin
        })
        .attr("d", d3.symbol().type(d3.symbolTriangle).size(20))
        .attr("transform", function(d) {
          return "translate("+ (padding.left + xScale(d[1])) +","+ (padding.bottom + yScale(self.ymin)) +")" + "rotate(180)"
        })
        .attr("fill", "none")
        .attr("stroke", (d, i) => {
          if (Math.abs(d[2]) >= self.log2FoldChange && d[3] <= self.pvalue && d[4] <= self.FDR) {
            return "red"
          } else {
            return "black"
          }
        })
        .on('mouseover', function (d, i) {
          return tooltip.style('visibility', 'visible').text(d[5])
        })
        .on('mousemove', function (d, i) {
          return tooltip.style('top', (d3.event.pageY-10)+'px').style('left',(d3.event.pageX+10)+'px')
        })
        .on('mouseout', function (d, i) {
          return tooltip.style('visibility', 'hidden')
        })
      // 超出y轴最小值用正三角形表示
      svg.selectAll('.triangle')
        .data(self.arr)
        .enter()
        .append("path")
        .filter((d) => {
          return d[2] > self.ymax
        })
        .attr("d", d3.symbol().type(d3.symbolTriangle).size(20))
        .attr("transform", function(d) {
          return "translate("+ (padding.left + xScale(d[1])) +","+ (padding.bottom + yScale(self.ymax)) +")"
        })
        .attr("fill", "none")
        .attr("stroke", (d, i) => {
          if (Math.abs(d[2]) >= self.log2FoldChange && d[3] <= self.pvalue && d[4] <= self.FDR) {
            return "red"
          } else {
            return "black"
          }
        })
        .on('mouseover', function (d, i) {
          return tooltip.style('visibility', 'visible').text(d[5])
        })
        .on('mousemove', function (d, i) {
          return tooltip.style('top', (d3.event.pageY-10)+'px').style('left',(d3.event.pageX+10)+'px')
        })
        .on('mouseout', function (d, i) {
          return tooltip.style('visibility', 'hidden')
        })
      let xAxis = d3.axisBottom()
        .scale(xScale)
        // .ticks(3)
      let yAxis = d3.axisLeft()
        .scale(yScale)
        // .ticks(3)
      svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(' + padding.left + ',' + (height - padding.bottom) + ')')
        .call(xAxis)
        .append('text')
        .text('baseMean')
        .attr('fill', '#000')
        .style('font-size', '14px')
        .attr('transform', 'translate('+ width/2.2 + ', 30)')
      svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
        .call(yAxis)
      svg.append('text')
        .text('log2FoldChange')
        .attr('fill', '#000')
        .attr('transform', 'translate(15, '+ height / 2 +') rotate(-90)')

      // 删除 domain 两条线
      d3.selectAll('.domain').remove()

      //  显示满足条件的gene名称
      if (self.geneNameShow === true) {
        svg.selectAll('text')
          .data(self.arr)
          .enter()
          .append('text')
          .filter((d) => {
            if (Math.abs(d[2]) >= self.log2FoldChange) {
              return d[3] <= self.pvalue && d[4] <= self.FDR
            }
          })
          .text((d) => {
            return d[5]
          })
          .attr('x', (d) => {
            return padding.left + xScale(d[1]) + 5
          })
          .attr('y', (d) => {
            return padding.bottom + yScale(d[2])
          })
          .attr('fill', '#3497db')
          .style('font-size', '6px')
        	.style('font-weight', 'bold')
      }
      if (self.xLeft !== 0 || self.yTop !== 0) {
        self.circleColor()
      }
      d3.selectAll(".red").style("fill", "red")
    },
    xLeftChange () {
      let self = this
      let svg = d3.selectAll('circle')
        .classed('red', (d, i) => {
          if (Math.abs(d[2]) >= self.log2FoldChange) {
            return d[3] <= self.pvalue && d[4] <= self.FDR
          }
        })
        this.initD3()
    },
    // 基因名显示的时候 circle颜色不变
    circleColor () {
      let self = this
      let svg = d3.selectAll('circle')
        .classed('red', (d, i) => {
          if (Math.abs(d[2]) >= self.log2FoldChange) {
            return d[3] <= self.pvalue && d[4] <= self.FDR
          }
        })
    },
    xvaluechange () {
      this.initD3()
    }
  }
}
</script>

<style scoped="true">
.content {
  float:left;
  /* width: 60%; */
  width: calc(100% - 350px);
  /* min-width: 900px; */
  padding: 0 20px;
  margin: 19px auto;
}
.span-style {
  display:inline-block;
  width:120px;
  text-align:right;
}
table.gridtable {
    width: 800px;
    text-align: center;
    font-size:14px;
    color:#333333;
    border-width: 1px;
    border-color: #ebeef5;
    border-collapse: collapse;
}
table.gridtable th {
    color: #333;
    border-width: 1px;
    padding: 8px;
    border-style: solid;
    border-color: #ebeef5;
}
table.gridtable td {
    border-width: 1px;
    padding: 4px;
    border-style: solid;
    border-color: #ebeef5;
    background-color: #ffffff;
}
path{
    fill: none;
    stroke: cornflowerblue;
    stroke-width: 2px;
}
.clear {
  clear: both;
}
.min-width-div {
  padding-top: 10px;
  min-width: 900px;
}
</style>
<style>
.domain,.tick line {
    stroke: gray;
    stroke-width: 1px;
}
.margin-0-auto {
  margin: 0 auto;
}
.text-align-center {
  text-align: center;
}
.el-slider.is-vertical .el-slider__runway{
  margin-top: -25px;
}
.yrange {
  width:5px;
}
.display-inline-block {
  float: left;
  /* display:inline-block; */
}
.vertical-align-top {
  vertical-align: top;
}
</style>
