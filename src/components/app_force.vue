<template>
  <el-container style="height:calc(100% - 62px);margin-top:2px">
    <el-aside v-show="$store.state.appmenuShow" style="width:300px;height:100%;border-right:1px solid #e6e6e6">
      <appLeftMenu></appLeftMenu>
    </el-aside>
    <el-main>
      <appImgMenuShowComp></appImgMenuShowComp>

      <!-- <el-button type="primary" size="small" icon="el-icon-document" @click="$store.commit('d3savePDF', '可变剪切事件百分比统计')">生成 PDF</el-button> -->
      <el-button type="primary" size="small" icon="el-icon-picture" @click="$store.commit('d3saveSVG', ['可变剪切事件百分比统计'])">{{$t('button.svg')}}</el-button>
      <i class="el-icon-question cursor-pointer" style="font-size:16px" @click="$store.state.svgDescribeShow = true"></i>

      <br><br>
      {{$t('d3.scatter_gene_show')}}：
      <el-switch
        v-model="singleGeneShow"
        active-color="#409EFF"
        :active-text="$t('d3.show')"
        :inactive-text="$t('d3.hide')"
        @change="singleGeneShowChange()"
      >
      </el-switch>

      <div id="d3container" style="height:960px"></div>

      <appTableComp></appTableComp>

    </el-main>
  </el-container>

</template>

<script>
import appLeftMenu from './app_leftMenu.vue'
import appImgMenuShowComp from './appImgMenuShowComp.vue'
import appTableComp from './app_tableComp.vue'
import * as d3 from 'd3'

