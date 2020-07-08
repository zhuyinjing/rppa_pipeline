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
              v-model="textareaMatrix">
            </el-input>
          </div>
        </div>
        <div class="margin-top-10">
          <div class="labelStyle">
            <label for="maxpval" class="label-font">{{$t('app.choose_project')}}</label>
          </div>
          <div class="inline-block" style="width:800px;">
            <el-select class="input-style" v-model="project" placeholder="请选择" @change="projectChange()">
              <el-option :value="item.projectName" v-for="(item, index) in projects" :key="item.projectId">{{item.projectName}}</el-option>
            </el-select>
          </div>
        </div>
        <div class="margin-top-10">
          <div class="labelStyle">
            <label for="maxpval" class="label-font">{{$t('app.choose_group')}}</label>
          </div>
          <div class="inline-block" style="width:800px;">
            <el-select v-model="group" multiple placeholder="请选择">
              <el-option
                v-for="item in groups"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="">
          <div class="margin-top-10">
            <div class="labelStyle">
              <label for="maxpval" class="label-font">{{$t('app.gene_distance')}}</label>
            </div>
            <el-select class="input-style" v-model="row_distance" placeholder="请选择">
              <el-option-group label="Favourites">
                <el-option value="euclidean">euclidean</el-option>
                <el-option value="correlation">correlation</el-option>
              </el-option-group>
              <el-option-group label="All">
                <el-option value="braycurtis">braycurtis</el-option>
                <el-option value="canberra">canberra</el-option>
                <el-option value="chebyshev">chebyshev</el-option>
                <el-option value="cityblock">cityblock</el-option>
                <el-option value="cosine">cosine</el-option>
                <el-option value="dice">dice</el-option>
                <el-option value="hamming">hamming</el-option>
                <el-option value="jaccard">jaccard</el-option>
                <el-option value="kulsinski">kulsinski</el-option>
                <el-option value="mahalanobis">mahalanobis</el-option>
                <el-option value="minkowski">minkowski</el-option>
                <el-option value="matching">matching</el-option>
                <el-option value="rogerstanimoto">rogerstanimoto</el-option>
                <el-option value="russellrao">russellrao</el-option>
                <el-option value="seuclidean">seuclidean</el-option>
                <el-option value="sqeuclidean">sqeuclidean</el-option>
                <el-option value="sokalmichener">sokalmichener</el-option>
                <el-option value="sokalsneath">sokalsneath</el-option>
                <el-option value="yule">yule</el-option>
              </el-option-group>
            </el-select>
          </div>
          <div class="margin-top-10">
            <div class="labelStyle">
              <label for="maxfdr" class="label-font">{{$t('app.gene_linkage')}}</label>
            </div>
            <el-select class="input-style" v-model="row_linkage" placeholder="请选择">
              <el-option value="average">average</el-option>
              <el-option value="centroid">centroid</el-option>
              <el-option value="complete">complete</el-option>
              <el-option value="median">median</el-option>
              <el-option value="single">single</el-option>
              <el-option value="ward">ward</el-option>
              <el-option value="weighted">weighted</el-option>
            </el-select>
          </div>
          <div class="margin-top-10">
            <div class="labelStyle">
              <label for="minfc" class="label-font">{{$t('app.sample_distance')}}</label>
            </div>
            <el-select class="input-style" v-model="column_distance" placeholder="请选择">
              <el-option-group label="Favourites">
                <el-option value="euclidean">euclidean</el-option>
                <el-option value="correlation">correlation</el-option>
              </el-option-group>
              <el-option-group label="All">
                <el-option value="braycurtis">braycurtis</el-option>
                <el-option value="canberra">canberra</el-option>
                <el-option value="chebyshev">chebyshev</el-option>
                <el-option value="cityblock">cityblock</el-option>
                <el-option value="cosine">cosine</el-option>
                <el-option value="dice">dice</el-option>
                <el-option value="hamming">hamming</el-option>
                <el-option value="jaccard">jaccard</el-option>
                <el-option value="kulsinski">kulsinski</el-option>
                <el-option value="mahalanobis">mahalanobis</el-option>
                <el-option value="minkowski">minkowski</el-option>
                <el-option value="matching">matching</el-option>
                <el-option value="rogerstanimoto">rogerstanimoto</el-option>
                <el-option value="russellrao">russellrao</el-option>
                <el-option value="seuclidean">seuclidean</el-option>
                <el-option value="sqeuclidean">sqeuclidean</el-option>
                <el-option value="sokalmichener">sokalmichener</el-option>
                <el-option value="sokalsneath">sokalsneath</el-option>
                <el-option value="yule">yule</el-option>
              </el-option-group>
            </el-select>
          </div>
          <div class="margin-top-10">
            <div class="labelStyle">
              <label class="label-font">{{$t('app.sample_linkage')}}</label>
            </div>
            <el-select class="input-style" v-model="column_linkage" placeholder="请选择">
              <el-option value="average">average</el-option>
              <el-option value="centroid">centroid</el-option>
              <el-option value="complete">complete</el-option>
              <el-option value="median">median</el-option>
              <el-option value="single">single</el-option>
              <el-option value="ward">ward</el-option>
              <el-option value="weighted">weighted</el-option>
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
      textareaMatrix: '',
      row_distance: 'euclidean',
      row_linkage: 'ward',
      column_distance: 'euclidean',
      column_linkage: 'ward',
      loading: null,
      projects: [],
      project: null,
      projectId: null,
      group: [],
      groups: [],
    }
  },
  components: {
    appLeftMenu,
    appImgMenuShowComp
  },
  created () {
    this.getGroupValue()
  },
  mounted () {
  },
  methods: {
    getGroupValue () {
      this.axios.get('/server/find_project_and_condition_num?username=' + this.$store.state.username).then((res) => {
        this.projects = res.data
        this.project = res.data[0]['projectName']
        this.groups = res.data[0]['sample']
        this.projectId = res.data[0]['projectId']
      })
    },
    submit () {
      // 判断 基因 ID 列表 是否为空
      if (!this.textareaMatrix.trim()) {
        this.$message.error('请输入基因 ID 列表!');
        return
      }
      if (this.group.length === 0) {
        this.$message.error('请选择分组!');
        return
      }
      this.textareaMatrix = this.textareaMatrix.replace(/(\,|\s)+/g, '\n')
      sessionStorage.setItem('geneInfo', this.textareaMatrix)
      sessionStorage.setItem('infoType', 1)
      this.loading = this.$loading({
        lock: true,
        text: '文件正在上传中...请稍等...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let formData = new FormData()
      formData.append('username', this.$store.state.username)
      formData.append('p', this.projectId)
      formData.append('geneList', this.textareaMatrix)
      formData.append('nameSampleList', this.group)
      formData.append('row_distance', this.row_distance)
      formData.append('column_distance', this.column_distance)
      formData.append('row_linkage', this.row_linkage)
      formData.append('column_linkage', this.column_linkage)
      this.axios.post('/server/upload_heatmap_by_project', formData).then((res) => {
        if (res.data.message_type === 'success') {
          this.$message.success('热图生成完成!');
          this.$store.commit('setheatmapJson', res.data.message)
          this.$router.push({'name': 'app_heatmap_project'})
        } else {
          this.$message.error(res.data.message);
        }
        this.loading.close()
      })
    },
    projectChange () {
      this.group = []
      for (let i = 0;i < this.projects.length;i++) {
        if (this.project === this.projects[i]['projectName']) {
          this.projectId = this.projects[i]['projectId']
          this.groups = this.projects[i]['sample']
          return
        }
      }
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
