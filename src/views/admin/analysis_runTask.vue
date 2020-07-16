<template>
  <div class="content">
    <el-tooltip class="item cursor-pointer" effect="dark" :content="$t('button.back')" placement="right">
      <i class="el-icon-back" @click="backProjectList"></i>
    </el-tooltip>
    <h3>{{$t('project_list.project_name')}}：{{this.$store.state.projectName}}</h3>
    
        <el-steps :active="2" align-center>
            <el-step v-for="item in steps" :title="item" description=""></el-step>
        </el-steps>

  </div>
</template>

<script>
import * as d3 from 'd3'

export default {
  data () {
    return {
      steps: ['SuperCurve_process', 'CF calculation', 'Project split', '分项目normalization及写入Excel']
    }
  },
  components: {
  },
  mounted () {
  },
  destroyed () {
    window.clearInterval(this.timer)
    window.clearInterval(this.timerLog)
  },
  methods: {
    getLog () {
      this.axios.get("/projects/"+ this.$store.state.projectId +"/colorseq.log").then((res) => {
        this.logContent = res.data
      })
    },
    selectTask () {
      let formData = new FormData()
      formData.append('username', this.$store.state.username)
      formData.append('p', this.$store.state.projectId)

      this.axios.post('/server/task_status', formData).then((res) => {
        if (res.data.message.currentStepSn > -1) {
          this.runBtnShow = false
          this.refreshBtnShow = true
          this.timerLog = setInterval(() => {
            this.getLog()
          }, 5000)
        } else { // 任务未开始
          this.runBtnShow = true
          this.refreshBtnShow = false
        }
        this.type = res.data.project.type
        this.currentStepSn = res.data.message.currentStepSn
        this.status = res.data.message.status
        if (this.status === 300) {
          this.getLog()
          window.clearInterval(this.timerLog)
          this.runBtnShow = false
          this.refreshBtnShow = false
          this.reportBtnShow = true
        }
        this.runTask()
      })
    },
    runTask () {
      let hassvg = d3.selectAll('svg')
      if (hassvg) {
        d3.selectAll('svg').remove()
      }

      var processMessage = {};
      processMessage.currentStepSn = this.currentStepSn
      processMessage.status = this.status

      var FINISHED = 300;

      var pipeline = []

      if (this.type === 'DEG') {
        pipeline = ["DEG"]
      } else {
        pipeline = ["FastQC", "Mapping", "Assembling", "Quantification", "DEG"]
      }

      var arrows = new Array(pipeline.length - 1).fill(1);

      var padding = {
          top: 30,
          right: 10,
          bottom: 30,
          left: 0
      };

      var rectStep = 30;
      var rectWidth = 200;
      var rectHeight = 30;

      let svg = d3.select('#container')
        .append('svg')


      var svgHeight = padding.top + rectHeight + padding.bottom;
      var svgWidth = padding.left + rectWidth * pipeline.length + rectStep * (pipeline.length - 1) + padding.right;
      svg.attr("height", svgHeight).attr("width", svgWidth);

      var defs = svg.append("defs");

      var arrowMarker = defs.append("marker")
          .attr("id", "arrow")
          .attr("markerUnits", "strokeWidth")
          .attr("markerWidth", "12")
          .attr("markerHeight", "12")
          .attr("viewBox", "0 0 12 12")
          .attr("refX", "6")
          .attr("refY", "6")
          .attr("orient", "auto");

      var arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2";

      arrowMarker.append("path")
          .attr("d", arrow_path)
          .attr("fill", "gray");

          var rect = svg.selectAll("rect")
          .data(pipeline)
          .enter()
          .append("rect")
          .attr("fill", function (d, i) { // i 01234
              if (i < processMessage.currentStepSn) {
                  return "green";
              } else if (i == processMessage.currentStepSn) {
                  return "orange";
              } else {
                  return "white";
              }
          })
          .attr("stroke", function (d, i) {
              if (i < processMessage.currentStepSn) {
                  return "green";
              } else if (i == processMessage.currentStepSn) {
                  return "orange";
              } else {
                  return "gray";
              }
          })
          .attr("x", function (d, i) {
              return padding.left + i * (rectStep + rectWidth);
          })
          .attr("y", function (d, i) {
              return padding.top;
          })
          .attr("width", rectWidth)
          .attr("height", rectHeight)
          .attr("class", function (d, i) {
              return d;
          });

      var text = svg.selectAll("text")
          .data(pipeline)
          .enter()
          .append("text")
          .attr("fill", "black")
          .attr("font-size", "14px")
          .attr("font-weight", "bold")
          .attr("text-anchor", "middle")
          .attr("x", function (d, i) {
              return padding.left + i * (rectStep + rectWidth);
          })
          .attr("y", function (d, i) {
              return padding.top;
          })
          .attr("dx", rectWidth / 2)
          .attr("dy", "1.5em")
          .text(function (d, i) {
              return d;
          });

      var sizeExpand = 3;

      var line = svg.selectAll("line")
          .data(arrows)
          .enter()
          .append("line")
          .attr("x1", function (d, i) {
              return padding.left + rectWidth * (i + 1) + rectStep * i + sizeExpand;
          })
          .attr("y1", padding.top + rectHeight / 2)
          .attr("x2", function (d, i) {
              return padding.left + rectWidth * (i + 1) + rectStep * i + rectStep - 12;
          })
          .attr("y2", padding.top + rectHeight / 2)
          .attr("stroke", "gray")
          .attr("stroke-width", 2)
          .attr("marker-end", "url(#arrow)");

      if (processMessage.status !== FINISHED && processMessage.currentStepSn >= 0) {

          var prevOpacity = 1;
          var prevRectWidth = rectWidth;
          var prevRectHeight = rectHeight;
          var prevY = padding.top;

          var anchorX = svg.select("." + pipeline[processMessage.currentStepSn]).attr("x");
          var prevX = anchorX;

          var durationTime = 1000;

          function twinkle() {

              svg.selectAll("." + pipeline[processMessage.currentStepSn])
                  .transition()
                  .duration(durationTime)
                  .attr("width", function (d, i) {
                      prevRectWidth == rectWidth ? prevRectWidth = rectWidth + sizeExpand * 2 : prevRectWidth = rectWidth;
                      return prevRectWidth;
                  })
                  .attr("height", function (d, i) {
                      prevRectHeight == rectHeight ? prevRectHeight = rectHeight + sizeExpand * 2 : prevRectHeight = rectHeight;
                      return prevRectHeight;
                  })
                  .attr("y", function (d, i) {
                      prevY == padding.top ? prevY = padding.top - sizeExpand : prevY = padding.top;
                      return prevY;
                  })
                  .attr("x", function (d, i) {
                      prevX == anchorX ? prevX = anchorX - sizeExpand : prevX = anchorX;
                      return prevX;
                  })
                  .attr("opacity", function (d, i) {
                      prevOpacity == 1 ? prevOpacity = 0.5 : prevOpacity = 1;
                      return prevOpacity;
                  });

          };

          setInterval(twinkle, durationTime);
      }
    },
    startTask () {
      let formData = new FormData()
      formData.append('username', this.$store.state.username)
      formData.append('p', this.$store.state.projectId)

      this.axios.post('/server/task_run', formData).then((res) => {
        if (res.data.message_type === 'success') {
          this.runBtnShow = false
          this.refreshBtnShow = true
          this.currentStepSn = res.data.message.currentStepSn
          this.status = res.data.message.status
          this.runTask()
          this.timerLog = setInterval(() => {
            this.getLog()
          },5000)
        } else {
          this.$message.error('请求错误!')
        }
      }).catch((e) => {
        this.$message.error('请求错误!')
      })
    },
    report () {
      this.loading = this.$loading({
        lock: true,
        text: '报告正在生成中...请稍等...可能需要等待5~10分钟左右的时间...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.axios.get('/server/create_report?username=' + this.$store.state.username + '&p=' + this.$store.state.projectId).then((res) => {
        if (res.data.message_type === 'success') {
          this.getReportStatus()
        } else {
          this.loading.close()
          this.$message.error('请求错误!')
        }
      }).catch((e) => {
        this.loading.close()
        this.$message.error('请求错误!')
      })
    },
    getReportStatus () {
      this.timer = setInterval(() => {
        this.axios.get('/server/create_report_status?username=' + this.$store.state.username + '&p=' + this.$store.state.projectId).then((res) => {
          if (res.data.ProcessStatus === 300) {
            this.loading.close()
            this.$message.success('报告已生成!')
            window.clearInterval(this.timer)
          }
        })
      }, 15000)
    },
    reportOffline () {
      this.$confirm('生成离线报告可能要等待5~8分钟左右的时间, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loadingOffline = this.$loading({
          lock: true,
          text: '离线报告正在生成中...请稍等...可能需要等待5~8分钟左右的时间...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.axios.get('/admin/create_offline_report?p=' + this.$store.state.projectId + '&weburl=' + document.location.origin).then(res => {
          if(res.data.message_type === 'success') {
            this.$message.success('生成离线报告已完成！')
            this.loadingOffline.close()
          } else {
            this.$message.success('生成离线报告失败！')
            this.loadingOffline.close()
          }
        }).catch(() => {
          this.$message.error('请求出错！')
          this.loadingOffline.close()
        })
      }).catch(() => {});
    },
    reset_project () {
      this.$confirm('该操作将重新分析, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let formData = new FormData()
        formData.append('p', this.$store.state.projectId)

        this.axios.post('/server/reset_project', formData).then((res) => {
          if (res.data.message_type === 'success') {
            this.$message.success('重置成功！')
            this.selectTask()
          } else {
            this.$message.error('重置失败！')
          }
        }).catch((e) => {
          this.$message.error('请求错误!')
        })
      })
    },
    result () {

    },
    backProjectList () {
      this.$router.push({'name': 'project_list'})
    }
  }
}
</script>

<style scoped="true">
.content {
  width: 60%;
  margin: 19px auto;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.right {
  float: right;
  width: 60px;
}
.item {
  margin: 4px;
}
</style>
