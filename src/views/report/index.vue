<template>
<el-container style="height:calc(100% - 62px);margin-top:2px">
  <el-aside v-show="$store.state.menuShow" width="350px;" style="width:300px;height:100%;border-right:1px solid #e6e6e6">
    <leftMenu style="margin-top:5px"></leftMenu>
  </el-aside>
  <el-main>
    <router-view/>
  </el-main>
</el-container>
</template>

<script>
import leftMenu from '@/components/leftMenu.vue'
import imgMenuShowComp from '@/components/imgMenuShowComp.vue'

export default {
  data() {
    return {
      geneNum: null,
      transcriptNum: null,
      displayLatinName: null,
      displayName: null,
      genome: null,
      dialog: false,
    }
  },
  components: {
    leftMenu,
    imgMenuShowComp
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style scoped="true">
.content {
  float: left;
  /* width: 60%; */
  width: calc(100% - 350px);
  padding: 0 20px;
  margin: 19px auto;
}

.p-font-style {
  /* color: #666; */
}

.latinNameStyle {
  font-style: italic;
}

table.gridtable {
  width: 100%;
  text-align: center;
  font-size: 14px;
  color: #333333;
  border-width: 1px;
  border-color: #ebeef5;
  border-collapse: collapse;
}

table.gridtable th {
  color: #333;
  border-width: 1px;
  padding: 8px;
  border-style: solid;
  border-color: #ebeef5;
}

table.gridtable td {
  border-width: 1px;
  padding: 8px;
  border-style: solid;
  border-color: #ebeef5;
  background-color: #ffffff;
}

.tableStyle {
  display: inline-block;
  width: 40%;
  margin-right: 50px;
}

.degtable {
  display: inline-block;
  width: 40%;
}

.bgcolor {
  background-color: #f9f9f9 !important;
}
</style>
