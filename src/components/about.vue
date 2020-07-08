<template>
  <el-container style="height:calc(100% - 62px);margin-top:2px">
    <el-aside v-show="$store.state.menuShow" width="350px;" style="width:300px;height:100%;border-right:1px solid #e6e6e6">
      <leftMenu style="margin-top:5px"></leftMenu>
    </el-aside>
    <el-main>
      <div class="">
        <imgMenuShowComp></imgMenuShowComp>

        <el-breadcrumb separator="/" style="margin:5px 0 50px 0">
          <el-breadcrumb-item :to="{ path: 'report' }">{{$t('report.project')}} {{$store.state.projectName}}</el-breadcrumb-item>
          <el-breadcrumb-item>时序性差异表达分析</el-breadcrumb-item>
        </el-breadcrumb>

        <h2>时序性差异表达分析</h2>

      </div>
    </el-main>
  </el-container>
</template>

<script>
import leftMenu from './leftMenu.vue'
import imgMenuShowComp from './imgMenuShowComp.vue'

export default {
  data () {
    return {
    }
  },
  components: {
    leftMenu,
    imgMenuShowComp
  },
  mounted () {
  },
  methods: {

  }
}
</script>

<style scoped="true">
</style>
