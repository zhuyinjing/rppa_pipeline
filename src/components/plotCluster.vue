<template>
      <div class="">
        <imgMenuShowComp></imgMenuShowComp>

        <el-breadcrumb separator="/" style="margin:5px 0 50px 0">
          <el-breadcrumb-item :to="{ path: 'report' }">{{$t('report.project')}} {{$store.state.projectName}}</el-breadcrumb-item>
          <el-breadcrumb-item>{{$t('cluster.title')}}</el-breadcrumb-item>
        </el-breadcrumb>

        <h2>{{$t('cluster.title')}}</h2>

        <p>{{$t('cluster.introduction')}}</p>
        <p>{{$t('mappingqc.references')}}：Daniel Müllner, fastcluster: Fast Hierarchical, Agglomerative Clustering Routines for R and Python, Journal of Statistical Software 53 (2013), no. 9, 1–18 [<a href="http://www.jstatsoft.org/v53/i09/" target="_blank">{{$t('mappingqc.link')}}</a>]</p>
        <p>{{$t('cluster.describe')}}</p>

        <!-- <el-button type="primary" size="small" icon="el-icon-document" @click="$store.commit('d3savePDF', '样本聚类')">生成 PDF</el-button> -->
        <el-button type="primary" size="small" icon="el-icon-picture" @click="$store.commit('d3saveSVG',[ 'cluster'])">{{$t('button.svg')}}</el-button>
        <i class="el-icon-question cursor-pointer" style="font-size:16px" @click="$store.state.svgDescribeShow = true"></i>

        <br><br>

        <label id="show-length">
          <input type="checkbox"> Show branch length
        </label>
        <div id="d3container"></div>

      </div>
</template>

<script>
import * as d3 from 'd3'
import imgMenuShowComp from './imgMenuShowComp.vue'

