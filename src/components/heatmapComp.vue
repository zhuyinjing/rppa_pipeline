<template>
  <div class="">
    <!-- <el-button type="primary" size="small" icon="el-icon-document" @click="$store.commit('d3savePDF', '基因热图')">生成 PDF</el-button> -->

    <div id="d3container" style="display:flex">
      <div class="" style="float:left;width:900px;">
        <div id="microarrays_dendrogram" class=""></div>
      </div>
      <div class="" style="float:left;width:800px;" class="margin-top-200">
        <div id="boxplot"></div>
      </div>
    </div>
    <div style="clear:both"></div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import Highcharts from 'highcharts/highstock';

export default {
  data () {
    return {
      height: 5,
    }
  },
  components: {
  },
  watch: {
    '$route': 'routerChange'
  },
  created () {
    this.$store.state.heatmapJson.heatmap_json_string = JSON.parse(this.$store.state.heatmapJson.heatmap_json_string)
  },
  mounted () {
    this.initchart()
  },
  methods: {
    routerChange () {
      this.$store.state.heatmapJson.heatmap_json_string = JSON.parse(this.$store.state.heatmapJson.heatmap_json_string)
      this.initchart()
    },
    initchart () {
      let stages = this.$store.state.heatmapJson.stages
      let genes = this.$store.state.heatmapJson.genes
      let json = this.$store.state.heatmapJson.heatmap_json_string
      window.boxplot = new Highcharts.Chart({
                  chart: {
                      renderTo: "boxplot",
                      type: 'boxplot',
                      height: 400,
                      width: stages.length > 10 ? stages.length * 30 : 400,
                  },
                  credits: {
                    enabled: false //不显示LOGO
                  },
                  title: {
                      text: "当前基因表达量"
                  },

                  legend: {
                      enabled: false
                  },

                  exporting:{
                      enabled: false
                  },

                  xAxis: {
                      categories: stages,
                      title: {
                          text: 'Sample Types'
                      }
                  },

                  yAxis: {
                      title: {
                          text: 'TPMs'
                      }
                  },

                  plotOptions: {
                      boxplot: {
                          color: "#000000",
                              fillColor: '#F0F0E0',
                              lineWidth: 2,
                              medianColor: '#0C5DA5',
                              medianWidth: 3,
                              stemColor: '#A63400',
                              stemDashStyle: 'dot',
                              stemWidth: 1,
                              whiskerColor: '#3D9200',
                              whiskerLength: '20%',
                              whiskerWidth: 3
                      }
                  },

                  series: [{
                      name: 'TPMs',
                      data: [
                      ]
                  }
                  ]
              });

              var target_element = $("#microarrays_dendrogram");
              var offset = target_element.offset();
              var min_y = offset.top + 100;
              var x_pos = offset.left;
              var microarrays_element = $("#microarrays");
              //microarrays_element.css({"left": x_pos + target_element.width()-50, "top": min_y, "z-index": 100});
              window.dendrogram = new InCHlib({ //instantiate InCHlib
                      target: "microarrays_dendrogram", //ID of a target HTML element
                      metadata: true, //turn on the metadata
                      column_metadata: true, //turn on the column metadata
                      min_row_height:5,
                      max_column_width:50,
                      max_height: 5, //set maximum height of visualization in pixels
                      heatmap_colors: "GrBkRd", //set color scale for clustered data
                      metadata_colors: "RdLrBu", //set color scale for metadata
                      column_dendrogram: true,
                      max_percentile: 90,
                      // middle_percentile: 50,
                      min_percentile: 10,
                      independent_columns: false,
                      heatmap_part_width: 0.7,  // 每一个小格的宽度
                      width: 900,
                      // min_row_width: json.column_metadata.features[0].length * 5,
              });
              var current = null;
              var current_objects = [];// dendrogram.data.nodes[0].objects;
              var current_columns = [];
              dendrogram.add_color_scale("GrBkRd",
                				{"start": {"r":35, "g": 139, "b": 69},
                				"middle": {"r": 0, "g": 0, "b": 0},
                				"end": {"r": 215, "g": 25, "b": 28}
                				})

              dendrogram.events.row_onclick = function(object_ids, evt){
                  current = object_ids[0];
                  current_objects = object_ids;
                  draw_boxplot(current_objects, current_columns, evt.pageY);
                  dendrogram.highlight_rows(current_objects);
                  dendrogram.unhighlight_cluster();
              };

              dendrogram.events.dendrogram_node_onclick = function(object_ids, node_id, evt){
                  current_objects = object_ids;
                  draw_boxplot(current_objects, current_columns, evt.pageY);
                  var i;
                  for(i = 0; i<object_ids.length; i++){
                      if(object_ids[i] == current){
                          return;
                      }
                  }
                  dendrogram.highlight_rows([]);
              };

              dendrogram.events.column_dendrogram_node_highlight = function(column_ids, node_id){
                  draw_boxplot(current_objects, column_ids, 0);
              };

              dendrogram.events.column_dendrogram_node_unhighlight = function(){
                  current_columns = [];
                  draw_boxplot(current_objects, current_columns, 0);
              };

              dendrogram.events.on_zoom = function(node_id){
                  microarrays_element.css({"top": min_y});
              };

              dendrogram.events.empty_space_onclick = function(){
                  dendrogram.highlight_rows([]);
                  //microarrays_element.hide();
              };

              dendrogram.read_data(json); //read input json file
              dendrogram.draw(); //draw cluster heatmap
              draw_boxplot(current_objects, current_columns, min_y);
              dendrogram.highlight_rows(current_objects);

              function draw_boxplot(object_ids, column_ids, y){
                  current_columns = column_ids;
                  var header = dendrogram.header;
                  if(current_columns.length === 0){
                      for(j = 0; j<header.length; j++){
                          current_columns.push(j);
                      }
                  }

                  microarrays_element.hide();
                  var class2values = {};
                  for (var m = 0; m < stages.length; ++ m) {
                      class2values[stages[m]] = [];
                  }
                  var max_y = min_y + target_element.height() - dendrogram.footer_height;
                  var i, j, values, row_id, key;
                  //var header = dendrogram.header;
                  var column_metadata = dendrogram.column_metadata.features[0];
                  var boxplot_height = 400;

                  y = (y + boxplot_height > max_y)?max_y - boxplot_height:y-100;
                  y = (y < min_y)?min_y: y;

                  microarrays_element.css({"top": y});

                  for (i = 0; i < object_ids.length; i++) {
                      row_id = dendrogram.objects2leaves[object_ids[i]];
                      values = dendrogram.data.nodes[row_id].features;
                      boxplot.setTitle({text: dendrogram.data.nodes[row_id].objects[0]});
                      for (j = 0; j < current_columns.length; j++) {
                          key = current_columns[j];
                          class2values[column_metadata[key]].push(values[key]);
                      }
                  }

                  if (object_ids.length > 1) {
                      boxplot.setTitle({text: "多个基因"});
                  }

                  while(boxplot.series.length > 0){
                      boxplot.series[0].remove(true);
                  }

                  var seriesData = [];
                  for(var idx = 0; idx < stages.length; ++ idx) {
                      if(class2values[stages[idx]] && class2values[stages[idx]].length) {
                          seriesData.push(get_boxplot_parameters(class2values[stages[idx]]));
                      } else {
                          seriesData.push([0,0,0,0,0]);
                      }
                  }
                  boxplot.addSeries({data:seriesData, name: "Average Signal"}, true);
                  microarrays_element.show();
              }

              function get_boxplot_parameters(array){
                  var min, max, median, lower_q, upper_q;
                  array.sort(function(a,b){return a - b;});
                  var array_length = array.length;
                  min = array[0];
                  max = array[array_length-1];
                  var median_index = dendrogram._hack_round(array_length/2);
                  var quarter = dendrogram._hack_round(array_length/4);
                  median = array[median_index];
                  lower_q = array[median_index-quarter];
                  upper_q = array[median_index+quarter];
                  if (array.length < 4) {
                      upper_q = max;
                  }
                  var parameters = [min, lower_q, median, upper_q, max];
                  return parameters;
              }
    },

  }
}
</script>

<style scoped="true">
.margin-top-200 {
  margin-top: 200px;
}
</style>
<style media="screen">
.color_scales {
  z-index: 9 !important;
}
</style>
