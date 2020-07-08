<template>
<div class="">

    <imgMenuShowComp></imgMenuShowComp>

    <degComp></degComp>

    <p>蛋白相互作用数据来自 <a href="https://string-db.org">stringdb</a> 数据库，图中的基因取自差异表达基因列表的前 50 个 (差异表达基因排序的顺序权重为 log2FoldChange 绝对值 > 平均表达量 > FDR > pValue ), 鼠标指到相应的基因节点上，该基因以及跟其直接有相互作用的基因会变为红色。</p>

    <!-- <el-button type="primary" size="small" icon="el-icon-document" @click="$store.commit('d3savePDF', '蛋白互作网络图')">生成 PDF</el-button> -->
    <el-button type="primary" size="small" icon="el-icon-picture" @click="$store.commit('d3saveSVG', ['force_' + $store.state._case + '_' + $store.state._control])">{{$t('button.svg')}}</el-button>
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

    <div id="d3container"></div>

  </div>

</template>

<script>
import degComp from './degComp.vue'
import imgMenuShowComp from './imgMenuShowComp.vue'
import * as d3 from 'd3'

export default {
  data() {
    return {
      originNodes: null,
      singleNodes: null,
      graph: {},
      singleGeneShow: false,
    }
  },
  components: {
    degComp,
    imgMenuShowComp
  },
  mounted() {
    this.getValue()
  },
  methods: {
    getValue () {
      this.axios.get('/server/deg_effect_of_force_diagram?username=' + this.$store.state.username + '&p=' + this.$store.state.projectId + '&caseSample=' + this.$store.state._case + '&controlSample=' + this.$store.state._control).then((res) => {
        if (res.data.message_type === 'success') {
          this.originNodes = res.data.message.relevanceGeneNodes
          this.singleNodes = res.data.message.discreteGeneNodes
          this.graph = {
            "nodes": res.data.message.relevanceGeneNodes,
            "links": res.data.message.scoreMatrixList
          }
          this.initD3()
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
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
      let containerWidth = document.getElementById("d3container").clientWidth * 0.8

      var g,
        width = containerWidth,
        height = 960,
        node, link,
        brushMode, brush, zoomLayer, brushLayer; //intercation canvas: Brush + zoom

      let svg = d3.select('#d3container')
        .append('svg')
        .attr('id', 'svg')
        .attr('width', width)
        .attr('height', height)

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
      // brush = d3.brush()
      //   .extent([
      //     [0, 0],
      //     [width, height]
      //   ])
      //   .on("start", function(d) {
      //     node.each(function(d) {
      //       d.previouslyPicked = brushMode && d.picked;
      //     });
      //   })
      //   .on("brush", function() {
      //     if (!d3.event.selection) return;
      //     var extent = d3.event.selection,
      //       zoomProp = d3.zoomTransform(zoomLayer.node());
      //     node.classed("picked", function(d) {
      //       return d.picked = d.previouslyPicked ^ ((extent[0][0] - zoomProp.x) / zoomProp.k <= d.x && d.x < (extent[1][0] - zoomProp.x) / zoomProp.k && (extent[0][1] - zoomProp.y) / zoomProp.k <= d.y && d.y < (extent[1][1] - zoomProp.y) /
      //         zoomProp.k);
      //     });
      //   })
      //   .on("end", function() {
      //     if (!d3.event.selection) return;
      //     d3.select(this).call(d3.event.target.move, null);
      //   })

      // var zoom = d3.zoom()
      //   .scaleExtent([1 / 2, 4])
      //   .on("zoom", zoomed);
      //
      // brushLayer = svg.append("g")
      //   .attr("id", "brush-layer")
      //   .attr("width", width)
      //   .attr("height", height)
      //   .style("fill", "none")
      //   .datum(function() {
      //     return {
      //       picked: false,
      //       previouslyPicked: false
      //     };
      //   })
      //   .call(brush)
      //   .on("click", function(d) {
      //     node.classed("picked", false);
      //     node.each(function(d) {
      //       d.picked = d.previouslyPicked = false;
      //     })
      //   });

      var zoom_handler = d3.zoom().scaleExtent([1 / 2, 4])
      .on("zoom", zoomed);

      zoom_handler(svg);

      // zoomLayer = svg.append("rect")
      //       .attr("id", "zoom-layer")
      //       .attr("width", width)
      //       .attr("height", height)
      //       .style("fill", "none")
      //       .attr("pointer-events", "all")
      //       .call(zoom)

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
.content {
  float: left;
  /* width: 60%; */
  width: calc(100% - 350px);
  padding: 0 20px;
  margin: 19px auto;
}
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
