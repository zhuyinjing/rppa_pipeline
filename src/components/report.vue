<template>
  <div class="">
    <imgMenuShowComp></imgMenuShowComp>

    <el-breadcrumb separator="/" style="margin:5px 0 50px 0">
      <el-breadcrumb-item>{{$t('report.project')}} {{$store.state.projectName}}</el-breadcrumb-item>
      <el-breadcrumb-item></el-breadcrumb-item>
    </el-breadcrumb>
    <h2>RPPA简介</h2>
    <p>反相蛋白微阵列Reverse Phase Protein Array （RPPA）蛋白组学技术，是一种基于抗体检测的高通量高产出蛋白组学技术平台，可用于检测广泛来源的细胞和组织样本。
基于RPPA蛋白组学技术平台，可分析培养细胞、小鼠模型组织、及临床病人样本（鲜冻样本）中超过300种癌症相关蛋白及蛋白修饰位点，覆盖几十个癌症相关的重要信号通路，提供蛋白组学大数据的基本生物信息学分析和解读。</p>

    <h2>{{$t('report.project')}}{{$store.state.projectName}}{{$t('report.describe')}}</h2>
    <p>{{$t('report.species')}}：<span class="latinNameStyle">{{this.displayLatinName}}</span> ( {{this.displayName}} )</p>
    <p>{{$t('report.genome')}}：{{this.genome}}</p>

    <h2>{{$t('report.experiment')}}</h2>

    <div class="" id="canvas">
      <div class="tableStyle">
        <p class="p-font-style">{{$t('create_experiment.experiment_list')}}</p>
        <table class="gridtable">
          <tr>
            <th>{{$t('create_experiment.experiment_condition')}}</th>
            <th>{{$t('create_experiment.sample_name')}}</th>
          </tr>
          <tr v-for="(item, value, index) in $store.state.info.experimentDesign.nameSampleMap">
            <td :class="{'bgcolor': index % 2 === 0 ? false: true}">{{item.condition}}</td>
            <td :class="{'bgcolor': index % 2 === 0 ? false: true}">{{item.name}}</td>
          </tr>
        </table>
      </div>
      <div class="degtable">
        <p class="p-font-style">{{$t('create_experiment.case_control')}}</p>
        <table class="gridtable">
          <tr>
            <th>{{$t('create_experiment.case')}}</th>
            <th>{{$t('create_experiment.control')}}</th>
          </tr>
          <tr v-for="(item, index) in $store.state.info.experimentDesign.experiments">
            <td :class="{'bgcolor': index % 2 === 0 ? false: true}">{{item._case}}</td>
            <td :class="{'bgcolor': index % 2 === 0 ? false: true}">{{item._control}}</td>
          </tr>
        </table>
      </div>
      <div class="degtable" v-if="$store.state.projectType === 'Time_Series'">
        <p class="p-font-style">时序分析实验设计</p>
        <table class="gridtable">
          <tr>
              <th>{{$t('create_experiment.sample_name')}}</th><th>Time</th><th>Batch</th>
          </tr>
          <tr v-for="(item, key, index) in timeExpObj">
              <td :class="{'bgcolor': index % 2 === 0 ? false: true}">{{item.name}}</td>
              <td :class="{'bgcolor': index % 2 === 0 ? false: true}">{{item.time}}</td>
              <td :class="{'bgcolor': index % 2 === 0 ? false: true}">{{item.batch}}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import imgMenuShowComp from './imgMenuShowComp.vue'

export default {
  data() {
    return {
      geneNum: null,
      transcriptNum: null,
      displayLatinName: null,
      displayName: null,
      genome: null,
      dialog: false,
      timeExpObj: {},
    }
  },
  components: {
    imgMenuShowComp
  },
  mounted() {
    this.getValue()
  },
  methods: {
    pdf() {
      // html2canvas(document.body, {
      //     onrendered:function(canvas) {
      //
      //         //返回图片dataURL，参数：图片格式和清晰度(0-1)
      //         var pageData = canvas.toDataURL('image/jpeg', 1.0);
      //
      //         //方向默认竖直，尺寸ponits，格式a4[595.28,841.89]
      //         var pdf = new jsPDF('', 'pt', 'a4');
      //
      //         //addImage后两个参数控制添加图片的尺寸，此处将页面高度按照a4纸宽高比列进行压缩
      //         pdf.addImage(pageData, 'JPEG', 0, 0, 595.28, 592.28/canvas.width * canvas.height );
      //
      //         pdf.save('stone.pdf');
      //
      //     }
      // })

      // printJS({
      //   printable: 'canvas',
      //   type: 'html',
      //   showModal: true,
      //   targetStyles: ['*']
      //  })

      // var pdf = new jsPDF('p', 'pt', 'a4')
      // $('#canvas').css("background", "#fff")
      // pdf.addHTML($("#canvas"),{pagesplit: false, retina: true}, () => {
      //   pdf.internal.scaleFactor = 3.75;
      //   pdf.output("save", "test.pdf")
      // })
    },
    getValue() {
      this.axios.get('/server/rnaseq_report_summary?username=' + this.$store.state.username + '&p=' + this.$store.state.projectId + '&speciesId=' + this.$store.state.species).then((res) => {
        if (res.data.message_type === 'success') {
          this.displayLatinName = res.data.speciesInfo.latinName
          this.displayName = res.data.speciesInfo.commonName
          this.genome = res.data.referenceInfo.genome
        }
      })

      // 项目类型为时序设计时，该请求是获取时序表格内容的显示
      if (this.$store.state.projectType === 'Time_Series') {
        this.axios.get('/server/get_time_series_experiment?p=' + this.$store.state.projectId).then((res) => {
          if (res.data.message) {
            this.timeExpObj = res.data.message.nameSampleMap
          }
        })
      }

    },
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
