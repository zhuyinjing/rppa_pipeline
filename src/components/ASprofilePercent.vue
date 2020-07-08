<template>
    <div class="">
      <imgMenuShowComp></imgMenuShowComp>

      <el-breadcrumb separator="/" style="margin:5px 0 50px 0">
        <el-breadcrumb-item :to="{ path: 'report' }">{{$t('report.project')}} {{$store.state.projectName}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('leftMenu.asprofile_percent')}}</el-breadcrumb-item>
      </el-breadcrumb>

      <h2>{{$t('leftMenu.asprofile_percent')}}</h2>

      <!-- <el-button type="primary" size="small" icon="el-icon-document" @click="$store.commit('d3savePDF', '可变剪切事件百分比统计')">生成 PDF</el-button> -->
      <el-button type="primary" size="small" icon="el-icon-picture" @click="$store.commit('d3saveSVG', ['ASprofilePercent'])">{{$t('button.svg')}}</el-button>
      <i class="el-icon-question cursor-pointer" style="font-size:16px" @click="$store.state.svgDescribeShow = true"></i>

      <div id="d3container"></div>

    </div>
</template>

<script>
import imgMenuShowComp from './imgMenuShowComp.vue'
import * as d3 from 'd3'

export default {
  data() {
    return {
      eventsArr: [],
      eventsArrReverse: [],
      samplesArr: [],
      data: [],
    }
  },
  components: {
    imgMenuShowComp
  },
  mounted() {
    this.getValue()
  },
  methods: {
    getValue() {
      this.axios.get('/server/as_profile_info?username=' + this.$store.state.username + '&p=' + this.$store.state.projectId).then((res) => {
        if (res.data.message_type === 'success') {
          this.eventsArr = res.data.ASProfileInfo.asName
          this.samplesArr = res.data.ASProfileInfo.sampleName
          for(let i = 0;i < this.eventsArr.length;i++) {
            this.data.push(res.data.ASProfileInfo.asEventPercentMap[this.eventsArr[i]])
          }
          this.eventsArrReverse = Array.from(this.eventsArr).reverse()
          this.initD3()
        } else {
          this.$message.error('请求错误!')
        }
      })
    },
    initD3() {
      let margin = {
        left: 50,
        right: 30,
        top: 30,
        bottom: 80
      }

      let width = 900
      let height = 600

      let svg = d3.select('#d3container')
        .append('svg')
        .attr('id', 'svg')
        .attr('width', 1000)
        .attr('height', height)
      let tooltip = d3.select('body')
      	.append('div')
      	.style('position', 'absolute')
        .style('z-index', '10')
        .style('visibility', 'hidden')
        .style('font-size', '16px')
      	.style('font-weight', 'bold')
      	.text('')
      var x = d3.scaleBand()
        .domain(this.samplesArr)
        .rangeRound([margin.left, width - margin.right])
        .padding(0.3)

      var y = d3.scaleLinear()
        .domain([0, 100])
        .rangeRound([height - margin.bottom, margin.top])

      var color = d3.scaleOrdinal(d3.schemeCategory20)

      var stack = d3.stack()
        .offset(d3.stackOffsetExpand);

      svg.append("g")
        .attr("transform", "translate(0," + y(0) + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "start")
        .attr("transform", "rotate(45 -10 10)");

      svg.append("g")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(d3.axisLeft(y).tickFormat(d =>  d + "%" ))
      for (let i = 0;i < this.samplesArr.length;i++) {
        let sum = 0
        let sum2 = 0
        let index = i
        let sample = this.samplesArr[i]
        svg.selectAll(".rect")
          .data(this.data)
          .enter().append("rect")
          .attr("x", (d) => {
            return x(sample);
          })
          .attr("y", (d, i) => {
            sum = sum + d[index]
            return y(sum)
          })
          .attr("height", (d, i) => {
            sum2 = sum2 + d[index]
            if (i === 0) {
              return y(0) - y(d[index])
            } else {
              return y(sum2-d[index]) - y(sum2)
            }
          })
          .attr("width", x.bandwidth())
          .attr("fill", (d,i) => {
            return color(i)
          })
          .on('mouseover', (d, i) => {
            return tooltip.style('visibility', 'visible').text(this.eventsArr[i] + ' ' + d[index] + '%')
          })
          .on('mousemove', function (d, i) {
            return tooltip.style('top', (d3.event.pageY-10)+'px').style('left',(d3.event.pageX+10)+'px')
          })
          .on('mouseout', function (d, i) {
            return tooltip.style('visibility', 'hidden')
          })
      }
    //  图例
    let legend = svg.append("g")
      .attr("transform", "translate(" + (width - 30) + ","+ margin.top +")")
    legend.selectAll("rect")
      .data(this.eventsArrReverse)   // 为了和图的颜色从上到下一样
      .enter().append("rect")
      .attr("x",(d,i)=>{
        return 0
      })
      .attr("y",(d,i)=>{
        return 15 * i + 5 * i   // 每个 rect 间隔为5
      })
      .attr("width",15)
      .attr("height",15)
      .attr("fill",(d,i) => {
        return color(this.eventsArr.length - 1 - i)
      })
    legend.selectAll("text")
      .data(this.eventsArrReverse)
      .enter().append("text")
      .attr("x",(d,i)=>{
        return 20
      })
      .attr("y",(d,i)=>{
        return 15 * i + 5 * i + 12
      })
      .text((d) => {
        return d
      })


    },
  }
}
</script>

<style scoped="true">
.content {
  float: left;
  width: calc(100% - 350px);
  padding: 0 20px;
  margin: 19px auto;
}
</style>
