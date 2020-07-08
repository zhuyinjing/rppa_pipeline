<template>
  <div class="">
    <div class="">
      <imgMenuShowComp></imgMenuShowComp>

      <el-breadcrumb separator="/" style="margin:5px 0 50px 0">
        <el-breadcrumb-item :to="{ path: 'report' }">{{$t('report.project')}} {{$store.state.projectName}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('leftMenu.mappingqc')}}</el-breadcrumb-item>
      </el-breadcrumb>

      <h2>{{$t('mappingqc.title')}}</h2>

      <p>{{$t('mappingqc.introduction')}}</p>
      <p>{{$t('mappingqc.references')}}：</p>

      <p>Kim D, Langmead B and Salzberg SL. HISAT: a fast spliced aligner with low memory requirements. Nature Methods 2015 </p>
      <p>[<a href="https://www.nature.com/articles/nmeth.3317">{{$t('mappingqc.link')}}</a>]</p>

      <p>{{$t('mappingqc.describe')}}</p>

      <!-- <el-button type="primary" size="small" icon="el-icon-document" @click="$store.commit('d3savePDF', '比对结果统计')">生成 PDF</el-button> -->
      <el-button type="primary" size="small" icon="el-icon-picture" @click="$store.commit('d3saveSVG', ['mapping'])">{{$t('button.svg')}}</el-button>
      <i class="el-icon-question cursor-pointer" style="font-size:16px" @click="$store.state.svgDescribeShow = true"></i>

      <div class="">
        <div id="d3container">
          <svg id="chart"></svg>
        </div>

        <!-- <div class="" style="float:left;width:200px;height:200px;overflow-y:auto;overflow-x:hidden">
          <svg id="legend"></svg>
        </div> -->
      </div>

      <a :href="fileUrl" download ref="downloadA"></a>

      <el-button size="mini" type="primary" icon="el-icon-download" plain @click="exportTable()">导出</el-button> <br><br>

      <table class="gridtable">
        <thead>
          <tr>
            <th>{{$t('mappingqc.sample')}}</th>
            <th>{{$t('mappingqc.total_base')}}</th>
            <th>{{$t('mappingqc.ribose_proportion')}}</th>
            <th>{{$t('mappingqc.coding_proportion')}}</th>
            <th>{{$t('mappingqc.UTR_proportion')}}</th>
            <th>{{$t('mappingqc.intron_proportion')}}</th>
            <th>{{$t('mappingqc.gene_proportion')}}</th>
          </tr>
        </thead>
        <tr v-for="(item, index) in tableData">
          <td :class="{'bgcolor': index % 2 === 0 ? false: true}">{{item[0]}}</td>
          <td :class="{'bgcolor': index % 2 === 0 ? false: true}">{{numFormat(item[1])}}</td>
          <td :class="{'bgcolor': index % 2 === 0 ? false: true}">{{(Number(item[16])* 100).toFixed(1)}}%</td>
          <td :class="{'bgcolor': index % 2 === 0 ? false: true}">{{(Number(item[17])* 100).toFixed(1)}}%</td>
          <td :class="{'bgcolor': index % 2 === 0 ? false: true}">{{(Number(item[18])* 100).toFixed(1)}}%</td>
          <td :class="{'bgcolor': index % 2 === 0 ? false: true}">{{(Number(item[19])* 100).toFixed(1)}}%</td>
          <td :class="{'bgcolor': index % 2 === 0 ? false: true}">{{(Number(item[20])* 100).toFixed(1)}}%</td>
        </tr>
      </table>

    </div>
    <div class="clear"></div>

</div>
</template>

<script>
import imgMenuShowComp from './imgMenuShowComp.vue'
import * as d3 from 'd3'

