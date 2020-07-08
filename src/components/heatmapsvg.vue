<template>
  <div class="">

      <imgMenuShowComp></imgMenuShowComp>

      <degComp></degComp>

      <!-- <el-button type="primary" size="small" icon="el-icon-document" @click="$store.commit('d3savePDF', '基因热图')">生成 PDF</el-button> -->
      <el-button type="primary" size="small" icon="el-icon-picture" @click="$store.commit('d3saveSVG', ['heatmap_' + $store.state._case + '_' + $store.state._control])">{{$t('button.svg')}}</el-button>
      <i class="el-icon-question cursor-pointer" style="font-size:16px" @click="$store.state.svgDescribeShow = true"></i>

      <div class="">
        <div class="icon-func-div">
          <span class="font-size-12">{{$t('d3.gene_id_show')}}</span>
          <el-switch
            v-model="idShow"
            active-text=""
            inactive-text=""
            @change="idShowChange"
            >
          </el-switch>
        </div>

        <div id="d3container"></div>

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
      arr: [],
      temp: [],
      value: [],
      sortValue: [],
      idShow: false,
      visible: 'hidden',
      height: 5,
    }
  },
  components: {
    degComp,
    imgMenuShowComp
  },
  created () {
    this.$store.state.heatmapJson.heatmap_json_string = JSON.parse(this.$store.state.heatmapJson.heatmap_json_string)

    let self = this
    for (let k in this.$store.state.heatmapJson.heatmap_json_string.data.nodes) {
      let node = this.$store.state.heatmapJson.heatmap_json_string.data.nodes[k]
      if (('parent' in node) === false) {
        preOrder(node)
      }
    }
    function preOrder(node){
       if(node.count === 1){
         self.temp.push(node.objects[0]);  // y 轴的gene名称
         for(let i = 0;i < node.features.length;i++) {
           self.value.push(node.features[i])   // 每一行的值
           self.sortValue.push(node.features[i])  // 用来排序的数组
         }
       } else {
         preOrder(self.$store.state.heatmapJson.heatmap_json_string.data.nodes[node['left_child']]);
         preOrder(self.$store.state.heatmapJson.heatmap_json_string.data.nodes[node['right_child']]);
       }
     }
  },
  mounted () {
    this.d3heatmap()
  },
  watch: {
    '$route': 'routerChange'
  },
  methods: {
    routerChange () {
      this.idShow = false
      this.idShowChange()
    },
    idShowChange () {
      if (this.idShow === true) {
        this.height = 9
        this.visible = 'visible'
      } else {
        this.height = 5
        this.visible = 'hidden'
      }
      this.d3heatmap()
    },
    d3heatmap () {
      let hassvg = d3.selectAll('.d3svg')
      if (hassvg) {
        d3.selectAll('.d3svg').remove()
      }
      let self = this
      let yData = self.temp
      let xData = this.$store.state.heatmapJson.heatmap_json_string.data.feature_names
      // mouseover text
      let tooltip = d3.select('body')
        .append('div')
        .style('position', 'absolute')
        .style('z-index', '10')
        .style('visibility', 'hidden')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .style('color', 'yellow')
        .text('')
      var array_data = [];
      var margin = { top: 50, right: 20, bottom: 100, left: 100 },
          width = 820 - margin.left - margin.right,        // 所有格子区域的宽度，即Heatmap的宽度
          height = self.height * yData.length ,
          gridSize = Math.floor(width / xData.length)     // 求地板，即去掉小数部分，width分成 xData.length 份

              function sortNumber (a, b) {
                return a - b
              }
              self.sortValue.sort(sortNumber)   //  排序后的数组
              let min = self.sortValue[Math.ceil(0.1 * self.sortValue.length)]
              let middle = self.sortValue[Math.ceil(self.sortValue.length/2)]
              let max = self.sortValue[self.sortValue.length - Math.ceil(0.1 * self.sortValue.length) - 1]

              var linear = d3.scaleLinear()
              				.domain([min, middle, max])
              				.range([(d3.rgb(0,255,0)).darker(1), (d3.rgb(19,3,3)).darker(1), (d3.rgb(255,0,0)).darker(0.7)]);

              // 设置chart，svg
              var svg = d3.select("#d3container").append("svg") // 选择“chart”（就是div），加入一个svg，设置属性跟div一样大
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .attr("class", "d3svg")
                  .append("g")    // 在svg内加入一个g（group组），并设置元素g的显示位置
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

              var timeLabels = svg.selectAll(".testLabel")
                  .data(xData)
                  .enter().append("text")
                  .text(function(d) { return d; })
                  .attr("x", function(d, i) { return i * gridSize + 15; })
                  .attr("y", height)
                  .attr("class", 'xText')
                  .style("font-size", "9px")
                  // .style("font-weight", "bold")
                  .style("font-family", "Consolas, Monaco, monospace")
                  .style("text-anchor", "start")
                  .attr('transform', (d,i)=>{
                    return 'rotate(45, ' + (i * gridSize) + ' '+ (height) +')'
                  })

             var dayLabels = svg.selectAll(".nameLabel")
                 .data(yData)
                 .enter()    // 为data中每一项创建一个".dayLabel"
                 .append("text")    // 为days中每一项创建一的".dayLabel"添加文本，下面全是设置文本的属性
                 .text(function (d) { return d; })
                 .attr("x", 0)
                 .attr("y", function (d, i) { return i * 9; })
                 .style("text-anchor", "end")
                 .style("font-size", "9px")
                 .style("font-family", "Consolas, Monaco, monospace")
                 .attr("transform", "translate(-6," + "9)")
                 .attr('class', 'ySum')
                 .style('visibility', self.visible)
              var heatMap = svg.selectAll(".score")
                  .data(self.value)
                  .enter()
                  .append("rect")
                  .attr("x", function(d, i){ return (i % xData.length)*gridSize;})
                  .attr("y", function(d, i){ return parseInt(i / xData.length) * self.height;})
                  .attr("width", gridSize)
                  .attr("height", self.height)
                  .style("fill", "#FFFFFF")
                  .on('mouseover', function (d, i) {
                    return tooltip.style('visibility', 'visible').text(d)
                  })
                  .on('mousemove', function (d, i) {
                    return tooltip.style('top', (d3.event.pageY-10)+'px').style('left',(d3.event.pageX+10)+'px')
                  })
                  .on('mouseout', function (d, i) {
                    return tooltip.style('visibility', 'hidden')
                  })
              // duration(1000) 在1000ns也就是1s内将格子图上色
              heatMap.transition().duration(500)
                  .style("fill", function(d) { return linear(d) });
    },
    backHeatmapsvgInput () {
      this.$router.push({'name': 'heatmapsvg_input'})
    },
  }
}
</script>

<style scoped="true">
.content {
  float:left;
  width: 60%;
  padding: 0 20px;
  margin: 19px auto;
}
.icon-func-div {
  margin-top: 10px;
}
.font-size-12 {
  font-size: 12px;
}
</style>