export default {
  data () {
    return {
      originNodes: null,
      singleNodes: null,
      graph: {},
      singleGeneShow: false,
    }
  },
  components: {
    appLeftMenu,
    appImgMenuShowComp,
    appTableComp,
  },
  mounted () {
    this.originNodes = this.$store.state.ppiJson.relevanceGeneNodes
    this.singleNodes = this.$store.state.ppiJson.discreteGeneNodes
    this.graph = {
      "nodes": this.$store.state.ppiJson.relevanceGeneNodes,
      "links": this.$store.state.ppiJson.scoreMatrixList
    }
    this.initD3()
  },
  methods: {
    singleGeneShowChange () {
      let hassvg = d3.selectAll('g')
      if (hassvg) {
        d3.selectAll('svg').remove()
      }
      if (this.singleGeneShow === true) {
        this.graph.nodes = this.graph.nodes.concat(this.singleNodes)
      } else {
        this.graph.nodes = this.originNodes
      }
      setTimeout(() => {
        this.initD3()
      }, 50)
    },
    initD3() {
      // 屏幕宽度
      let containerWidth = document.getElementById("d3container").clientWidth

      let svg = d3.select('#d3container')
        .append('svg')
        .attr('id', 'svg')
        .attr('width', 1200)
        .attr('height', 960)
      var g,
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        node, link,
        brushMode, brush, zoomLayer, brushLayer; //intercation canvas: Brush + zoom

      var color = d3.scaleOrdinal(d3.schemeCategory20);

      if (this.singleGeneShow === false) {
        var simulation = d3.forceSimulation()
          .force("link", d3.forceLink().id(function(d) {
            return d.id;
          }))
          .force("charge", d3.forceManyBody().strength(-300).distanceMax(300)) // strength 默认 -30
          .force("center", d3.forceCenter(width / 2, height / 2));
      } else {
        var simulation = d3.forceSimulation()
          .force("link", d3.forceLink().id(function(d) {
            return d.id;
          }))
          .force("charge", d3.forceManyBody().strength(-200).distanceMax(100)) // strength 默认 -30
          .force("center", d3.forceCenter(width / 2, height / 2));
      }

      // add shift event
      d3.select("body")
        .on("keydown", keydown)
        .on("keyup", keyup)

      // brushable network: http://jsfiddle.net/pkerpedjiev/29majy5c/2/
      brush = d3.brush()
        .extent([
          [0, 0],
          [width, height]
        ])
        .on("start", function(d) {
          node.each(function(d) {
            d.previouslyPicked = brushMode && d.picked;
          });
        })
        .on("brush", function() {
          if (!d3.event.selection) return;
          var extent = d3.event.selection,
            zoomProp = d3.zoomTransform(zoomLayer.node());
          node.classed("picked", function(d) {
            return d.picked = d.previouslyPicked ^ ((extent[0][0] - zoomProp.x) / zoomProp.k <= d.x && d.x < (extent[1][0] - zoomProp.x) / zoomProp.k && (extent[0][1] - zoomProp.y) / zoomProp.k <= d.y && d.y < (extent[1][1] - zoomProp.y) /
              zoomProp.k);
          });
        })
        .on("end", function() {
          if (!d3.event.selection) return;
          d3.select(this).call(d3.event.target.move, null);
        })

      var zoom = d3.zoom()
        .scaleExtent([1 / 2, 4])
        .on("zoom", zoomed);

      brushLayer = svg.append("g")
        .attr("id", "brush-layer")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .datum(function() {
          return {
            picked: false,
            previouslyPicked: false
          };
        })
        .call(brush)
        .on("click", function(d) {
          node.classed("picked", false);
          node.each(function(d) {
            d.picked = d.previouslyPicked = false;
          })
        });

      zoomLayer = svg.append("rect")
        .attr("id", "zoom-layer")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .attr("pointer-events", "all")
        .call(zoom)

      g = svg.append("g");

      let graph = this.graph

      var lineScale = d3.scaleLinear()
                      .range([1, 5])
                      .domain(d3.extent(graph.links.map((d,i) => {return d.value})))

      link = g.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("stroke-width", function(d) {
          return lineScale(d.value);
        })

      node = g.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter()
        .append("circle")
        .attr("r", (d,i) => {return 20})
        .attr("fill", "#e49433")
        .on("click", function() {
          var thisNode = d3.select(this);
          if (brushMode) {
            node.each(function(d) {
              d.previouslyPicked = brushMode && d.picked;
            });
            node.classed("picked", function(d) {
              return d.picked = d.previouslyPicked ^ (thisNode.datum().id === d.id);
            });
          }
        })
        .on("mouseover", function(d, i, o) {
          let currentd = d.id
          var connectedNodeIds = graph
            .links
            .filter(x => x.source.id == d.id || x.target.id == d.id)
            .map(x => x.source.id == d.id ? x.target.id : x.source.id)

          d3.select(".nodes")
            .selectAll("circle")
            .attr("fill", function(c) {
              if (connectedNodeIds.indexOf(c.id) > -1 || c.id == d.id) return "red";
              else return '#e49433'
            })

          d3.select(".links")
            .selectAll("line")
            .style("stroke", function(d,c) {
              if ((d.target.id === currentd && connectedNodeIds.indexOf(d.source.id) > -1) || (d.source.id === currentd && connectedNodeIds.indexOf(d.target.id) > -1)) {
                return 'red'
              } else {
                return '#999'
              }
            })
        })
        .on("mouseout", function(d) {
          d3.select(".nodes")
            .selectAll("circle")
            .attr("fill", "#e49433");
          d3.select(".links")
            .selectAll("line")
            .style("stroke", '#999')
        })
        .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));
      //  text
      let texts = g.selectAll(".texts")
          .attr("class", "texts")
          .data(graph.nodes)
          .enter()
          .append("text")
          .text((d,i) => {return d.id})
          .style("font-size","8px")
          .attr("dy", ".35em")
          .attr("text-anchor", "middle")
          .on("mouseover", function(d, i, o) {
            let currentd = d.id
            var connectedNodeIds = graph
              .links
              .filter(x => x.source.id == d.id || x.target.id == d.id)
              .map(x => x.source.id == d.id ? x.target.id : x.source.id);

            d3.select(".nodes")
              .selectAll("circle")
              .attr("fill", function(c) {
                if (connectedNodeIds.indexOf(c.id) > -1 || c.id == d.id) return "red";
                else return '#e49433'
              });
            d3.select(".links")
              .selectAll("line")
              .style("stroke", function(d,c) {
                if ((d.target.id === currentd && connectedNodeIds.indexOf(d.source.id) > -1) || (d.source.id === currentd && connectedNodeIds.indexOf(d.target.id) > -1)) {
                  return 'red'
                } else {
                  return '#999'
                }
              });
          })
          .on("mouseout", function(d) {
            d3.select(".nodes")
              .selectAll("circle")
              .attr("fill", "#e49433");
            d3.select(".links")
              .selectAll("line")
              .style("stroke", '#999')
          })
          .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

      simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

      simulation.force("link")
        .links(graph.links)

      function ticked() {
        link
          .attr("x1", function(d) {
            return d.source.x;
          })
          .attr("y1", function(d) {
            return d.source.y;
          })
          .attr("x2", function(d) {
            return d.target.x;
          })
          .attr("y2", function(d) {
            return d.target.y;
          });

        node
          .attr("cx", function(d) {
            return d.x;
          })
          .attr("cy", function(d) {
            return d.y;
          });

        texts
            .attr("transform",(d)=>{
              return "translate("+d.x+","+d.y+")"
            })
      }

      function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      function keydown() {
        var brushMode = d3.event.metaKey;
        var cleanNodes = d3.event.keyCode === 68;
        if (brushMode) zoomLayer.attr("pointer-events", "none");
        if (cleanNodes) cleanSelected();
      }

      function keyup() {
        var brushMode = d3.event.metaKey;
        if (!brushMode) zoomLayer.attr("pointer-events", "all");
      }

      function zoomed() {
        g.attr("transform", d3.event.transform);
      }

      function cleanSelected() {
        node.classed("picked", false);
        node.each(function(d) {
          d.picked = d.previouslyPicked = false;
        })
      }
      d3.selectAll(".links").selectAll("line").style("stroke", "#999").style("stroke-opacity", 0.6)
    },
  }
}
</script>

<style scoped="true">
</style>
<style media="screen">
#zoom-layer:active {
  cursor: move;
}

.nodes circle {
  stroke: #fff;
  stroke-width: 1.5px;
}

.nodes circle.picked {
  stroke: #202020;
  stroke-width: 3px;
  stroke-opacity: .6;
}
</style>
