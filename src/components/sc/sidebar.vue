<template>
  <div>
    <el-menu v-if="type === 'PCA'" style="padding: 0 10px;" :default-active="$route.name" class="el-menu-vertical-demo">
      <router-link to="/sc"><el-menu-item index="sc_report">报告首页</el-menu-item></router-link>
      <el-menu-item-group>
        <span slot="" class="title-style">测序数据分布统计</span>
        <router-link to="/sc/report_sequence_amount"><el-menu-item index="report_sequence_amount">不同单细胞测序量</el-menu-item></router-link>
        <router-link to="/sc/report_box_plot"><el-menu-item index="report_box_plot">测序读段回贴位置分布</el-menu-item></router-link>
        <router-link to="/sc/report_umi_count"><el-menu-item index="report_umi_count">基因与UMI数量分布</el-menu-item></router-link>
        <router-link to="/sc/report_gene_UMIcounts"><el-menu-item index="report_gene_UMIcounts">基因与UMI数量基因结构分布</el-menu-item></router-link>
        <router-link to="/sc/report_nGene_nUMI"><el-menu-item index="report_nGene_nUMI">表达基因与UMI数目的对应分布</el-menu-item></router-link>
        <router-link to="/sc/report_heterogeneous_gene"><el-menu-item index="report_heterogeneous_gene">基因表达量分布</el-menu-item></router-link>
      </el-menu-item-group>
      <el-menu-item-group>
        <span slot="" class="title-style">主成分的展示与选择</span>
        <router-link to="/sc/report_viz_PCA"><el-menu-item index="report_viz_PCA">基因加载量分布图</el-menu-item></router-link>
        <router-link to="/sc/report_pca"><el-menu-item index="report_pca">PCA 散点图</el-menu-item></router-link>
        <router-link to="/sc/report_pca_3d"><el-menu-item index="report_pca_3d">PCA 散点图 3D</el-menu-item></router-link>
        <router-link to="/sc/report_pca_heatmap"><el-menu-item index="report_pca_heatmap">PCA 热图</el-menu-item></router-link>
        <router-link to="/sc/report_JackStrawPlot"><el-menu-item index="report_JackStrawPlot">PCA 统计显著性检验</el-menu-item></router-link>
        <router-link to="/sc/report_pca_elbow"><el-menu-item index="report_pca_elbow">PCA 肘形图</el-menu-item></router-link>
      </el-menu-item-group>
      <el-menu-item-group>
        <span slot="" class="title-style">tSNE聚类</span>
        <router-link to="/sc/report_tSNE"><el-menu-item index="report_tSNE">tSNE 聚类图</el-menu-item></router-link>
      </el-menu-item-group>
      <el-menu-item-group>
        <span slot="" class="title-style">类间特征基因表达分析</span>
        <router-link to="/sc/report_group_violin"><el-menu-item index="report_group_violin">类间特征基因表达分析</el-menu-item></router-link>
      </el-menu-item-group>
    </el-menu>

    <el-menu v-if="type === 'CCA'" style="padding: 0 10px;" :default-active="$route.name" class="el-menu-vertical-demo">
      <router-link to="/sc"><el-menu-item index="sc_report">报告首页</el-menu-item></router-link>
      <el-menu-item-group>
        <span slot="" class="title-style">数据质控</span>
        <router-link to="/sc/CCA_UMI_count"><el-menu-item index="CCA_UMI_count">基因与UMI数量分布</el-menu-item></router-link>
        <router-link to="/sc/CCA_nGene_nUMI"><el-menu-item index="CCA_nGene_nUMI">基因与UMI数量相关关系</el-menu-item></router-link>
        <router-link to="/sc/CCA_heterogeneous_gene"><el-menu-item index="CCA_heterogeneous_gene">基因表达量特征分布</el-menu-item></router-link>
      </el-menu-item-group>
      <el-menu-item-group>
        <span slot="" class="title-style">降维分析</span>
        <router-link to="/sc/CCA_scatter"><el-menu-item index="CCA_scatter">典型相关分析散点图</el-menu-item></router-link>
        <router-link to="/sc/CCA_elbow"><el-menu-item index="CCA_elbow">典型相关分析肘形图</el-menu-item></router-link>
        <router-link to="/sc/CCA_heatmap"><el-menu-item index="CCA_heatmap">典型相关分析热图</el-menu-item></router-link>
      </el-menu-item-group>
      <el-menu-item-group>
        <span slot="" class="title-style">聚类分析</span>
        <router-link to="/sc/report_tSNE"><el-menu-item index="report_tSNE">t-SNE样本标记图</el-menu-item></router-link>
        <router-link to="/sc/report_tSNE"><el-menu-item index="report_tSNE">t-SNE聚类标记图</el-menu-item></router-link>
      </el-menu-item-group>
    </el-menu>
  </div>
</template>

<script>
export default {
  data () {
    return {
      type: 'CCA',
    }
  },
  components: {
  },
  mounted () {
  },
  methods: {

  }
}
</script>

<style scoped="true">
.cursor-pointer {
  cursor: pointer;
}
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
