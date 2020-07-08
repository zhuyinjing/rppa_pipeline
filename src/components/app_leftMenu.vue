<template>
  <div class="container">
    <el-button type="info" class="btnStyle" :class="{'activebtn': $route.path === '/app_heatmap_input' || $route.path === '/app_heatmap'}" @click="app_heatmap_input">{{$t('app.heatmap')}}</el-button> <br><br>
    <el-button type="info" class="btnStyle" :class="{'activebtn': $route.path === '/app_heatmap_input_project' || $route.path === '/app_heatmap_project'}" @click="app_heatmap_input_project">{{$t('app.heatmap_base_project')}}</el-button> <br><br>
    <el-button type="info" class="btnStyle" :class="{'activebtn': $route.path === '/app_ppi_input' || $route.path === '/app_ppi'}" @click="app_ppi_input">{{$t('button.ppi')}}</el-button> <br><br>
    <el-button type="info" class="btnStyle" :class="{'activebtn': $route.path === '/app_enrichment_input' || $route.path === '/app_enrichment'}" @click="app_enrichment_input">{{$t('button.enrichment')}}</el-button> <br><br>
    <el-button type="info" class="btnStyle" :class="{'activebtn': $route.path === '/app_force_input' || $route.path === '/app_force'}" @click="app_force_input">{{$t('button.force')}}</el-button>
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
    app_heatmap_input () {
      this.$router.push('app_heatmap_input')
    },
    app_heatmap_input_project () {
      this.$router.push('app_heatmap_input_project')
    },
    app_ppi_input () {
      this.$router.push('app_ppi_input')
    },
    app_enrichment_input () {
      this.$router.push('app_enrichment_input')
    },
    app_force_input () {
      this.$router.push('app_force_input')
    },
  }
}
</script>

<style scoped="true">
.container {
  padding: 5px;
}
.activebtn {
  background:#f56c6c;
  border-color:#f56c6c;
}
.btnStyle {
  width: 100%;
}
</style>
