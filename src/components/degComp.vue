<template>
  <div class="" style="min-width:1100px;">
    <h2 class="text-align-center"> {{$store.state._case}} vs {{$store.state._control}} </h2>
    <el-card class="text-align-center">
      {{$t('deg.filter_condition')}}：P-Value <= {{$store.state.degFilterArgs.pvalue}}, FDR <= {{$store.state.degFilterArgs.FDR}},  | Log2(FoldChange) | >= {{$store.state.degFilterArgs.log2FoldChange}} &nbsp;
      {{$t('deg.filter_total')}}：{{$store.state.degGeneSum}}
    </el-card> <br>
    <div class="margin-bottom-20">
      <el-button type="info" :class="{'activebtn': $route.path === '/report_deg'}" @click="report_deg()">{{$t('button.deg')}}</el-button>
      <el-button type="info" :class="{'activebtn': $route.path === '/report_volcano_plot'}" @click="report_volcano_plot()">{{$t('button.volcano')}}</el-button>
      <el-button type="info" :class="{'activebtn': $route.path === '/report_ma_plot'}" @click="report_ma_plot()">MA plot</el-button>
      <el-button type="info" :class="{'activebtn': $route.path === '/heatmap'}" @click="heatmap()">{{$t('button.heatmap')}}</el-button>
      <el-button type="info" :class="{'activebtn': $route.path === '/heatmapsvg'}" @click="heatmapsvg()">{{$t('button.heatmap')}}svg</el-button>
      <el-button type="info" :class="{'activebtn': $route.path === '/ppi_chord_plot'}" @click="ppi_chord_plot()">{{$t('button.ppi')}}</el-button>
      <el-button type="info" :class="{'activebtn': $route.path === '/enrichment_analysis'}" @click="enrichment_analysis()">{{$t('button.enrichment')}}</el-button>
      <el-button type="info" :class="{'activebtn': $route.path === '/forceGraph'}" @click="forceGraph()">{{$t('button.force')}}</el-button>
    </div>
    <br>
  </div>
</template>

<script>

export default {
  data () {
    return {
    }
  },
  components: {
  },
  mounted () {
  },
  methods: {
    report_deg () {
      this.$router.push({'name': 'report_deg', query: {'_case': this.$store.state._case, '_control': this.$store.state._control}})
    },
    report_volcano_plot () {
      this.$router.push({'name': 'report_volcano_plot'})
    },
    report_ma_plot () {
      this.$router.push({'name': 'report_ma_plot'})
    },
    heatmap () {
      let formData = new FormData()
      formData.append('username', this.$store.state.username)
      formData.append('p', this.$store.state.projectId)
      formData.append('caseSample', this.$store.state._case)
      formData.append('controlSample', this.$store.state._control)
      this.axios.post('/server/heatmap.app.for_report', formData).then((res) => {
        this.$store.commit('setheatmapJson', res.data.message)
        this.$router.push({'name': 'heatmap'})
      })
    },
    heatmapsvg () {
      let formData = new FormData()
      formData.append('username', this.$store.state.username)
      formData.append('p', this.$store.state.projectId)
      formData.append('caseSample', this.$store.state._case)
      formData.append('controlSample', this.$store.state._control)
      this.axios.post('/server/heatmap.app.for_report', formData).then((res) => {
        this.$store.commit('setheatmapJson', res.data.message)
        this.$router.push({'name': 'heatmapsvg'})
      })
    },
    ppi_chord_plot () {
      let formData = new FormData()
      formData.append('username', this.$store.state.username)
      formData.append('p', this.$store.state.projectId)
      formData.append('caseSample', this.$store.state._case)
      formData.append('controlSample', this.$store.state._control)
      this.axios.post('/server/ppi_chord_plot.app.for_report', formData).then((res) => {
        if (res.data.message_type === 'success') {
          this.$store.commit('setppiJson', res.data.message)
          this.$router.push({'name': 'ppi_chord_plot'})
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    enrichment_analysis () {
      this.$router.push({'name': 'enrichment_analysis'})
    },
    forceGraph () {
      this.$router.push({'name': 'forceGraph'})
    },

  }
}
</script>

<style scoped="true">
.cursor-pointer{
  cursor: pointer;
}
.text-align-center {
  text-align: center;
}
.activebtn {
  background:#f56c6c;
  border-color:#f56c6c;
}
</style>
