<template>
  <div class="">
          <imgMenuShowComp></imgMenuShowComp>

      <degComp></degComp>

      <div class="">
        <p>{{$t('volcano_plot.introduction')}}</p>
        <!-- <el-button type="primary" size="small" icon="el-icon-document" @click="$store.commit('d3savePDF', '火山图')">生成 PDF</el-button> -->
        <el-button type="primary" size="small" icon="el-icon-picture" @click="$store.commit('d3saveSVG', ['volcano_' + $store.state._case + '_' + $store.state._control])">{{$t('button.svg')}}</el-button>
        <i class="el-icon-question cursor-pointer" style="font-size:16px" @click="$store.state.svgDescribeShow = true"></i>

        <div>
              <div class="yrange display-inline-block vertical-align-top" v-show="rangeShow">
                <el-slider
                v-model="yTop"
                :step="0.1"
                :min="xRightOptions.min"
                :max="xRightOptions.max"
                 vertical
                :style="{marginTop: '26px',marginLeft: '-20px',height: xRightOptions.height + 'px'}"
                @change="xLeftChange()"
                >
              </el-slider>
              </div>

              <div id="d3container" class="display-inline-block vertical-align-top"></div>

              <div class="clear"></div>

              <div class="" v-show="rangeShow">
                  <el-slider
                  v-model="xLeft"
                  :step="0.1"
                  :min="xLeftOptions.min"
                  :max="xLeftOptions.max"
                  :style="{width: xLeftOptions.width + 'px', marginLeft: (xLeftOptions.width + 50) + 'px'}"
                  @change="xLeftChange()"
                  >
                </el-slider>
              </div>

              <table class="gridtable" v-show="rangeShow">
                <tr>
                    <th>{{$t('d3.args')}}</th><th>{{$t('d3.option')}}</th>
                </tr>
                <tr>
                  <td>{{$t('d3.y_axis')}}</td>
                  <td>
                    <el-switch
                      style="display: block"
                      v-model="xvalueShow"
                      active-color="#409EFF"
                      inactive-color="#409EFF"
                      active-text=" -log10(pvalue)"
                      inactive-text="-log10(padj)"
                      @change="xvaluechange"
                    >
                    </el-switch>
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
                  <td>Log2FoldChange</td>
                  <td>
                    <el-input-number size="mini" :min="0" v-model="xLeft" :step="0.1" @change="xLeftChange"></el-input-number>
                  </td>
                </tr>
                <tr>
                  <td>-log10(pvalue)</td>
                  <td>
                    <el-input-number size="mini" :min="0" v-model="yTop" :step="0.1" @change="xLeftChange"></el-input-number>
                  </td>
                </tr>
                <tr>
                  <td>{{$t('d3.xmin')}}</td>
                  <td>
                    <el-input-number size="mini" v-model="xmin" @change="initD3"></el-input-number>
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
      showNum: 20000,
      arr: [],
      xvalueShow: true,
      geneNameShow: false,
      xLeft: 1,
      yTop: 0,
      xmin: -5,
      xmax: 5,
      ymin: 0,
      ymax: 12,
      radius: 1.8,
      width: 800,
      height: 600,
      xLeftOptions: {
        eventType: 'auto',
        width: 350,
        height: 6,
        dotSize: 16,
        dotHeight: null,
        dotWidth: null,
        min: 0,
        max: 3
      },
      xRightOptions: {
        eventType: 'auto',
        width: 5,
        height: 550,
        dotSize: 16,
        dotHeight: null,
        dotWidth: null,
        min: 2,
        max: 4
      },
      pvalueArr: [],
      padjArr: [],
    }
  },
  components: {
    degComp,
    imgMenuShowComp
  },
  mounted () {
    this.getData()
  },
  watch: {
    '$route': 'getDataReset'
  },
  methods: {
    getDataReset () {
      this.xvalueShow = true
      this.geneNameShow = false
      this.showNum = 20000
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
      this.axios.get('/server/volcano?username=' + this.$store.state.username + '&p=' + this.$store.state.projectId + '&_case=' + _case + '&_control=' + _control + '&gene_num=' + this.showNum).then((res) => {
        if (res.data.length > 0) {
          this.pvalueArr = []
          this.padjArr = []
          let temp = []
          temp = res.data.slice(1)
          // temp = temp.filter(d => ['Inf', '-Inf'].indexOf(d[2]) === -1)       // mouse 1v1
          for (let i = 0;i< temp.length; i++) {
            let val = temp[i]
            // this.pvalueArr.push([val[2] - 0, Math.log10(val[3]) * -1, val[4]])    // mouse 1v1
            // this.padjArr.push([val[2] - 0, Math.log10(val[3]) * -1, val[4]])     // mouse 1v1

            this.pvalueArr.push([val[1] - 0, Math.log10(val[2]) * -1, val[4]])
            this.padjArr.push([val[1] - 0, Math.log10(val[3]) * -1, val[4]])
          }
          if (this.xvalueShow === true) {
            this.arr = this.pvalueArr
          } else {
            this.arr = this.padjArr
          }
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
      let padding = {left: 30, right: 30, top: 30, bottom: 30}
      this.xLeftOptions.max = this.xmax
      this.xRightOptions.min = this.ymin
      this.xRightOptions.max = this.ymax
      this.xLeftOptions.width = this.width / 2  - 40
      this.xRightOptions.height = this.height  - 50
      let svg = d3.select('#d3container')
        .append('svg')
        .attr('id', 'svg')
        .attr('width', width)
        .attr('height', height)
      let xScale = d3.scaleLinear()
        .domain([this.xmin, this.xmax])
        .range([0, width - padding.left - padding.right])
      let yScale = d3.scaleLinear()
        .domain([this.ymin, this.ymax])
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
      let circles = svg.selectAll('circle')
        .data(self.arr)
        .enter()
        .append('circle')
        .attr('cx', (d) => {
          return padding.left + xScale(d[0])
        })
        .attr('cy', (d) => {
          return padding.bottom + yScale(d[1])
        })
        .attr('r', self.radius)
        .on('mouseover', function (d, i) {
          return tooltip.style('visibility', 'visible').text(d[2])
        })
        .on('mousemove', function (d, i) {
          return tooltip.style('top', (d3.event.pageY-10)+'px').style('left',(d3.event.pageX+10)+'px')
        })
        .on('mouseout', function (d, i) {
          return tooltip.style('visibility', 'hidden')
        })
      let xAxis = d3.axisBottom()
        .scale(xScale)
      let yAxis = d3.axisLeft()
        .scale(yScale)
      svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(' + padding.left + ',' + (height - padding.bottom) + ')')
        .call(xAxis)
        .append('text')
        .text('Log2FoldChange')
        .attr('fill', '#000')
        .attr('transform', 'translate('+ width/2.2 + ', 28)')
      svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
        .call(yAxis)
        .append('text')
        .text('-log10(pvalue)')
        .attr('fill', '#000')
        .attr('transform', 'translate(' + padding.left + ', -10)')
      // 阈值分割线
      svg.append('line')
        .attr('x1', padding.left + xScale(self.xLeft))
        .attr('y1', padding.bottom + yScale(0))
        .attr('x2', padding.left + xScale(self.xLeft))
        .attr('y2', padding.bottom + yScale(self.ymax))
        .attr("stroke","#999")
        .style("stroke-dasharray", "5")

      svg.append('line')
        .attr('x1', padding.left + xScale(-self.xLeft))
        .attr('y1', padding.bottom + yScale(0))
        .attr('x2', padding.left + xScale(-self.xLeft))
        .attr('y2', padding.bottom + yScale(self.ymax))
        .attr("stroke","#999")
        .style("stroke-dasharray", "5")

      svg.append('line')
        .attr('x1', padding.left + xScale(self.xmin))
        .attr('y1', padding.bottom + yScale(self.yTop))
        .attr('x2', padding.left + xScale(self.xmax))
        .attr('y2', padding.bottom + yScale(self.yTop))
        .attr("stroke","#999")
        .style("stroke-dasharray", "5")

      //  显示满足条件的gene名称
      if (self.geneNameShow === true) {
        svg.selectAll('text')
          .data(self.arr)
          .enter()
          .append('text')
          .filter((d) => {
            return d[1] > self.yTop && Math.abs(d[0]) > self.xLeft
          })
          .text((d) => {
            return d[2]
          })
          .attr('x', (d) => {
            return padding.left + xScale(d[0]) + 5
          })
          .attr('y', (d) => {
            return padding.bottom + yScale(d[1])
          })
          .attr('fill', '#3497db')
          .style('font-size', '6px')
        	.style('font-weight', 'bold')
      }
      if (self.xLeft !== 0 || self.yTop !== 0) {
        self.circleColor()
      }
      d3.selectAll(".red").style("fill", "red")
      d3.selectAll(".green").style("fill", "green")
    },
    xLeftChange () {
      let self = this
      let svg = d3.selectAll('circle')
        .classed('green', (d, i) => {
          return d[0] < -self.xLeft && d[1] > self.yTop
        })
        .classed('red', (d, i) => {
          return d[0] > self.xLeft && d[1] > self.yTop
        })
      // if (this.geneNameShow === true) {
        this.initD3()
      // }
    },
    // 基因名显示的时候 circle颜色不变
    circleColor () {
      let self = this
      let svg = d3.selectAll('circle')
        .classed('green', (d, i) => {
          return d[0] < -self.xLeft && d[1] > self.yTop
        })
        .classed('red', (d, i) => {
          return d[0] > self.xLeft && d[1] > self.yTop
        })
    },
    xvaluechange () {
      if (this.xvalueShow === true) {
        this.arr = this.pvalueArr
        this.initD3()
      } else {
        this.arr = this.padjArr
        this.initD3()
      }
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
  width: 0px !important;
}
.display-inline-block {
  float: left;
  /* display:inline-block; */
}
.vertical-align-top {
  vertical-align: top;
}
</style>
