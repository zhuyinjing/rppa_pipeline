<template>
  <el-container style="height:calc(100% - 62px);margin-top:2px">
    <el-aside v-show="$store.state.appmenuShow" style="width:300px;height:100%;border-right:1px solid #e6e6e6">
      <appLeftMenu></appLeftMenu>
    </el-aside>
    <el-main>
      <appImgMenuShowComp></appImgMenuShowComp>

      <div>
        <div class="margin-top-10">
          <div class="labelStyle">
            <label for="maxpval" class="label-font">{{$t('input.gene_id_list')}}</label>
          </div>
          <div class="inline-block">
            <!-- <el-radio v-model="radioName" label="geneName">按 geneName 输入</el-radio> -->
            <el-radio v-model="radioName" label="geneId">{{$t('input.gene_id')}}</el-radio>
          </div>
        </div>
        <div class="margin-top-10" v-show="radioName === 'geneName'">
          <div class="labelStyle"></div>
          <div class="inline-block" style="width:800px;">
            <el-input
              type="textarea"
              :rows="30"
              :placeholder="$t('input.split_method')"
              v-model="textareaGeneName">
            </el-input>
          </div>
        </div>
        <div class="margin-top-10" v-show="radioName === 'geneId'">
          <div class="labelStyle"></div>
          <div class="inline-block" style="width:800px;">
            <el-input
              type="textarea"
              :rows="30"
              :placeholder="$t('input.split_method')"
              v-model="textareaGeneId">
            </el-input>
          </div>
          <!-- <el-button type="text">(example)</el-button> -->
        </div>
        <div class="margin-top-10">
          <div class="labelStyle">
            <label class="label-font">{{$t('app.choose_sample')}}</label>
          </div>
          <div class="inline-block" style="width:300px;">
            <el-select class="input-style" v-model="specie" placeholder="请选择">
              <el-option :value="key" v-for="(item, key) in $store.state.speciesArr" :key="key">{{key}}</el-option>
            </el-select>
          </div>
        </div>
        <div class="margin-top-10">
          <div class="labelStyle"></div>
          <div class="inline-block" style="width:300px;">
            <el-button type="primary" @click="submit()">{{$t('button.submit')}}</el-button>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import appLeftMenu from './app_leftMenu.vue'
import appImgMenuShowComp from './appImgMenuShowComp.vue'

export default {
  data () {
    return {
      textareaGeneName: '',
      textareaGeneId: '',
      radioName: 'geneId',
      loading: null,
      specie: null,
    }
  },
  components: {
    appLeftMenu,
    appImgMenuShowComp
  },
  mounted () {
    //  获取物种列表
    this.axios.get('/server/get_species_info?username=' + this.$store.state.username).then(res => {
      if (res.data.message_type === 'success') {
        this.specie = Object.keys(res.data.speciesInfo)[0] // 默认显示第一个
        this.$store.commit('setspeciesArr', res.data.speciesInfo)
      }
    })
  },
  methods: {
    submit () {
      // 判断 基因ID列表 是否为空
      if (!this.textareaGeneId.trim()) {
        this.$message.error('请输入基因ID列表!');
        return
      }
      // 正则 替换 逗号 空格 为 换行
      this.textareaGeneId = this.textareaGeneId.replace(/(\,|\s)+/g, '\n')
      sessionStorage.setItem('geneInfo', this.textareaGeneId)
      sessionStorage.setItem('infoType', 1)
      this.loading = this.$loading({
        lock: true,
        text: '文件正在上传中...请稍等...可能需要等待1分钟左右的时间...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let formData = new FormData()
      formData.append('username', this.$store.state.username)
      formData.append('genelist', this.textareaGeneId)
      formData.append('speciesId', this.$store.state.speciesArr[this.specie])
      this.axios.post('/server/ppi_chord_plot.app', formData).then((res) => {
        if (res.data.message_type === 'warn') {
          this.$message.error(res.data.message)
        } else {
          this.$store.commit('setppiJson', res.data.message)
          this.$router.push({'name': 'app_ppi'})
        }
        this.loading.close()
      })
    },
  }
}
</script>

<style scoped="true">
.labelStyle {
  display:inline-block;
  width:150px;
  text-align:end;
}
.label-font {
  font-size: 16px;
}
.margin-top-10 {
  margin-top: 10px;
}
.inline-block {
  display: inline-block;
}
.vertical-align-top {
  vertical-align: top;
}
.span-font {
  font-size: 12px;
  color: #54a0ff;
}
</style>
<style media="screen">
.color_scales {
  z-index: 9 !important;
}
</style>
