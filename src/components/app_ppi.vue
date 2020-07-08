<template>
  <el-container style="height:calc(100% - 62px);margin-top:2px">
    <el-aside v-show="$store.state.appmenuShow" style="width:300px;height:100%;border-right:1px solid #e6e6e6">
      <appLeftMenu></appLeftMenu>
    </el-aside>
    <el-main>
      <appImgMenuShowComp></appImgMenuShowComp>

      <div class="">
        <h2>蛋白相互作用图</h2>

        <ppiComp></ppiComp>

        <appTableComp></appTableComp>

      </div>
    </el-main>
  </el-container>
</template>

<script>
import appLeftMenu from './app_leftMenu.vue'
import appImgMenuShowComp from './appImgMenuShowComp.vue'
import ppiComp from './ppiComp.vue'
import appTableComp from './app_tableComp.vue'

export default {
  data () {
    return {
    }
  },
  components: {
    appLeftMenu,
    appImgMenuShowComp,
    ppiComp,
    appTableComp
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style scoped="true">
</style>
