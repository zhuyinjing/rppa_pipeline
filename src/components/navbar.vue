<template>
<div>
  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
    <el-menu-item index="home">{{$t('navbar.home')}}</el-menu-item>
    <el-menu-item index="project">{{$t('navbar.project_list')}}</el-menu-item>
    <el-menu-item index="userList" v-if="$store.state.role === 'ADMIN'">用户列表</el-menu-item>
    <el-menu-item index="app_heatmap_input">{{$t('navbar.app_tool')}}</el-menu-item>
    <el-menu-item index="admin_species_config" v-if="$store.state.role === 'ADMIN'">物种配置</el-menu-item>
    <a href="http://www.eclickgene.com/" target="_blank" class="alink">易点基因</a>
  </el-menu>
  <div class="userDiv" v-show="$store.state.username">
    <el-dropdown trigger="click" @command="changeLocale">
      <span class="el-dropdown-link">
        {{language}}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="中文">中文</el-dropdown-item>
        <el-dropdown-item command="English">English</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>&nbsp;&nbsp;
    <span class="nameStyle">{{$store.state.username}}</span>
    <el-button type="text" @click="logout">{{$t('navbar.logout')}}</el-button>
  </div>

</div>
</template>

<script>
import bus from '../bus.js'
export default {
  data() {
    return {
      activeIndex: '',
      language: '中文',
    }
  },
  components: {},
  mounted() {
    if (localStorage.language) {
      this.language = localStorage.language === 'zh'? '中文' : 'English'
    }
    if (!sessionStorage.navbarItem) {
      this.activeIndex = 'home'
    } else {
      this.activeIndex = sessionStorage.navbarItem
    }
    bus.$on("handleSelect", (key) => {
      this.handleSelect(key)
    })
  },
  methods: {
    changeLocale(command) {
      this.language = command
      if (command === '中文') {
        localStorage.setItem('language', 'zh')
        this.$i18n.locale = 'zh'
      } else {
        localStorage.setItem('language', 'en')
        this.$i18n.locale = 'en'
      }
    },
    handleSelect(key, keyPath) {
      setTimeout(() => {
        this.activeIndex = key
      }, 10)
      sessionStorage.setItem('navbarItem', key)
      let self = this
      switch (key) {
        case 'home':
          this.$router.push({
            'path': '/'
          })
          break
        case 'project':
          sessionStorage.clear()
          sessionStorage.setItem('navbarItem', key)
          this.$router.push({
            'name': 'project_list'
          })
          break
        case 'userList':
          this.$router.push({
            'name': 'user_list'
          })
          break
        case 'app_heatmap_input':
          this.$router.push({
            'name': 'app_heatmap_input'
          })
          break
        case 'admin_species_config':
          this.$router.push({
            'path': '/admin_species_config'
          })
          break
      }
    },
    logout() {
      this.$confirm('确认退出该账号吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        sessionStorage.removeItem('navbarItem')
        window.location.href = document.location.origin +'/logout'
      }).catch(() => {});
    },
  }
}
</script>

<style scoped="true">
.userDiv {
  position: absolute;
  top: 18px;
  right: 50px;
}

.nameStyle {
  margin-right: 30px;
  color: #b5a199;
}

.text-center {
  text-align: center;
}
.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
.el-icon-arrow-down {
  font-size: 12px;
}
.alink {
  text-decoration: none;
  out-line: none !important;
  line-height: 60px;
  color: #909399;
  margin-left: 20px;
}
.alink:focus {
  outline-style:none; -moz-outline-style: none;
}
.alink:hover {
  color: #303133;
}
</style>
