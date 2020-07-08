<template>
      <div class="">
        <imgMenuShowComp></imgMenuShowComp>

        <el-breadcrumb separator="/" style="margin:5px 0 50px 0">
          <el-breadcrumb-item :to="{ path: 'report' }">{{$t('report.project')}} {{$store.state.projectName}}</el-breadcrumb-item>
          <el-breadcrumb-item>{{$t('leftMenu.pca')}}</el-breadcrumb-item>
        </el-breadcrumb>

        <h2>{{$t('leftMenu.pca')}}</h2>

        <!-- <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox> -->
        <!-- <div style="margin: 15px 0;"></div> -->
        <el-checkbox-group v-model="checkedPCA" @change="handlecheckedPCAChange">
          <el-checkbox style="width:20%" v-for="(pca, index) in checkboxValue" :label="pca" :key="pca" v-show="percentVariance[index] > 0.01?true:false">PC{{pca}} ( {{(percentVariance[index] * 100).toFixed(0)}}% )</el-checkbox>
        </el-checkbox-group>

        <br>
        <el-button type="primary" size="small" @click="initD3()">{{$t('button.confirm')}}</el-button>
        <el-button type="info" size="small" @click="checkedPCA = []">{{$t('button.clear')}}</el-button>
        &nbsp;&nbsp;&nbsp;
        {{$t('d3.radius')}}：<el-input-number size="mini" v-model="radius" :step="1" :min="0" @change="initD3()"></el-input-number>
        &nbsp;&nbsp;&nbsp;
        {{$t('d3.opacity')}}：<el-input-number size="mini" v-model="opacity" :step="0.1" :min="0" @change="initD3()"></el-input-number>&nbsp;
        <!-- <el-button type="primary" size="small" icon="el-icon-document" @click="$store.commit('d3savePDF', '样本聚类')">生成 PDF</el-button> -->
        <el-button type="primary" size="small" icon="el-icon-picture" @click="$store.commit('d3saveSVG', ['PCA'])">{{$t('button.svg')}}</el-button>
        <i class="el-icon-question cursor-pointer" style="font-size:16px" @click="$store.state.svgDescribeShow = true"></i>

        <div class="margin-top-10" id="d3container"></div>

      </div>
</template>

<script>
import imgMenuShowComp from './imgMenuShowComp.vue'
import * as d3 from 'd3'

