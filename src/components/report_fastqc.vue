<template>
  <div class="">
      <div class="">
        <imgMenuShowComp></imgMenuShowComp>

        <el-breadcrumb separator="/" style="margin:5px 0 50px 0">
          <el-breadcrumb-item :to="{ path: 'report' }">{{$t('report.project')}} {{$store.state.projectName}}</el-breadcrumb-item>
          <el-breadcrumb-item>{{$t('leftMenu.fastqc')}}</el-breadcrumb-item>
        </el-breadcrumb>
        <h2>{{$t('fastqc.title')}}</h2>

        <a :href="fileUrl" download ref="downloadA"></a>

        <el-button size="mini" type="primary" icon="el-icon-download" plain @click="exportTable()">导出</el-button> <br><br>

        <table class="gridtable">
          <thead>
            <tr>
              <th>{{$t('fastqc.filename')}}</th>
              <el-tooltip placement="top" effect="light">
                <div slot="content">
                  {{$t('fastqc.basic_statistics_paragraph1')}} <br>
                  {{$t('fastqc.basic_statistics_paragraph2')}} <br>
                  {{$t('fastqc.basic_statistics_paragraph3')}} <br>
                  {{$t('fastqc.basic_statistics_paragraph4')}} <br>
                </div>
                <th>{{$t('fastqc.basic_statistics')}}</th>
              </el-tooltip>
              <el-tooltip placement="top" effect="light">
                <div slot="content">
                  {{$t('fastqc.base_quality_paragraph1')}}<br>
                  {{$t('fastqc.base_quality_paragraph2')}}<br>
                  {{$t('fastqc.base_quality_paragraph3')}}<br>
                  {{$t('fastqc.base_quality_paragraph4')}}<br>
                  {{$t('fastqc.base_quality_paragraph5')}}<br>
                </div>
                <th>{{$t('fastqc.base_quality')}}</th>
              </el-tooltip>
              <el-tooltip placement="top" effect="light">
                <div slot="content">
                  {{$t('fastqc.per_quality_paragraph1')}}<br>
                  {{$t('fastqc.per_quality_paragraph2')}}<br>
                  {{$t('fastqc.per_quality_paragraph3')}}<br>
                  {{$t('fastqc.per_quality_paragraph4')}}<br>
                  {{$t('fastqc.per_quality_paragraph5')}}<br>
                </div>
                <th>{{$t('fastqc.per_quality')}}</th>
              </el-tooltip>
              <el-tooltip placement="top" effect="light">
                <div slot="content">
                  {{$t('fastqc.sequence_quality_paragraph1')}}<br>
                  {{$t('fastqc.sequence_quality_paragraph2')}}<br>
                  {{$t('fastqc.sequence_quality_paragraph3')}}<br>
                  {{$t('fastqc.sequence_quality_paragraph4')}}<br>
                </div>
                <th>{{$t('fastqc.sequence_quality')}}</th>
              </el-tooltip>
              <el-tooltip placement="top" effect="light">
                <div slot="content">
                  {{$t('fastqc.gc_paragraph1')}}<br>
                  {{$t('fastqc.gc_paragraph2')}}<br>
                  {{$t('fastqc.gc_paragraph3')}}<br>
                  {{$t('fastqc.gc_paragraph4')}}<br>
                  {{$t('fastqc.gc_paragraph5')}}<br>
                </div>
                <th>{{$t('fastqc.gc')}}</th>
              </el-tooltip>
              <el-tooltip placement="top" effect="light">
                <div slot="content">
                  {{$t('fastqc.invalid_base_paragraph1')}}<br>
                  {{$t('fastqc.invalid_base_paragraph2')}}<br>
                  {{$t('fastqc.invalid_base_paragraph3')}}<br>
                  {{$t('fastqc.invalid_base_paragraph4')}}<br>
                </div>
                <th>{{$t('fastqc.invalid_base')}}</th>
              </el-tooltip>
              <el-tooltip placement="top" effect="light">
                <div slot="content">
                  {{$t('fastqc.sequence_length_paragraph1')}}<br>
                  {{$t('fastqc.sequence_length_paragraph2')}}<br>
                  {{$t('fastqc.sequence_length_paragraph3')}}<br>
                  {{$t('fastqc.sequence_length_paragraph4')}}<br>
                </div>
                <th>{{$t('fastqc.sequence_length')}}</th>
              </el-tooltip>
              <el-tooltip placement="top" effect="light">
                <div slot="content">
                  {{$t('fastqc.joint_contamination_paragraph1')}}<br>
                  {{$t('fastqc.joint_contamination_paragraph2')}}<br>
                  {{$t('fastqc.joint_contamination_paragraph3')}}<br>
                </div>
                <th>{{$t('fastqc.joint_contamination')}}</th>
              </el-tooltip>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in tableData">
                <!-- 文件名	 -->
                <td :class="{'bgcolor': index % 2 === 0 ? false: true}">
                  <a :href="'/projects/'+ $store.state.projectId +'/results/006.fastqc/'+ item.fileName +'_fastqc.html'" target="_blank">{{item.fileName}}</a>
                </td>
                <!-- 基本统计	 -->
                <td :class="{'bgcolor': index % 2 === 0 ? false: true}">
                  <i class="el-icon-success color-green" v-if="item.basicStatistics === 'PASS'"></i>
                  <i class="el-icon-error color-red" v-if="item.basicStatistics === 'FAIL'"></i>
                  <i class="el-icon-warning color-orange" v-if="item.basicStatistics === 'WARN'"></i>
                </td>
                <!-- 碱基质量	 -->
                <td :class="{'bgcolor': index % 2 === 0 ? false: true}" class="cursor-pointer" @click="imgClick('/projects/' + $store.state.projectId+ '/results/006.fastqc/' + item.fileName + '_fastqc/Images/' + 'per_base_quality.png')">
                  <i class="el-icon-success color-green" v-if="item.perBaseSequenceQuality === 'PASS'"></i>
                  <i class="el-icon-error color-red" v-if="item.perBaseSequenceQuality === 'FAIL'"></i>
                  <i class="el-icon-warning color-orange" v-if="item.perBaseSequenceQuality === 'WARN'"></i>
                </td>
                <!-- 每瓦质量	 -->
                <td :class="{'bgcolor': index % 2 === 0 ? false: true}" class="cursor-pointer" @click="imgClick('/projects/' + $store.state.projectId+ '/results/006.fastqc/' + item.fileName + '_fastqc/Images/' + 'per_tile_quality.png')">
                  <i class="el-icon-success color-green" v-if="item.perTileSequenceQuality === 'PASS'"></i>
                  <i class="el-icon-error color-red" v-if="item.perTileSequenceQuality === 'FAIL'"></i>
                  <i class="el-icon-warning color-orange" v-if="item.perTileSequenceQuality === 'WARN'"></i>
                </td>
                <!-- 序列质量	 -->
                <td :class="{'bgcolor': index % 2 === 0 ? false: true}" class="cursor-pointer" @click="imgClick('/projects/' + $store.state.projectId+ '/results/006.fastqc/' + item.fileName + '_fastqc/Images/' + 'per_sequence_quality.png')">
                  <i class="el-icon-success color-green" v-if="item.perSequenceQualityScores === 'PASS'"></i>
                  <i class="el-icon-error color-red" v-if="item.perSequenceQualityScores === 'FAIL'"></i>
                  <i class="el-icon-warning color-orange" v-if="item.perSequenceQualityScores === 'WARN'"></i>
                </td>
                <!-- GC含量 -->
                <td :class="{'bgcolor': index % 2 === 0 ? false: true}" class="cursor-pointer" @click="imgClick('/projects/' + $store.state.projectId+ '/results/006.fastqc/' + item.fileName + '_fastqc/Images/' + 'per_sequence_gc_content.png')">
                  <i class="el-icon-success color-green" v-if="item.perSequenceGcContent === 'PASS'"></i>
                  <i class="el-icon-error color-red" v-if="item.perSequenceGcContent === 'FAIL'"></i>
                  <i class="el-icon-warning color-orange" v-if="item.perSequenceGcContent === 'WARN'"></i>
                </td>
                <!-- 无效碱基含量 -->
                <td :class="{'bgcolor': index % 2 === 0 ? false: true}" class="cursor-pointer" @click="imgClick('/projects/' + $store.state.projectId+ '/results/006.fastqc/' + item.fileName + '_fastqc/Images/' + 'per_base_n_content.png')">
                  <i class="el-icon-success color-green" v-if="item.perBaseNContent === 'PASS'"></i>
                  <i class="el-icon-error color-red" v-if="item.perBaseNContent === 'FAIL'"></i>
                  <i class="el-icon-warning color-orange" v-if="item.perBaseNContent === 'WARN'"></i>
                </td>
                <!-- 序列长度分布 -->
                <td :class="{'bgcolor': index % 2 === 0 ? false: true}" class="cursor-pointer" @click="imgClick('/projects/' + $store.state.projectId+ '/results/006.fastqc/' + item.fileName + '_fastqc/Images/' + 'sequence_length_distribution.png')">
                  <i class="el-icon-success color-green" v-if="item.sequenceLengthDistribution === 'PASS'"></i>
                  <i class="el-icon-error color-red" v-if="item.sequenceLengthDistribution === 'FAIL'"></i>
                  <i class="el-icon-warning color-orange" v-if="item.sequenceLengthDistribution === 'WARN'"></i>
                </td>
                <!-- 接头污染 -->
                <td :class="{'bgcolor': index % 2 === 0 ? false: true}" class="cursor-pointer" @click="imgClick('/projects/' + $store.state.projectId+ '/results/006.fastqc/' + item.fileName + '_fastqc/Images/' + 'adapter_content.png')">
                  <i class="el-icon-success color-green" v-if="item.adapterContent === 'PASS'"></i>
                  <i class="el-icon-error color-red" v-if="item.adapterContent === 'FAIL'"></i>
                  <i class="el-icon-warning color-orange" v-if="item.adapterContent === 'WARN'"></i>
                </td>
            </tr>
          </tbody>
        </table>
        </div>
        <el-dialog
          title=""
          :visible.sync="imgDialog"
          width="100%"
          center>
          <img :src="imgSrc" alt="" class="tdImg">
        </el-dialog>
      <div class="clear"></div>

      </div>
