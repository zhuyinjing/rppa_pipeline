<template>
      <div class="">
        <imgMenuShowComp></imgMenuShowComp>

        <el-breadcrumb separator="/" style="margin:5px 0 50px 0">
          <el-breadcrumb-item :to="{ path: 'report' }">{{$t('report.project')}} {{$store.state.projectName}}</el-breadcrumb-item>
          <el-breadcrumb-item>{{$t('leftMenu.kegg')}}</el-breadcrumb-item>
        </el-breadcrumb>

        <h2>{{$t('leftMenu.kegg')}}</h2>

        <h4>Choose Databases:</h4>
        <el-row>
          <el-col :span="8">
              <el-row>
                <el-col :span="24">
                  <h4>Pathway</h4>
                </el-col>
                <el-col :span="24">
                  <el-radio v-model="database" label="KEGG PATHWAY">KEGG PATHWAY</el-radio>
                </el-col>
                <el-col :span="24">
                  <el-radio v-model="database" label="Reactome">Reactome</el-radio>
                </el-col>
                <el-col :span="24">
                  <el-radio v-model="database" label="BioCyc">BioCyc</el-radio>
                </el-col>
                <el-col :span="24">
                  <el-radio v-model="database" label="PANTHER">PANTHER</el-radio>
                </el-col>
              </el-row>
          </el-col>
          <el-col :span="8">
            <el-col :span="24">
              <h4>Disease</h4>
            </el-col>
              <el-row>
                <el-col :span="24">
                  <el-radio v-model="database" label="OMIM">OMIM</el-radio>
                </el-col>
                <el-col :span="24">
                  <el-radio v-model="database" label="KEGG DISEASE">KEGG DISEASE</el-radio>
                </el-col>
                <el-col :span="24">
                  <el-radio v-model="database" label="NHGRI GWAS Catalog">NHGRI GWAS Catalog</el-radio>
                </el-col>
              </el-row>
          </el-col>
          <el-col :span="8">
              <el-row>
                <el-col :span="24">
                  <h4>GO</h4>
                </el-col>
                <el-col :span="24">
                  <el-radio v-model="database" label="Gene Ontology">Gene Ontology</el-radio>
                </el-col>
                <el-col :span="24">
                  <el-radio v-model="database" label="Gene Ontology Slim">Gene Ontology Slim</el-radio>
                </el-col>
              </el-row>
          </el-col>
        </el-row>
        <br>

        <!-- <el-button type="primary" size="small" icon="el-icon-document" @click="$store.commit('d3savePDF', 'KEGG 富集分析气泡图')">生成 PDF</el-button> -->
        <el-button type="primary" size="small" icon="el-icon-picture" @click="$store.commit('d3saveSVG', ['kegg_bubble'])">{{$t('button.svg')}}</el-button>
        <i class="el-icon-question cursor-pointer" style="font-size:16px" @click="$store.state.svgDescribeShow = true"></i>

        <div id="d3container"></div>

        <a :href="href" target="_blank" ref="aTag"></a>

      </div>
</template>

<script>
import imgMenuShowComp from './imgMenuShowComp.vue'
import * as d3 from 'd3'