export default {
  data() {
    return {
      checkboxValue: [],
      checkAll: false,
      checkedPCA: [],
      isIndeterminate: false,
      tableValue: [],
      conditionArr: [],
      maxValue: [],
      minValue: [],
      nameSampleMap: {},
      percentVariance: [],
      radius: 6,
      opacity: 0.7,
    }
  },
  components: {
    imgMenuShowComp
  },
  created() {
    this.getValue()
  },
  mounted() {},
  methods: {
    getValue() {
      this.axios.get('/server/pca4gene?username=' + this.$store.state.username + '&p=' + this.$store.state.projectId).then((res) => {
        this.maxValue = res.data.maxValue
        this.minValue = res.data.minValue
        this.percentVariance = res.data.pca4GeneExprMatrix.percentVariance
        this.nameSampleMap = res.data.experimentDesign.nameSampleMap
        // checkbox 选项
        for (let i = 0; i < res.data.pca4GeneExprMatrix.percentVariance.length; i++) {
          this.checkboxValue.push(i + 1)
        }
        // 默认选中前两个
        this.checkedPCA = [this.checkboxValue[0], this.checkboxValue[1]]
        // condition array ["A","B","Normal"]
        for (let k in res.data.experimentDesign.conditionNumMap) {
          this.conditionArr.push(k)
        }
        for (let k in res.data.pca4GeneExprMatrix.sampleCoordMap) {
          let obj = {
            name: k,
            value: res.data.pca4GeneExprMatrix.sampleCoordMap[k]
          }
          this.tableValue.push(obj)
        }
        this.initD3()
      })
    },
    handleCheckAllChange(val) {
      this.checkedPCA = val ? this.checkboxValue : [];
      this.isIndeterminate = false;
    },
    handlecheckedPCAChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.checkboxValue.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkboxValue.length;
    },
    initD3() {
      if (this.checkedPCA.length < 2) {
        this.$message('请至少选择2个PC！')
        return
      }
      if (this.checkedPCA.length > 10) {
        this.$message('最多选择10个PC，请修改您的选项！')
        return
      }
      let hassvg = d3.selectAll('.d3pcasvg')
      if (hassvg) {
        d3.selectAll('.d3pcasvg').remove()
      }
      let self = this
      var initWidth = this.checkedPCA.length > 8 ? this.checkedPCA.length * 100 : 800
      var initHeight = this.checkedPCA.length > 8 ? this.checkedPCA.length * 100 : 800
      // var initWidth = 800 + 40 * this.checkedPCA.length
      // var initHeight = 800 + 40 * this.checkedPCA.length

      var padding = {
        left: 80,
        top: 50,
        right: 260,
        bottom: 20
      }
      var width1 = initWidth + padding.right
      var height1 = initHeight + padding.bottom

      var arr = this.checkedPCA

      var width2 = initWidth - padding.left - padding.bottom
      var height2 = initHeight - padding.top - padding.bottom

      // color 配色
      var colorRandom = d3.scaleOrdinal(d3.schemeCategory10)

      let tooltip = d3.select('body')
      	.append('div')
      	.style('position', 'absolute')
        .style('z-index', '10')
        .style('visibility', 'hidden')
        .style('font-size', '16px')
      	.style('font-weight', 'bold')
      	.text('')
      var svgG = d3.select("#d3container")
        .append("svg")
        .attr("class", "d3pcasvg")
        .attr("width", width1)
        .attr("height", height1)

      if (this.checkedPCA.length === 2) {
        var width = width2
        var height = height2
        var svg = svgG.append('g').attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
        //  x轴文字
        svg.append("text")
    					.attr("x", width / 2)
    					.attr("y", -20)
    					.attr("dy", "-0.3em")
    					.text(function(){
    						return "PC" + self.checkedPCA[0];
    					});
        svg.append("text")
    					.attr("x", width / 2)
    					.attr("y", -5)
    					.attr("dy", "-0.3em")
    					.text(function(){
    						return "(" + (self.percentVariance[self.checkedPCA[0] - 1] * 100).toFixed(0) + "%)";
    					});
        //  y轴文字
        svg.append("text")
    					.attr("x", -60)
    					.attr("y", height / 2)
              .attr("dy", "-0.3em")
              .style('text-anchor', 'start')
    					.text(function(){
                return "PC" + self.checkedPCA[1];
    					});
          svg.append("text")
      					.attr("x", -60)
      					.attr("y", height / 2 + 20)
                .attr("dy", "-0.3em")
                .style('text-anchor', 'start')
      					.text(function(){
                  return "(" + (self.percentVariance[self.checkedPCA[1] - 1] * 100).toFixed(0) + "%)";
      					});
        //y轴比例尺
        var yScale = d3.scaleLinear().range([height, 0])
          .domain([(d3.max([self.maxValue[self.checkedPCA[0] - 1], self.maxValue[self.checkedPCA[1] - 1]])) + 2, (d3.min([self.minValue[self.checkedPCA[0] - 1], self.minValue[self.checkedPCA[1] - 1]])) - 2])
        //定义y轴
        var yAxis = d3.axisLeft(yScale).ticks(3)
        //添加y轴
        var yaxisg = svg.append("g")
          .attr("class", "yaxis")
          .attr("transform", "translate(" + 0 + "," + 0 + ")")
          .call(yAxis)
          .style("font-size", "14px")
        //x轴比例尺
        var xScale = d3.scaleLinear().range([0, width])
          .domain([(d3.min([self.minValue[self.checkedPCA[0] - 1], self.minValue[self.checkedPCA[1] - 1]])) - 2, (d3.max([self.maxValue[self.checkedPCA[0] - 1], self.maxValue[self.checkedPCA[1] - 1]])) + 2])
        //定义x轴
        var xAxis = d3.axisBottom(xScale).ticks(3)
        //添加x轴
        var xaxisg = svg.append("g")
          .attr("class", "xaxis")
          .attr("transform", "translate(" + "0 ," + height + ")")
          .call(xAxis)
          .style("font-size", "14px")
        // d3.selectAll('.domain').remove() // 删除多余的两端刻度线
        //添加网格-----------
        // gridlines in x axis function
        function make_x_gridlines() {
          return d3.axisBottom(xScale)
            .ticks(3)
        }

        // gridlines in y axis function
        function make_y_gridlines() {
          return d3.axisLeft(yScale)
            .ticks(3)
        }

        // add the X gridlines
        svg.append("g")
          .attr("class", "grid")
          .attr("transform", "translate(0," + height + ")")
          .call(make_x_gridlines()
            .tickSize(-height)
            .tickFormat("")
          )

        // add the Y gridlines
        svg.append("g")
          .attr("class", "grid")
          .call(make_y_gridlines()
            .tickSize(-width)
            .tickFormat("")
          )
        // color 配色
        var colorRandom = d3.scaleOrdinal(d3.schemeCategory10)
        //添加circle包裹层，有几种类型添加几个
        var cover = svg.append("g")

        //添加circle
        cover.selectAll("circle")
          .data(self.tableValue)
          .enter()
          .append("circle")
          .attr("cx", function(d, i) {
            return xScale(d['value'][self.checkedPCA[0] - 1])
          })
          .attr("cy", function(d, i) {
            return yScale(d['value'][self.checkedPCA[1] - 1])
          })
          .attr("r", self.radius)
          .attr("fill", function(d) {
            return colorRandom(self.nameSampleMap[d['name']]['condition'])
          })
          .style("opacity",self.opacity)
          .on('mouseover', (d, i) => {
            return tooltip.style('visibility', 'visible').text(d.name)
          })
          .on('mousemove', function (d, i) {
            return tooltip.style('top', (d3.event.pageY-10)+'px').style('left',(d3.event.pageX+10)+'px')
          })
          .on('mouseout', function (d, i) {
            return tooltip.style('visibility', 'hidden')
          })
      } else {
        var width = width2 / self.checkedPCA.length
        var height = height2 / self.checkedPCA.length
        for (let i = 0; i < arr.length; i++) {
          for (let j = 0; j < arr.length; j++) {
            var svg = svgG.append('g').attr('transform', 'translate(' + (j * (width) + (padding.left)) + ',' + (i * (height) + (padding.top)) + ')')
            // var svg = svgG.append('g').attr('transform','translate('+ (j * (width) + (j* 10))  +','+ (i * (height) + (i* 10)) +')')
            //y轴比例尺
            var yScale = d3.scaleLinear().range([height, 0])
              .domain([(d3.max([self.maxValue[arr[j] - 1], self.maxValue[arr[i] - 1]])) + 2, (d3.min([self.minValue[arr[j] - 1], self.minValue[arr[i] - 1]])) - 2])
            //定义y轴
            var yAxis = d3.axisLeft(yScale).ticks(arr.length > 2 ? 0 : 3)
            //添加y轴
            var yaxisg = svg.append("g")
              .attr("class", "yaxis")
              .attr("transform", "translate(" + 0 + "," + 0 + ")")
              .call(yAxis)
              .style("font-size", "14px")
            //x轴比例尺
            var xScale = d3.scaleLinear().range([0, width])
              .domain([(d3.min([self.minValue[arr[j] - 1], self.minValue[arr[i] - 1]])) - 2, (d3.max([self.maxValue[arr[j] - 1], self.maxValue[arr[i] - 1]])) + 2])
            //定义x轴
            var xAxis = d3.axisBottom(xScale).ticks(arr.length > 2 ? 0 : 3)
            //添加x轴
            var xaxisg = svg.append("g")
              .attr("class", "xaxis")
              .attr("transform", "translate(" + "0 ," + height + ")")
              .call(xAxis)
              .style("font-size", "14px")
            //添加网格-----------
            // gridlines in x axis function
            function make_x_gridlines() {
              return d3.axisBottom(xScale)
                .ticks(3)
            }

            // gridlines in y axis function
            function make_y_gridlines() {
              return d3.axisLeft(yScale)
                .ticks(3)
            }

            // add the X gridlines
            svg.append("g")
              .attr("class", "grid")
              .attr("transform", "translate(0," + height + ")")
              .call(make_x_gridlines()
                .tickSize(-height)
                .tickFormat("")
              )

            // add the Y gridlines
            svg.append("g")
              .attr("class", "grid")
              .call(make_y_gridlines()
                .tickSize(-width)
                .tickFormat("")
              )
            //添加circle包裹层，有几种类型添加几个
            var cover = svg.append("g")

            //添加circle
            cover.selectAll("circle")
              .data(self.tableValue)
              .enter()
              .append("circle")
              .attr("cx", function(d) {
                return xScale(d['value'][arr[j] - 1])
              })
              .attr("cy", function(d) {
                return yScale(d['value'][arr[i] - 1])
              })
              .attr("r", function(d) {
                return self.radius
              })
              .attr("fill", function(d) {
                return colorRandom(self.nameSampleMap[d['name']]['condition'])
              })
              .style("opacity", self.opacity)
              .on('mouseover', (d, i) => {
                return tooltip.style('visibility', 'visible').text(d.name)
              })
              .on('mousemove', function (d, i) {
                return tooltip.style('top', (d3.event.pageY-10)+'px').style('left',(d3.event.pageX+10)+'px')
              })
              .on('mouseout', function (d, i) {
                return tooltip.style('visibility', 'hidden')
              })
          }
          //  x轴文字
          svgG.append("text")
      					.attr("x", (width / 2.5) + (i * width) + padding.left)
      					.attr("y", -15 + padding.top)
      					.attr("dy", "-0.3em")
      					.text(function(){
      						return "PC" + self.checkedPCA[i];
      					});
          svgG.append("text")
      					.attr("x", (width / 2.5) + (i * width) + padding.left)
      					.attr("y", -2 + padding.top)
      					.attr("dy", "-0.3em")
      					.text(function(){
      						return "(" + (self.percentVariance[self.checkedPCA[i] - 1] * 100).toFixed(0) + "%" + ")";
      					});
          //  y轴文字
          svgG.append("text")
      					.attr("x", -60 + padding.left)
      					.attr("y", height / 2 + (i * height) + padding.top)
                .attr("dy", "-0.3em")
                .style('text-anchor', 'start')
      					.text(function(){
                  return "PC" + self.checkedPCA[i];
      					});
          svgG.append("text")
      					.attr("x", -60 + padding.left)
      					.attr("y", height / 2 + 20 + (i * height) + padding.top)
                .attr("dy", "-0.3em")
                .style('text-anchor', 'start')
      					.text(function(){
                  return "(" + (self.percentVariance[self.checkedPCA[i] - 1] * 100).toFixed(0) + "%" + ")";
      					});
        }
      }

      //  去掉多余的 path class='domain'
      d3.selectAll(".xaxis .domain").remove();
      d3.selectAll(".yaxis .domain").remove();

      //  右侧颜色图例
      svgG.append("text")
        .attr("x", width1 - padding.right + 10)
        .attr("y", padding.top + 20)
        .attr("dy", "-0.3em")
        .text(function() {
          return "group";
        });
      for (let i = 0; i < self.conditionArr.length; i++) {
        svgG.append("rect")
          .attr("x", width1 - padding.right + 10) // rect 横坐标无需改动
          .attr("y", padding.top + 25 + 30 * i)
          .attr("width", 30)
          .attr("height", 30)
          .attr("fill", "white")
          .attr("stroke", "#999")
        svgG.append("circle")
          .attr("cx", width1 - padding.right + 10 + 15) // 圆心x坐标无需改动
          .attr("cy", padding.top + (25 + 30 * i) + 15)
          .attr("r", 8)
          .attr("fill", colorRandom(self.conditionArr[i]))
        svgG.append("text")
          .attr("x", width1 - padding.right + 10 + 40) // text x坐标无需改动
          .attr("y", padding.top + 50 + 30 * i)
          .attr("dy", "-0.3em")
          .text(self.conditionArr[i]);
      }
      d3.selectAll('.tick').selectAll("line").style("stroke", "#cccccc4d")
    },


  }
}
</script>

<style scoped="true">
.content {
  float: left;
  /* width: 60%; */
  width: calc(100% - 350px);
  padding: 0 20px;
  margin: 19px auto;
}

.el-checkbox+.el-checkbox {
  margin-left: 0 !important;
}
.margin-top-10 {
  margin-top: 10px;
}

</style>
<style media="screen">
/* .grid .tick line {
  stroke: #cccccc4d;
} */
</style>
