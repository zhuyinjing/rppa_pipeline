// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import vueAxios from 'vue-axios'
import store from './store/store'
import 'datatables/media/css/jquery.dataTables.min.css'
import 'datatables/media/js/jquery.dataTables.min.js'
import Highcharts from 'highcharts/highstock';
import HighchartsMore from 'highcharts/highcharts-more';
import Highmaps from 'highcharts/modules/map';
import 'datatables.net-bs';
import jsZip from 'jszip';
import 'datatables.net-buttons-bs';
import 'datatables.net-buttons/js/buttons.colVis.min';
import 'datatables.net-buttons/js/dataTables.buttons.min';
import 'datatables.net-buttons/js/buttons.flash.min';
import 'datatables.net-buttons/js/buttons.html5.min';
window.JSZip = jsZip;

// 国际化
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
const i18n = new VueI18n({
  // locale: LangStorage.getLang('zh'),  // 语言标识，后面会用做切换和将用户习惯存储到本地浏览器
  locale: localStorage.language?localStorage.language:'zh', // 语言标识
  messages: {
    'zh': require('./common/lang/zh'),
    'en': require('./common/lang/en')
  }
})

import {
  Dialog,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  Switch,
  Select,
  Option,
  OptionGroup,
  Button,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tag,
  Alert,
  Icon,
  Progress,
  Card,
  Loading,
  MessageBox,
  Message,
  Slider,
  Row,
  Col,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Upload,
  Container,
  Header,
  Aside,
  Main,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DatePicker,
  Carousel,
  CarouselItem,
  Steps,
  Step
} from 'element-ui';

HighchartsMore(Highcharts)
Highmaps(Highcharts);
Vue.use(Dialog);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Switch);
Vue.use(Select);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Button);
Vue.use(Tooltip);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Tabs);
Vue.use(Tag);
Vue.use(Alert);
Vue.use(Icon);
Vue.use(Progress);
Vue.use(Card);
Vue.use(TabPane);
Vue.use(Slider);
Vue.use(Row);
Vue.use(Col);
Vue.use(Checkbox);
Vue.use(CheckboxButton);
Vue.use(CheckboxGroup);
Vue.use(Upload);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Loading.directive);
Vue.use(DatePicker);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Step);
Vue.use(Steps);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$message = Message;

if (sessionStorage.username) {
  store.state.username = sessionStorage.username
}
if (sessionStorage.role) {
  store.state.role = sessionStorage.role
}
if (sessionStorage.projectId) {
  store.state.projectId = sessionStorage.projectId
}
if (sessionStorage.projectName) {
  store.state.projectName = sessionStorage.projectName
}
// 侧边栏li的点击颜色
if (sessionStorage.leftMenuIndex) {
  store.state.leftMenuIndex = sessionStorage.leftMenuIndex
}
// 侧边栏动态内容
if (sessionStorage.info) {
  store.state.info = JSON.parse(sessionStorage.info)
}
// heatmap,ppi, geneList 输入
if (sessionStorage.geneList) {
  store.state.geneList = JSON.parse(sessionStorage.geneList)
}
// heatmap json
if (sessionStorage.heatmapJson) {
  store.state.heatmapJson = JSON.parse(sessionStorage.heatmapJson)
}
// ppi json
if (sessionStorage.ppiJson) {
  store.state.ppiJson = JSON.parse(sessionStorage.ppiJson)
}
if (sessionStorage._case) {
  store.state._case = sessionStorage._case
}
if (sessionStorage._control) {
  store.state._control = sessionStorage._control
}
if (sessionStorage.species) {
  store.state.species = sessionStorage.species
}
if (sessionStorage.degGeneSum) {
  store.state.degGeneSum = sessionStorage.degGeneSum
}
if (sessionStorage.degFilterArgs) {
  store.state.degFilterArgs = JSON.parse(sessionStorage.degFilterArgs)
}
if (sessionStorage.menuShow) {
  store.state.menuShow = JSON.parse(sessionStorage.menuShow)
}
if (sessionStorage.appmenuShow) {
  store.state.appmenuShow = JSON.parse(sessionStorage.appmenuShow)
}
if (sessionStorage.projectType) {
  store.state.projectType = sessionStorage.projectType
}

axios.get('/getUser').then((res) => {
  store.commit('setusername', res.data.username)
  // 判断权限列表里是否存在 ADMIN
  let role = res.data.authorities.some(item => item.authority === 'ADMIN' || item.authority === 'ROLE_ADMIN')
  if (role) {
    store.commit('setrole', 'ADMIN')
  } else {
    store.commit('setrole', 'USER')
  }

  // 路由权限判断
  router.beforeEach((to, from, next) => {
    if (to.path === '/') {  // 只有刚进入首页的时候，清空 indexedDB，其他页面刷新时，不清空
      let db
      var request = indexedDB.open("deg")
      request.onerror =  (e) => {}
      request.onupgradeneeded = (e) => {
        db = e.target.result
        var objectStore = db.createObjectStore("degTable", {keyPath:'name', autoIncrement:true})
      }
      request.onsuccess = (e) => {
        console.log("success!");
        db = e.target.result
        var tx = db.transaction(["degTable"],"readwrite")
        var store = tx.objectStore("degTable")
        store.clear()
      }
      request.onerror = (e) => {
        console.log("error!");
      }
      next()
    }
    if (to.meta.role) { // 需要权限的页面
      if (to.meta.role === store.state.role) {
        next()
      } else {  // 权限不够的页面
        Message.error('抱歉，您将要访问的页面权限不够！')
        next({name: from.name})
      }
    } else {  // 不需要权限的页面
      next()
    }
  })

})

Vue.use(vueAxios, axios)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})
