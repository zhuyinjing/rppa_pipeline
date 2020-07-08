<template>
  <div class="">
      <imgMenuShowComp></imgMenuShowComp>

      <degComp></degComp>

      <div class="">
        <div class="container">
          <p>{{$t('heatmap.introduction')}}。</p>
          <p>{{$t('mappingqc.references')}}: Škuta, C., Bartůněk, P., Svozil, D. InCHlib – interactive cluster heatmap for web applications. Journal of Cheminformatics 2014, 6 (44), DOI: 10.1186/s13321-014-0044-4 [<a href="http://www.jcheminf.com/content/6/1/44" target="_blank">{{$t('mappingqc.link')}}</a>]]</p>

          <heatmapComp></heatmapComp>

        </div>
      </div>
    </div>

</template>

<script>
import degComp from './degComp.vue'
import imgMenuShowComp from './imgMenuShowComp.vue'
import heatmapComp from './heatmapComp.vue'

export default {
  data () {
    return {
    }
  },
  components: {
    degComp,
    imgMenuShowComp,
    heatmapComp
  },
  mounted () {
  },
  methods: {
  }
}
</script>
<style scoped="true">
</style>
