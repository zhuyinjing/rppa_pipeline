<template>
  <div>
    <div class="imgStyle">
      <img class="imgStyle" src="/static/logo.png" alt="">
    </div>
    <div class="textStyle">
      <h1>{{$t('home.introduction')}}</h1>
    </div>
    <div class="textStyle">
      <!-- <el-button type="danger" @click="login()">登录/注册</el-button> -->
      <el-button type="primary" @click="project_list()">{{$t('home.project_button')}}</el-button>
      <!-- <img src="http://colorseq.com/server/username" alt="" class='display-none'> -->
      <p class="suggestStyle">{{$t('home.suggest_browser')}}:
        <a href="https://chrome.en.softonic.com/" target="_blank">Chrome</a> &nbsp;
        <a href="https://safari.en.softonic.com/" target="_blank">Safari</a> &nbsp;
        <a href="http://www.firefox.com.cn/" target="_blank">Firefox</a>
      </p>
    </div>
    <login ref="loginDiv"></login>

    <!-- <div class="footer">{{$t('home.footer_font')}}</div> -->
    <div class="footer">{{record_num}} | Powered by <a :href="hrefUrl" target="_blank" style="color: #970720;">{{urlText}}</a> </div>
  </div>
</template>

<script>
import bus from '../bus.js'
import navbar from './navbar.vue'
import login from './login.vue'

export default {
  data () {
    return {
      dialogFormVisible: false,
        form: {
          email: '',
          password: ''
        },
        formLabelWidth: '120px',
        record_num: '',
        urlText: '',
        hrefUrl: '',
    }
  },
  components: {
    navbar,
    login
  },
  created () {
    this.axios('/static/footer.json').then(res => {
      this.record_num = res.data.record_num
      this.urlText = res.data.urlText
      this.hrefUrl = res.data.hrefUrl
    })
  },
  mounted () {
  },
  methods: {
    project_list () {
      if (this.$store.state.role === 'admin') {
        bus.$emit("handleSelect","admin_project_list")
      } else {
        bus.$emit("handleSelect","project")
      }
    }
  }
}
</script>

<style scoped="true">
.imgStyle {
  width: 400px;
  margin: 10px auto;
}
.textStyle {
  text-align: center;
}
.display-none {
  width: 0;
  height: 0;
}
.footer {
  position: absolute;
  bottom: 0;
  width: calc(100% - 50px);
  height: 30px;
  line-height: 30px;
  background: #e6e6e6;
  padding-left: 50px;
  font-size: 12px;
  color: #970720;
}
.suggestStyle {
  color: #999;
  margin-top: 50px;
}
a:hover, a:visited, a:link, a:active {
  color: #999;
}
</style>
