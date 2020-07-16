<template>
  <div>
    <el-menu v-show="isCollapse" style="padding: 0 10px;" :default-active="$store.state.leftMenuIndex" class="el-menu-vertical-demo">
        <el-menu-item index="0-0" @click="menuItemClick('0-0', 'report')">{{$t('leftMenu.report_home')}}</el-menu-item>
        <el-menu-item-group v-if="$store.state.projectType !== 'DEG'">
          <span slot="" class="title-style">{{$t('leftMenu.qc')}}</span>
          <el-menu-item index="1-0" @click="menuItemClick('1-0', 'report_fastqc')">抗体质检</el-menu-item>
          <el-menu-item index="1-1" @click="menuItemClick('1-1', 'report_mappingqc')">样本质检</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
          <span class="title-style">蛋白表达量</span>
          <el-menu-item index="3-0" v-if="$store.state.projectType !== 'DEG'" @click="menuItemClick('3-0', 'report_expr_matrix')">{{$t('leftMenu.expr_matrix')}}（TPM）</el-menu-item>
          <el-menu-item index="3-1" @click="menuItemClick('3-1', 'report_gene_count')">{{$t('leftMenu.expr_matrix')}}（COUNT）</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
          <span class="title-style">{{$t('leftMenu.cluster_all')}}</span>
          <el-menu-item index="4-0" @click="menuItemClick('4-0', 'plotCluster')">{{$t('leftMenu.cluster')}}</el-menu-item>
          <el-menu-item index="4-1" @click="menuItemClick('4-1', 'plotPCA')">{{$t('leftMenu.pca')}}</el-menu-item>
          <!-- <a :href="'/projects/'+ $store.state.projectId +'/results/050.DESeq2/plotMA_deseq.pdf'" target="_blank"><el-menu-item index="4-2" >MA 图</el-menu-item></a> -->
          <a :href="'/projects/'+ this.$store.state.projectId +'/results/050.DESeq2/ALL.pairs.pdf'" target="_blank"><el-menu-item index="4-3">{{$t('leftMenu.paris')}}</el-menu-item></a>
        </el-menu-item-group>
        <el-menu-item-group>
          <span class="title-style">{{$t('leftMenu.deg')}}</span>
          <el-menu-item :index="'5-' + index + '-1'" @click="report_deg(item['_case'], item['_control'], index)" v-for="(item, index) in $store.state.info.experimentDesign.experiments" :key="index">{{item['_case']}} vs {{item['_control']}}</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
          <span class="title-style">{{$t('leftMenu.deg_chart')}}</span>
          <el-menu-item index="5-1" @click="menuItemClick('5-1', 'keggbubble')">{{$t('leftMenu.kegg')}}</el-menu-item>
          <el-menu-item index="5-2" @click="menuItemClick('5-2', 'venn')">维恩图</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group v-if="$store.state.projectType === 'Time_Series'">
          <span class="title-style">时序性差异表达分析</span>
          <el-menu-item index="7-1" @click="menuItemClick('7-1', 'time_series_table')">时序性差异表达分析</el-menu-item>
        </el-menu-item-group>
    </el-menu>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isCollapse: true,
    }
  },
  components: {
  },
  mounted () {
    switch (this.$route.path) {
      case '/report/':
        this.$store.commit('setleftMenuIndex', '0-0')
        break;
    }
  },
  methods: {
    menuItemClick (index, url) {
      this.$store.commit('setleftMenuIndex', index)
      this.$router.push({'name': url})
    },
    report_deg (_case, _control, index) {
      this.$store.commit('set_case', _case)
      this.$store.commit('set_control', _control)
      this.$store.commit('setleftMenuIndex', '5-' + index + '-1')
      this.$router.push({'name': 'report_deg', query: {'_case': _case, '_control': _control}})
    },
    report_volcano_plot (_case, _control, index) {
      this.$store.commit('setleftMenuIndex', '5-' + index)
      this.$store.commit('set_case', _case)
      this.$store.commit('set_control', _control)
      this.$router.push({'name': 'report_volcano_plot', query: {'_case': _case, '_control': _control}})
    },
    heatmap (_case, _control, index) {
      this.$store.commit('setleftMenuIndex', '5-' + index + '-2')
      this.$store.commit('set_case', _case)
      this.$store.commit('set_control', _control)
      let formData = new FormData()
      formData.append('username', this.$store.state.username)
      formData.append('p', this.$store.state.projectId)
      formData.append('caseSample', _case)
      formData.append('controlSample', _control)
      this.axios.post('/server/heatmap.app.for_report', formData).then((res) => {
        this.$store.commit('setheatmapJson', res.data.message)
        this.$router.push({'name': 'heatmap', query: {'_case': _case, '_control': _control}})
      })
    },
    ppi (_case, _control, index) {
      this.$store.commit('setleftMenuIndex', '5-' + index + '-3')
      this.$store.commit('set_case', _case)
      this.$store.commit('set_control', _control)
      let formData = new FormData()
      formData.append('username', this.$store.state.username)
      formData.append('p', this.$store.state.projectId)
      formData.append('caseSample', _case)
      formData.append('controlSample', _control)
      this.axios.post('/server/ppi_chord_plot.app.for_report', formData).then((res) => {
        if (res.data.message_type === 'warn') {
          this.$message.error(res.data.message)
        } else {
          this.$store.commit('setppiJson', res.data.message)
          this.$router.push({'name': 'ppi_chord_plot', query: {'_case': _case, '_control': _control}})
        }
      })
    },
    enrichment_analysis (_case, _control, index) {
      this.$store.commit('setleftMenuIndex', '5-' + index + '-4')
      this.$store.commit('set_case', _case)
      this.$store.commit('set_control', _control)
      this.$router.push({'name': 'enrichment_analysis', query: {'_case': _case, '_control': _control}})
    },
  }
}
</script>

<style scoped="true">
li {
  list-style: none;
}
a:hover, a:visited, a:link, a:active {
  text-decoration: none;
  out-line: none;
}
.title-style {
  font-size: 16px;
  font-weight: bold;
}
.el-menu-item, .el-submenu__title {
  height: 40px !important;
  line-height: 40px !important;
}
.el-menu {
  border: none !important;
}
</style>