export default {
  data() {
    return {
      traces: [],
      tableData: [],
      barChartArr: [],
      xData: ['总碱基数', '核糖体碱基数', '编码区碱基数', 'UTR碱基数', '内含子碱基数', '基因间区碱基数'],
      fileUrl: '',
    }
  },
  components: {
    imgMenuShowComp
  },
  mounted() {
    this.initTable()
  },
  methods: {
    initD3 () {
      let self = this
      let tooltip = d3.select('body')
      	.append('div')
      	.style('position', 'absolute')
        .style('z-index', '10')
        .style('visibility', 'hidden')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
      	.text('')
      let containerWidth = document.getElementById("d3container").clientWidth
      var svg = d3.select("#chart")
          .attr("width", containerWidth)
          .attr("height", 560)
      var margin = {
          top: 20,
          right: 50,
          bottom: 30,
          left: 40
        },
        width = containerWidth - 80 - margin.left - margin.right,
        height = 560 - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")

      var x0 = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.05)

      var x1 = d3.scaleBand()
        .padding(0.05);

      var y = d3.scaleLinear()
        .rangeRound([height, 0]);

      var z = d3.scaleOrdinal(d3.schemeCategory10);

      var keys = this.tableData.map((d) => {
        return d[0]
      })

      x0.domain(this.xData);
      x1.domain(keys).rangeRound([0, x0.bandwidth()]);
      y.domain([0, d3.max(this.barChartArr, function(d) {
        return d3.max(keys, function(key) {
          return d[key];
        });
      })]).nice();

      // x 轴的 group
      let xgroups = g.append("g")
        .selectAll("g")
        .data(this.barChartArr)
        .enter().append("g")
        .attr("transform", function(d) {
          return "translate(" + x0(d.name) + ",0)";
        })
        .selectAll("rect")
        .data(function(d) {
          return keys.map(function(key) {
            return {
              key: key,
              value: d[key]
            };
          });
        })
        // 每个 x 轴的 条形图 group
        .enter().append("rect")
        .attr("x", function(d) {
          // let node = this.parentNode
          // let data = d3.select(node).data()
          // console.log(x0(data[0].name));
          return x1(d.key);
        })
        .attr("y", function(d) {
          return y(d.value);
        })
        .attr("width", x1.bandwidth())
        .attr("height", function(d) {
          return height - y(d.value);
        })
        .attr("fill", function(d) {
          return z(self.$store.state.info.experimentDesign.nameSampleMap[d.key]['condition']);
        })
        .on('mouseover', function (d, i) {
          return tooltip.style('visibility', 'visible').text(d.key + ' : ' + self.numFormat(d.value))
        })
        .on('mousemove', function (d, i) {
          return tooltip.style('top', (d3.event.pageY-10)+'px').style('left',(d3.event.pageX+10)+'px')
        })
        .on('mouseout', function (d, i) {
          return tooltip.style('visibility', 'hidden')
        })


      g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x0));
      g.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(null, "s"))
        .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")

      // var legend = g.append("g")
      //   .attr("font-family", "sans-serif")
      //   .attr("font-size", 10)
      //   .attr("text-anchor", "end")
      //   .selectAll("g")
      //   .data(keys.slice().reverse())
      //   .enter().append("g")
      //   .attr("transform", function(d, i) {
      //     return "translate(0," + i * 20 + ")";
      //   });
      //
      // legend.append("rect")
      //   .attr("x", width - 19)
      //   .attr("width", 19)
      //   .attr("height", 19)
      //   .attr("fill", z);
      //
      // legend.append("text")
      //   .attr("x", width - 24)
      //   .attr("y", 9.5)
      //   .attr("dy", "0.32em")
      //   .text(function(d) {
      //     return d;
      //   });
      let conditionArr = []
      for (let k in this.$store.state.info.experimentDesign.conditionNumMap) {
        conditionArr.push(k)
      }
      var legend = g.append("g")
        .attr("font-size", 10)
        .selectAll("g")
        .data(conditionArr)
        .enter().append("g")
        .attr("transform", function(d, i) {
          return "translate(0," + i * 16 + ")";
        });

      legend.append("rect")
        .attr("x", width)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", z);

      legend.append("text")
        .attr("x", width + 16)
        .attr("y", 8)
        .attr("dy", "0.32em")
        .text(function(d) {
          return d;
        });


//     test test test  testtet
        // var legend = d3.select("#legend")
        //   .attr("width", 200)
        //   .attr("height", 900)
        //   .append("g")
        //   .attr("font-family", "sans-serif")
        //   .attr("font-size", 10)
        //   .attr("text-anchor", "start")
        //   .selectAll("g")
        //   .data(keys.slice().reverse())
        //   .enter().append("g")
        //   .attr("transform", function(d, i) {
        //     return "translate(0," + i * 20 + ")";
        //   });
        //
        // legend.append("rect")
        //   .attr("x", 0)
        //   // .attr("y", 0)
        //   .attr("width", 19)
        //   .attr("height", 19)
        //   .attr("fill", z);
        //
        // legend.append("text")
        //   .attr("x", 20)
        //   .attr("y", 9.5)
        //   .attr("dy", "0.32em")
        //   .text(function(d) {
        //     return d;
        //   });
    },
    numFormat(num) {
      num = num.toString().split("."); // 分隔小数点
      var arr = num[0].split("").reverse(); // 转换成字符数组并且倒序排列
      var res = [];
      for (var i = 0, len = arr.length; i < len; i++) {
        if (i % 3 === 0 && i !== 0) {
          res.push(","); // 添加分隔符
        }
        res.push(arr[i]);
      }
      res.reverse(); // 再次倒序成为正确的顺序
      if (num[1]) { // 如果有小数的话添加小数部分
        res = res.join("").concat("." + num[1]);
      } else {
        res = res.join("");
      }
      return res;
    },
    initTable() {
      this.axios.get('/server/mappingqc?username=' + this.$store.state.username + '&p=' + this.$store.state.projectId).then((res) => {
        this.tableData = res.data.slice(1)
        // 格式化 d3 group bar chart 需要的数据
        let index = [1, 3, 4, 5, 6, 7]
        for (let i = 0; i < this.xData.length; i++) {
          let temp = {
            name: this.xData[i]
          }
          for (let j = 0; j < this.tableData.length; j++) {
            for (let k = 0; k < this.tableData.length; k++) {
              let indextemp = index[i]
              temp[this.tableData[k][0]] = this.tableData[k][indextemp] - 0
            }
          }
          this.barChartArr.push(temp)
        }
        this.initD3()
      })
    },
    exportTable () {
      this.axios.get("/server/export_mappingqc?p=" + this.$store.state.projectId + "&username=" + this.$store.state.username).then(res => {
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
  float: left;
  /* width: 60%; */
  width: calc(100% - 350px);
  padding: 0 20px;
  margin: 19px auto;
}

table.gridtable {
  width: 100%;
  text-align: center;
  font-size: 14px;
  color: #333333;
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
  padding: 8px;
  border-style: solid;
  border-color: #ebeef5;
  background-color: #ffffff;
}

.bgcolor {
  background-color: #f9f9f9 !important;
}

.clear {
  clear: both;
}
</style>
