<template>
  <div class="main">
    <navbar class="navbar"></navbar>
    <router-view/>
    <el-dialog
      title="提示"
      :visible.sync="$store.state.svgDescribeShow"
      width="30%"
      >
      <p>{{$t('svg.what_svg')}}</p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;{{$t('svg.introduction')}}</p>
      <p>{{$t('svg.tool')}}：</p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;<a class="a-style" @click="linkDownload('https://inkscape.org/')">Inkscape</a> 、
      <a class="a-style" @click="linkDownload('https://www.adobe.com/products/illustrator.html')">Adobe Illustrator</a>
      {{$t('svg.browse')}}</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="$store.state.svgDescribeShow = false">{{$t('button.ok')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import navbar from '@/components/navbar.vue'

export default {
  name: 'App',
  components: {
    navbar
  },
  mounted () {
  },
  methods: {
    linkDownload (url) {
      window.open(url,'_blank')
    }
  }
}
</script>

<style scoped="true">
.a-style {
  color: #0500ee;
  cursor: pointer;
  text-decoration: underline;
}
</style>
<style>
.main {
  width: 100%;
  height: 100%;
}
.navbar {
  height: 60px;
}
</style>
