<template>
    <div class="">
      <imgMenuShowComp></imgMenuShowComp>

      <el-breadcrumb separator="/" style="margin:5px 0 50px 0">
        <el-breadcrumb-item :to="{ path: 'report' }">{{$t('report.project')}} {{$store.state.projectName}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('leftMenu.asprofile_number')}}</el-breadcrumb-item>
      </el-breadcrumb>

      <h2>{{$t('leftMenu.asprofile_number')}}</h2>

      <div class="" style="min-width:1100px">
        <label for="">{{$t('ASprofile.asprofile_event')}}</label>
        <el-select v-model="events" multiple placeholder="请选择" style="width:400px;">
          <el-option
            v-for="item in eventsArr"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <label for="">{{$t('sample')}}</label>
        <el-select v-model="samples" multiple placeholder="请选择" style="width:400px;">
          <el-option
            v-for="(item,key) in samplesArr"
            :key="item"
            :label="item"
            :value="key">
          </el-option>
        </el-select>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <el-button type="primary" @click="initD3()">{{$t('button.submit')}}</el-button>
      </div>
      <br>
      <!-- <el-button type="primary" size="small" icon="el-icon-document" @click="$store.commit('d3savePDF', '可变剪切事件数量统计')">生成 PDF</el-button> -->
      <el-button type="primary" size="small" icon="el-icon-picture" @click="$store.commit('d3saveSVG', ['ASprofile'])">{{$t('button.svg')}}</el-button>
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
      events: [],
      samples: [],
      eventsArr: [],
      samplesArr: [],
      data: {},
    }
  },
  components: {
    imgMenuShowComp
  },
  mounted() {
    this.getValue()
  },
  methods: {
    getValue () {
      this.axios.get('/server/as_profile_info?username=' + this.$store.state.username + '&p=' + this.$store.state.projectId).then((res) => {
        if (res.data.message_type === 'success') {
          this.eventsArr = res.data.ASProfileInfo.asName
          this.samplesArr = res.data.ASProfileInfo.sampleName
          this.data = res.data.ASProfileInfo.asEventMap
          // 默认全选
          this.events = res.data.ASProfileInfo.asName
          // 存索引
          this.samplesArr.forEach((value, key) => {
            this.samples.push(key)
          })
          this.initD3()
        } else {
          this.$message.error('请求错误!')
        }
      })
    },
    initD3() {
      if (this.events.length === 0 || this.samples.length === 0 ) {
        this.$message.error('请选择可变剪切事件和样本，不能为空！')
        return
      }
      let hassvg = d3.selectAll('svg')
      if (hassvg) {
        d3.selectAll('svg').remove()
      }
      let width = 1000
      let height = 400
      let margin = {left: 100, right: 30, top: 30, bottom: 80}

      let tooltip = d3.select('body')
      	.append('div')
      	.style('position', 'absolute')
        .style('z-index', '10')
        .style('visibility', 'hidden')
        .style('font-size', '16px')
      	.style('font-weight', 'bold')
      	.text('')

      let svgBox = d3.select('#d3container')
        .append('svg')
        .attr('id', 'svg')
        .attr('width', width)
        .attr('height', height * this.events.length)

        for (let i = 0;i < this.events.length;i++) {
          let svg = svgBox.append("g").attr("transform","translate("+ 0 +"," + (height * i) + ")")
          let arr = this.data[this.events[i]].filter((value, key) => {
              if (this.samples.includes(key)) {
                  return value
              }
          })

          let xData = this.samplesArr.filter((value, key) => {
              if (this.samples.includes(key)) {
                  return value
              }
          })
          var x = d3.scaleBand()
            .domain(xData)
            .range([margin.left, width - margin.right])
            .padding(0.5)

          var y = d3.scaleLinear()
            .domain([0, d3.max(arr)])
            .range([height - margin.bottom, margin.top]).nice()

          var color = d3.scaleOrdinal(d3.schemeCategory10);

          svg.append("g")
            .selectAll("g")
            .data(arr)
            .enter().append("g")
            .attr("fill", (d, j) => {
              return color(i)
            })
            .selectAll("rect")
            .data(arr)
            .enter().append("rect")
            .attr("width", x.bandwidth)
            .attr("x", (d, i) => {
              return x(xData[i])
            })
            .attr("y", (d) => {
              return y(d)
            })
            .attr("height", (d) => {
              return y(0) - y(d)
            })
            .on('mouseover', (d, i) => {
              return tooltip.style('visibility', 'visible').text(d)
            })
            .on('mousemove', function (d, i) {
              return tooltip.style('top', (d3.event.pageY-10)+'px').style('left',(d3.event.pageX+10)+'px')
            })
            .on('mouseout', function (d, i) {
              return tooltip.style('visibility', 'hidden')
            })

          svg.append("g")
            .attr("transform", "translate(0," + (height - margin.bottom) + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "start")
            .attr("transform", "rotate(45 -10 10)");

          svg.append("g")
            .attr("transform", "translate(" + margin.left + ",0)")
            .call(d3.axisLeft(y))
            .append('text')
            .text(this.events[i])
            .style("font-size", "16px")
            .attr('fill', '#000')
            .attr('transform', 'translate(' + 0 + ', 25)')

        }

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
