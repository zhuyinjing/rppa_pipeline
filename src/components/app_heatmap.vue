<template>
  <el-container style="height:calc(100% - 62px);margin-top:2px">
    <el-aside v-show="$store.state.appmenuShow" style="width:300px;height:100%;border-right:1px solid #e6e6e6">
      <appLeftMenu></appLeftMenu>
    </el-aside>
    <el-main>
      <appImgMenuShowComp></appImgMenuShowComp>

        <div>
          <h2>{{$t('button.heatmap')}}</h2>

          <p>{{$t('heatmap.introduction')}}。</p>
          <p>{{$t('mappingqc.references')}}:Škuta, C., Bartůněk, P., Svozil, D. InCHlib – interactive cluster heatmap for web applications. Journal of Cheminformatics 2014, 6 (44), DOI: 10.1186/s13321-014-0044-4 [<a href="http://www.jcheminf.com/content/6/1/44" target="_blank">{{$t('mappingqc.link')}}</a>]]</p>

          <heatmapComp></heatmapComp>

          <div class="" v-if="textarea">
            <p>WARN：{{$t('warn.no_expr')}}</p>
            <el-input
              type="textarea"
              :rows="3"
              placeholder=""
              v-model="textarea">
            </el-input>
          </div>

          <!-- <appTableComp></appTableComp> -->

        </div>
    </el-main>
  </el-container>

</template>

<script>
import appLeftMenu from './app_leftMenu.vue'
import appImgMenuShowComp from './appImgMenuShowComp.vue'
import heatmapComp from './heatmapComp.vue'
// import appTableComp from './app_tableComp.vue'

import Highcharts from 'highcharts/highstock';
export default {
  data () {
    return {
      textarea: null
    }
  },
  components: {
    appLeftMenu,
    appImgMenuShowComp,
    heatmapComp,
    // appTableComp
  },
  created () {
    if (this.$store.state.heatmapJson.invalidGeneList) {
      this.textarea = this.$store.state.heatmapJson.invalidGeneList.join("\n")
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style scoped="true">
</style>