export default {
  data () {
    return {
      tableValue: [],
      clusterData: null,
      yData: [],
    }
  },
  components: {
    imgMenuShowComp
  },
  mounted () {
    this.axios.get('/server/hclust?username=' + this.$store.state.username + '&p=' + this.$store.state.projectId).then((res) => {
      if (res.data.message_type === 'success') {
        this.clusterData = res.data.hclust
        for (let i = 0;i < res.data.hclust.distMatrix.length;i++) {
          for(let j = 0;j < res.data.hclust.distMatrix[i].length;j++) {
            this.tableValue.push(res.data.hclust.distMatrix[i][j])
          }
        }
        this.initD3()
      }
    })
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
      preOrder(this.clusterData.rootNode)
      function preOrder(node){
         if(node.branchset === null){
            self.yData.push(node.id)   // 每一行的值
         } else {
           preOrder(node.branchset[0]);
           preOrder(node.branchset[1]);
         }
       }
      var outerRadius = 1350 / 2,
      innerRadius = outerRadius - 170;

      var color = d3.scaleOrdinal()
          .domain([0,d3.max(self.tableValue)])
          .range(d3.schemeCategory10);

      var cluster = d3.cluster()
          .size([700, innerRadius])
          .separation(function(a, b) { return 1; });

      var svg = d3.select("#d3container").append("svg")
          .attr("width", outerRadius * 2)
          .attr("height", 900)

      // cluster margin top left
      var chart = svg.append("g")
          .attr("transform", "translate(" + 0 + "," + 50 + ")");

        var root = d3.hierarchy(self.clusterData.rootNode, function(d) {
          return d.branchset;
        });
        cluster(root);

        var input = d3.select("#show-length input").on("change", changed),
            timeout = setTimeout(function() { input.property("checked", true).each(changed); }, 100);

        setRadius(root, root.data.length = 0, innerRadius / maxLength(root));
        var linkExtension = chart.append("g")
          .attr("class", "link-extensions")
          .selectAll("path")
          .data(root.links().filter(function(d) {
              return !d.target.children;
            }))
          .enter().append("path")
          .each(function(d) {
            d.target.linkExtensionNode = this;
          })
          .attr("d", linkExtensionConstant)
          .style("stroke","black")

        var link = chart.append("g")
            .attr("class", "links")
            .selectAll("path")
            .data(root.links())
            .enter().append("path")
            .each(function(d) {
              d.target.linkNode = this;
            })
            .attr("d", linkConstant)
            .style("fill","none")
            .style("stroke","black")

        var rightArea = chart.append("g")
          .attr("class", "labels")
          .attr("transform", function(d, i) { return "translate(" + (innerRadius + 5) + ","+ (i + 0.5) +")"; })

        var linear = d3.scaleLinear()
            .domain([0, d3.max(self.tableValue)])
            .range([(d3.rgb(6,113,160)), (d3.rgb(120,248,232))]);

        let gridSize = 700 / self.yData.length
        let gridHeight = 700 / self.yData.length

        rightArea.selectAll(".nameLabel")
            .data(self.yData)
            .enter()
            .append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return parseInt(i) * gridHeight + 5; })
            .style("text-anchor", "start")
            .style("font-size", "12px")
            .style("font-family", "Consolas, Monaco, monospace")
            .attr("transform", "translate("+ (gridSize * (self.yData.length) + 10) +"," + ""+ (gridHeight / 2) +")")
            .attr('class', 'ySum')

        rightArea.selectAll(".score")
            .data(self.tableValue)
            .enter()
            .append("rect")
            .attr("x", function(d, i){
              return (i % self.yData.length) * gridSize;
            })
            .attr("y", function(d, i){ return parseInt(i / self.yData.length) * gridHeight;})
            .attr("width", gridSize)
            .attr("height", gridHeight)
            .style("fill", function(d) { return linear(d) })
            .on('mouseover', function (d, i) {
              return tooltip.style('visibility', 'visible').text(d)
            })
            .on('mousemove', function (d, i) {
              return tooltip.style('top', (d3.event.pageY-10)+'px').style('left',(d3.event.pageX+10)+'px')
            })
            .on('mouseout', function (d, i) {
              return tooltip.style('visibility', 'hidden')
            })
            // .append("title").text(function(d) { return d; });

        function changed() {
          clearTimeout(timeout);
          var t = d3.transition().duration(500);
          linkExtension.transition(t).attr("d", this.checked ? linkExtensionVariable : linkExtensionConstant);
          link.transition(t).attr("d", this.checked ? linkVariable : linkConstant);
        }

      // Compute the maximum cumulative length of any node in the tree.
      function maxLength(d) {
        return d.data.length + (d.children ? d3.max(d.children, maxLength) : 0);
      }

      // Set the radius of each node by recursively summing and scaling the distance from the root.
      function setRadius(d, y0, k) {
        d.radius = (y0 += d.data.length) * k;
        if (d.children) d.children.forEach(function(d) { setRadius(d, y0, k); });
      }

      function linkVariable(d) {
        return linkStep(d.source.x, d.source.radius, d.target.x, d.target.radius);
        // return linkStep(d.target.radius, d.target.x, d.source.radius, d.source.x); // x 轴聚类
      }

      function linkConstant(d) {
        return linkStep(d.source.x, d.source.y, d.target.x, d.target.y);
      }

      function linkExtensionVariable(d) {
        return linkStep(d.target.x, d.target.radius, d.target.x, innerRadius);
        // return linkStep(innerRadius, d.target.x, d.target.radius, d.target.x); // x 轴聚类
      }

      function linkExtensionConstant(d) {
        return linkStep(d.target.x, d.target.y, d.target.x, innerRadius);
      }

      // Like d3.svg.diagonal.radial, but with square corners.
      function linkStep(startAngle, startRadius, endAngle, endRadius) {
        return "M" + startRadius  + "," + startAngle
            // + (endAngle === startAngle ? "" : "L" + startRadius  + "," + endAngle)
            + "L" + startRadius + "," + endAngle
            + "L" + endRadius + "," + endAngle
      }
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
</style>
<style media="screen">
.node circle {
fill: #999;
}

.node text {
font: 10px sans-serif;
}

.node--internal circle {
fill: #555;
}

.node--internal text {
text-shadow: 0 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff;
}

.link {
fill: none;
stroke: #555;
stroke-opacity: 0.4;
stroke-width: 1.5px;
}

.links {
  fill: none;
  stroke: #000;
}

.link-extensions {
  fill: none;
  stroke: #000;
  stroke-opacity: .25;
}

.labels {
  font: 10px sans-serif;
}

.link--active {
  stroke: #000 !important;
  stroke-width: 1.5px;
}

.link-extension--active {
  stroke-opacity: .6;
}

.label--active {
  font-weight: bold;
}
</style>