</template>

<script>
import imgMenuShowComp from './imgMenuShowComp.vue'

export default {
  data () {
    return {
      tableData: [],
      imgDialog: false,
      imgSrc: '',
      fileUrl: '',
    }
  },
  components: {
    imgMenuShowComp
  },
  created () {
    this.initTable()
  },
  mounted () {
  },
  methods: {
    initTable () {
      this.axios.get('/server/fastqc?username=' + this.$store.state.username + '&p=' + this.$store.state.projectId).then((res) => {
        this.tableData = res.data.slice(1)
      })
    },
    imgClick(imgSrc) {
      this.imgDialog = true
      this.imgSrc = imgSrc
    },
    exportTable () {
      this.axios.get("/server/export_fastqc?p=" + this.$store.state.projectId + "&username=" + this.$store.state.username).then(res => {
        this.fileUrl = res.data.filePath
        setTimeout(() => {
          this.$refs.downloadA.click()
        }, 0)
      })
    },
  }
}
</script>

<style scoped="true">
.content {
  float:left;
  /* width: 60%; */
  width: calc(100% - 350px);
  padding: 0 20px;
  margin: 19px auto;
}
table.gridtable {
    width: 100%;
    text-align: center;
    font-size:14px;
    color:#333333;
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
.color-green {
  color: green;
}
.color-red {
  color: red;
}
.color-orange {
  color: orange;
}
.bgcolor {
  background-color: #f9f9f9 !important;
}
.tdImg {
  max-height: 100%;
  max-width: 100%;
  vertical-align: middle;
}
.imgStyle {
  width: 100%;
}
.clear {
  clear: both;
}
</style>
<style media="screen">
.el-dialog--center .el-dialog__body {
  text-align: center !important;
}
</style>