export default {
  data () {
    return {
      xData: [],
      yData: [],
      tableValue: [],
      href: '',
      database: 'KEGG PATHWAY',
    }
  },
  components: {
    imgMenuShowComp
  },
  mounted () {
    this.getData()
  },
  watch: {
    'database': 'getData'
  },
  methods: {
    getData () {
      this.axios.get('/server/enrich_bubble_diagram?username=' + this.$store.state.username + '&p=' + this.$store.state.projectId + '&database=' + this.database + '&count=' + 10).then((res) => {
        this.xData = res.data.x
        this.yData = res.data.y
        this.tableValue = res.data.coordinateList
        this.initD3()
      })
    },
    initD3 () {
      let hassvg = d3.selectAll('svg')
      if (hassvg) {
        d3.selectAll('svg').remove()
      }
          let self = this
          var initWidth = 1000
          var initHeight = this.yData.length > 15 ? this.yData.length * 40 : this.yData.length * 60

          var padding = {
            left: 450,
            top: 40,
            right: 200,
            bottom: 100
          }

          var width = initWidth - padding.left - padding.bottom
          var height = initHeight - padding.top - padding.bottom

          var svgG = d3.select("#d3container")
            .append("svg")
            .attr("class", "d3bubblesvg")
            .attr("width", initWidth + padding.right)
            .attr("height", initHeight + padding.bottom)
          var svg = svgG.append('g').attr('transform','translate('+padding.left+','+padding.top+')')

          //添加y轴坐标轴

          //y轴比例尺
          let ydata = self.yData
          let yScale = d3.scaleBand().rangeRound([height, 0]).padding(1)
            .domain(ydata.map(function(d) {
              return d.y;
            }))

          //定义y轴
          let yAxis = d3.axisLeft(yScale)

          //添加y轴
          let yaxisg = svg.append("g")
            .attr("class", "yaxis")
            .attr("transform", "translate(" + 0 + "," + 0 + ")")
            .call(yAxis)
            .style("font-size", "14px")
            .style("cursor", "pointer")
            svg.selectAll(".tick text")
            .on("mouseover", function (d, i) {
                d3.select(this)
                .style("fill","#409EFF")
            })
            .on("mouseout", function (d, i) {
                d3.select(this)
                .style("fill","")
            })
            .on("click", function (d, i) {
              self.href = "https://www.genome.jp/dbget-bin/www_bget?"+ self.yData[i]["id"]
              setTimeout(() => {
                self.$refs.aTag.click()
              }, 100)
            })

          //添加x轴坐标轴

          //x轴比例尺
          let xData = self.xData

          let xScale = d3.scaleBand().rangeRound([0, width]).padding(1)
            .domain(xData.map(function(d) {
              return d.replace(".", " vs ");
            }))

          //定义x轴
          let xAxis = d3.axisBottom(xScale)

          //添加x轴
          let xaxisg = svg.append("g")
            .attr("class", "xaxis")
            .attr("transform", "translate(" + "0 ," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .style("font-size", "14px")
            .style("text-anchor", "start")
            .attr("transform", "rotate(45 -10 10)");

          d3.selectAll('.domain').remove() // 删除多余的两端刻度线

          //添加网格-----------
          // gridlines in x axis function
          function make_x_gridlines() {
            return d3.axisBottom(xScale)
              .ticks(4)
          }

          // gridlines in y axis function
          function make_y_gridlines() {
            return d3.axisLeft(yScale)
              .ticks(4)
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

        var colorLinear = d3.scaleLinear()
            .domain([d3.min(self.tableValue , function (d) {
            				  return Number(d.p_value); } ),
                    d3.max(self.tableValue , function (d) {
                    	 return Number(d.p_value); })])
            .range(["red", "blue"]);

        var radiusLinear = d3.scaleLinear()
            .domain([d3.min(self.tableValue , function (d) {
            				  return d.gene_ratio; } ),
                    d3.max(self.tableValue , function (d) {
                    	 return d.gene_ratio; })])
            .range([8, 16]);

          //添加circle包裹层，有几种类型添加几个
          var cover = svg.append("g")

          //添加circle
          cover.selectAll("circle")
            .data(self.tableValue)
            .enter()
            .append("circle")
            .attr("cx", function(d) {
              return xScale(d.x.replace(".", " vs "))
            })
            .attr("cy", function(d) {
              return yScale(d.y)
            })
            .attr("r", function(d) {
              return radiusLinear(d.gene_ratio)
            })
            .attr("fill", function(d) {
              return colorLinear(Number(d.p_value))
            })
            .on("mouseover", function(d) {
              let self = this;
              d3.select(this)
                // .attr("r", d3.select(this).attr("r") * 1.6)
              showtext.attr("x", function() {
                  return xScale(d.x.replace(".", " vs "))
                })
                .attr("y", function() {
                  return yScale(d.y) - d3.select(self).attr("r") * 1.6 - 5
                })
                .text(function() {
                  return ("pvalue:" + Number(d.p_value).toFixed(3))+ ' , ' + "gene_ratio:" +(d.gene_ratio).toFixed(3)
                })
                .attr("text-anchor", "middle")
            })
            .on("mouseout", function() {
              d3.select(this)
                // .attr("r", d3.select(this).attr("r") / 1.6)
              showtext.text("")
            })

          //添加左侧提示部分包裹层
          let detail = cover.append("g")
          let showtext = svg.append("text")
            .text("")
            .attr("font-size", '14px')

        // 右侧颜色图例
        var defs = svg.append("defs");

  		var linearGradient = defs.append("linearGradient")
  								.attr("id","linearColor")
  								.attr("x1","0%")
  								.attr("y1","100%")
  								.attr("x2","0%")
  								.attr("y2","0%");

  		var stop1 = linearGradient.append("stop")
  						.attr("offset","0%")
  						.style("stop-color","red");

  		var stop2 = linearGradient.append("stop")
  						.attr("offset","100%")
  						.style("stop-color","blue");

  		//添加一个矩形，并应用线性渐变
  		var colorRect = svg.append("rect")
  					.attr("x", width + 50)
  					.attr("y", height / 1.5)
  					.attr("width", 40)
  					.attr("height", 100)
  					.style("fill","url(#" + linearGradient.attr("id") + ")")

  		//添加文字
  		var maxValueText = svg.append("text")
  					.attr("class","valueText")
  					.attr("x", width + 100)
  					.attr("y", height / 1.5 + 15)
  					.attr("dy", "-0.3em")
  					.text(function(){
  						return d3.max(self.tableValue , function (d) {
              				  return Number(d.p_value).toFixed(3)})
  					});

  		var minValueText = svg.append("text")
  					.attr("class","valueText")
  					.attr("x", width + 100)
  					.attr("y", height / 1.5 +  100)
  					.attr("dy", "-0.3em")
  					.text(function(){
  						return d3.min(self.tableValue , function (d) {
              				  return Number(d.p_value).toFixed(3)});
  					});

      var maxValueText = svg.append("text")
  					.attr("class","valueText")
  					.attr("x", width + 50)
  					.attr("y", height / 1.5 - 10)
  					.attr("dy", "-0.3em")
  					.text(function(){
  						return "pvalue";
  					});
      // gene ratio
      var circleRect = svg.append("rect")
  					.attr("x", width + 50)
  					.attr("y", 130)
  					.attr("width", 40)
  					.attr("height", 40)
            .attr("fill", "white")
            .attr("stroke", "#999")
     svg.append("circle")
            .attr("cx", width + 50 + 20)
            .attr("cy", 130 + 20)
            .attr("r", radiusLinear(d3.min(self.tableValue , function (d) {
            				  return Number(d.gene_ratio) })))
            .attr("fill", "black")
      svg.append("text")
  					.attr("class","valueText")
  					.attr("x", width + 50)
  					.attr("y", 120)
  					.attr("dy", "-0.3em")
  					.text(function(){
  						return "GeneRatio";
  					});
        svg.append("text")
    					.attr("class","valueText")
    					.attr("x", width + 100)
    					.attr("y", 160)
    					.attr("dy", "-0.3em")
    					.text(function(){
    						return (d3.min(self.tableValue , function (d) {
                				  return Number(d.gene_ratio) })).toFixed(3);
    					});
        var circleRect = svg.append("rect")
    					.attr("x", width + 50)
    					.attr("y", 170)
    					.attr("width", 40)
    					.attr("height", 40)
              .attr("fill", "white")
              .attr("stroke", "#999")
       svg.append("circle")
              .attr("cx", width + 50 + 20)
              .attr("cy", 170 + 20)
              .attr("r", radiusLinear(d3.max(self.tableValue , function (d) {
              				  return Number(d.gene_ratio) })))
              .attr("fill", "black")
      svg.append("text")
  					.attr("class","valueText")
  					.attr("x", width + 100)
  					.attr("y", 200)
  					.attr("dy", "-0.3em")
  					.text(function(){
  						return (d3.max(self.tableValue , function (d) {
              				  return Number(d.gene_ratio) })).toFixed(3);
  					});
    // 网格线颜色
    d3.selectAll('.tick').selectAll("line").style("stroke", "#cccccc4d")
    },
  }
}
</script>

<style scoped="true">
.content {
  float:left;
  /* width: 60%; */
  width: calc(100% - 350px);
  padding: 0 20px;
  margin: 19px auto;
}
h4 {
  margin: 0px;
}
</style>
