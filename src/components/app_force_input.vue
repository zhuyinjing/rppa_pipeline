<template>
  <el-container style="height:calc(100% - 62px);margin-top:2px">
    <el-aside v-show="$store.state.appmenuShow" style="width:300px;height:100%;border-right:1px solid #e6e6e6">
      <appLeftMenu></appLeftMenu>
    </el-aside>
    <el-main>
      <appImgMenuShowComp></appImgMenuShowComp>

      <div>
        <div class="margin-top-10">
          <div class="labelStyle vertical-align-top">
            <label for="maxpval" class="label-font">{{$t('input.gene_id_list')}}</label>
          </div>
          <div class="inline-block" style="width:800px;">
            <el-input
              type="textarea"
              :rows="20"
              :placeholder="$t('input.gene_id_list')"
              v-model="textareaGeneId">
            </el-input>
          </div>
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
      textareaGeneId: '',
      loading: null,
      specie: null,
    }
  },
  components: {
    appLeftMenu,
    appImgMenuShowComp
  },
  created () {
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
      // 判断 基因 ID 列表 是否为空
      if (!this.textareaGeneId.trim()) {
        this.$message.error('请输入基因 ID 列表!')
        return
      }
      this.textareaGeneId = this.textareaGeneId.replace(/(\,|\s)+/g, '\n')
      sessionStorage.setItem('geneInfo', this.textareaGeneId)
      sessionStorage.setItem('infoType', 1)
      this.loading = this.$loading({
        lock: true,
        text: '列表正在处理中...请稍等...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let formData = new FormData()
      formData.append('username', this.$store.state.username)
      formData.append('speciesId', this.$store.state.speciesArr[this.specie])
      formData.append('geneList', this.textareaGeneId)
      // 设置 vuex 物种id
      this.$store.commit('setspecies', this.$store.state.speciesArr[this.specie])
      this.axios.post('/server/deg_effect_of_force_diagram.app', formData).then((res) => {
        if (res.data.message_type === 'success') {
          this.$message.success('蛋白互作网络图生成完成!')
          this.$store.commit('setppiJson', res.data.message)
          this.$router.push({'name': 'app_force'})
        } else {
          this.$message.error(res.data.message)
        }
        this.loading.close()
      }).catch((e) => {
        this.$message.error('请求错误!')
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
</style>
