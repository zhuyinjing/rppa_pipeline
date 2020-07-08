<template>
<div class="">
    <imgMenuShowComp></imgMenuShowComp>

    <div class="" v-loading="tableLoading" element-loading-text="数据正在加载中，大概需要1分钟左右的时间......">
      <degComp></degComp>

      <el-card class="" style="width:900px;" shadow="hover">
        <div class="" style="display:inline-block;width:42%;vertical-align:top;">
          <div class="">
            <div class="labelStyle">
              <label for="maxpval" class="label-font">pvalue &le;</label>
            </div>
            <input type="text" id="maxpval" :placeholder="originFilterArgs.pvalue" class="input-style" v-model="maxpval" />
          </div>
          <div class="">
            <div class="labelStyle">
              <label for="maxfdr" class="label-font">FDR &le;</label>
            </div>
            <input type="text" id="maxfdr" :placeholder="originFilterArgs.FDR" class="input-style" v-model="maxfdr" />
          </div>
          <div class="">
            <div class="labelStyle">
              <label for="minfc" class="label-font">log2FoldChange({{$t('deg.abs')}}) &ge;</label>
            </div>
            <input type="text" id="minfc" :placeholder="originFilterArgs.log2FoldChange" class="input-style" v-model="minfc" />
          </div>
        </div>
        <div class="" style="display:inline-block;width:22%;vertical-align:top;">
          <div class="">
            <div class="">
              <label class="radio-inline control-label">type：</label>
            </div> <br>
            <el-radio v-model="typeRadio" label="protein_coding">{{$t('deg.show_coding')}}</el-radio>
          </div>
          <div class="">
            <div class="labelStyle">
              <label class="radio-inline control-label"></label>
            </div> <br>
            <el-radio v-model="typeRadio" label="all">{{$t('deg.show_all_type')}}</el-radio>
          </div>
        </div>
        <div class="" style="display:inline-block;width:29%;vertical-align:top;">
          <div class="">
            <div class="">
              <label class="radio-inline control-label">{{$t('deg.show')}}：</label>
            </div>
            <el-checkbox class="input-style" v-model="checkedUp">{{$store.state._case}} {{$t('deg.up')}}</el-checkbox>
          </div>
          <div class="">
            <div class="labelStyle"></div>
            <el-checkbox class="input-style" v-model="checkedDown">{{$store.state._case}} {{$t('deg.down')}}</el-checkbox>
          </div>
        </div>
        <div class="filterbtnDiv">
          <el-button type="primary" @click="filterTable()">{{$t('button.filter')}}</el-button>
          <el-button type="danger" :disabled="savedisabled" @click="saveData()">{{$t('button.save_filter')}}</el-button>
          <el-button type="info" @click="resetData()">{{$t('button.reset')}}</el-button>
        </div>
      </el-card>
      <br>
      <transition name="fade">
        <div class="">
          <table id="exampledeg" class="display" cellspacing="0" width="100%" v-show="tableShow">
            <thead>
              <tr>
                <!-- <th><input type="checkbox" :checked="data.length === checked.length" class="inputcheckbox" name="select_all" @click="checkedAll"></th> -->
                <th>target_id</th>
                <th>name</th>
                <th>description</th>
                <th>type</th>
                <th>baseMean</th>
                <th>log2FoldChange</th>
                <th>pvalue</th>
                <th>FDR</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for='(item, index) in data'>
                <!-- <td> <input type="checkbox" class="inputcheckbox" name="" v-model="checked" :value="data[index]"> </td> -->
                <td>{{item.target_id}}</td>
                <td>{{item.name}}</td>
                <td>{{item.description}}</td>
                <td>{{item.type}}</td>
                <td>{{numFormat(parseFloat(item.baseMean).toFixed(0))}}</td>
                <td>{{item.log2FoldChange === '-Inf' || item.log2FoldChange === 'Inf' ? item.log2FoldChange : parseFloat(item.log2FoldChange).toFixed(3)}}</td>
                <td>{{item.pvalue ? num2e(item.pvalue) : num2e(item.pval)}}</td>
                <td>{{num2e(item.padj)}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import degComp from './degComp.vue'
import imgMenuShowComp from './imgMenuShowComp.vue'

export default {
  data() {
    return {
      data: [],
      checked: [],
      displayByFC: '0',
      maxpval: null,
      maxfdr: null,
      minfc: null,
      tableShow: false,
      isCheckedAll: false,
      loading: null,
      checkedUp: true,
      checkedDown: true,
      typeRadio: 'all',
      originFilterArgs: {},
      savedisabled: false,
      tableLoading: false,
      db: null,
    }
  },
  components: {
    degComp,
    imgMenuShowComp
  },
  mounted() {
    this.getTabelValue()
  },
  destroyed() {
    this.resetFilter()
  },
  watch: {
    '$route': 'getTabelValueReset2'
  },
  methods: {
    saveData() {
      let table = $('#exampledeg').DataTable()
      let data = []
      table.column(0, {
        search: 'applied'
      }).data().each(function(value, index) {
        data.push(value)
      })
      if (data.length === 0) {
        this.$message.warning('保存列表不能为空！');
        return
      }
      data = data.join(",")
      this.$confirm('确认保存筛选后的数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.loading = this.$loading({
          lock: true,
          text: '正在保存中...请稍等...可能需要等待1～2分钟左右的时间...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        let formData = new FormData()
        let geneVarInfo = {
          pvalue: this.maxpval ? this.maxpval : this.originFilterArgs.pvalue,
          FDR: this.maxfdr ? this.maxfdr : this.originFilterArgs.FDR,
          log2FoldChange: this.minfc ? this.minfc : this.originFilterArgs.log2FoldChange
        }
        formData.append('username', this.$store.state.username)
        formData.append('p', this.$store.state.projectId)
        formData.append('caseSample', this.$store.state._case)
        formData.append('controlSample', this.$store.state._control)
        formData.append('degList', data)
        formData.append('degFilterParams', JSON.stringify(geneVarInfo))
        formData.append('species', this.$store.state.species)
        this.axios.post('/server/save_deg_list', formData).then((res) => {
          if (res.data.message_type === 'success') {
            this.getStatus()
          }
        })
      }).catch(() => {});
    },
    resetData() {
      this.$confirm('确认恢复原始列表吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.loading = this.$loading({
          lock: true,
          text: '正在恢复中...请稍等...可能需要等待1～2分钟左右的时间...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        let formData = new FormData()
        formData.append('username', this.$store.state.username)
        formData.append('p', this.$store.state.projectId)
        formData.append('caseSample', this.$store.state._case)
        formData.append('controlSample', this.$store.state._control)
        this.axios.post('/server/reset_default_deg_list', formData).then((res) => {
          if (res.data.message_type === 'success') {
            this.getStatus()
          }
        })
      }).catch(() => {});
    },
    getStatus() {
      this.timer = setInterval(() => {
        this.axios.get('/server/deg_list_status?username=' + this.$store.state.username + '&p=' + this.$store.state.projectId + '&caseSample=' + this.$store.state._case + '&controlSample=' + this.$store.state._control).then((res) => {
          if (res.data.message_type === 'success') {
            this.loading.close()
            this.$message.success(res.data.message)
            window.clearInterval(this.timer)
            this.getTabelValueReset()
          }
        })
      }, 1000)
    },
    //  千分位
    numFormat(num) {
      num = num.toString().split("."); // 分隔小数点
      var arr = num[0].split("").reverse(); // 转换成字符数组并且倒序排列
      var res = [];
      for (var i = 0, len = arr.length; i < len; i++) {
        if (i % 3 === 0 && i !== 0) {
          res.push(","); // 添加分隔符
        }
        res.push(arr[i]);
      }
      res.reverse(); // 再次倒序成为正确的顺序
      if (num[1]) { // 如果有小数的话添加小数部分
        res = res.join("").concat("." + num[1]);
      } else {
        res = res.join("");
      }
      return res;
    },
    // 科学计数法
    num2e(num) {
      var p = Math.floor(Math.log(num) / Math.LN10)
      var n = num * Math.pow(10, -p)
      return n.toFixed(1) + 'e' + p
    },
    // 全选 or 取消全选
    checkedAll() {
      if (this.data.length !== this.checked.length && this.isCheckedAll === true) {
        this.isCheckedAll = true
      } else {
        this.isCheckedAll = !this.isCheckedAll
      }
      if (this.isCheckedAll) {
        this.checked = []
        this.data.forEach(function(data) {
          this.checked.push(data)
        }, this)
      } else {
        this.checked = []
      }
    },
    resetFilter() {
      this.maxpval = null
      this.maxfdr = null
      this.minfc = null
      this.displayByFC = '0'
      this.checked = []
      this.filterTable()
    },
    getTabelValueReset() {
      let checkboxs = document.getElementsByClassName('inputcheckbox')
      for (let i = 0; i < checkboxs.length; i++) {
        checkboxs[i].checked = false
      }
      this.data = []
      this.checked = []
      this.tableShow = false
      this.typeRadio = 'all'
      this.resetFilter()
      if ($.fn.dataTable.isDataTable('#exampledeg')) {
        var dt = $('#exampledeg').DataTable();
        dt.destroy()
      }
      // 删除 indexeddb 里的表
      var tx = this.db.transaction(['degTable'], 'readwrite')
      var req = tx.objectStore('degTable').delete('deg' + this.$store.state._case + this.$store.state._control)
      this.getTabelValue()
    },
    getTabelValueReset2() {
      let checkboxs = document.getElementsByClassName('inputcheckbox')
      for (let i = 0; i < checkboxs.length; i++) {
        checkboxs[i].checked = false
      }
      this.data = []
      this.checked = []
      this.tableShow = false
      this.typeRadio = 'all'
      this.resetFilter()
      if ($.fn.dataTable.isDataTable('#exampledeg')) {
        var dt = $('#exampledeg').DataTable();
        dt.destroy()
      }
      this.getTabelValue()
    },
    filterTable() {
      let self = this
      $.fn.dataTable.ext.search.push(
        function(settings, data, dataIndex) {
          var maxPVAL = parseFloat(self.maxpval);
          var maxFDR = parseFloat(self.maxfdr);
          var minFC = parseFloat(self.minfc);
          var pval = parseFloat(data[6]);
          var fc = parseFloat(data[5]);
          var fdr = parseFloat(data[7]);
          var type = data[3];
          if (!isNaN(maxPVAL) && pval > maxPVAL) {
            return false;
          }
          if (!isNaN(maxFDR) && fdr > maxFDR) {
            return false;
          }
          if (!isNaN(minFC) && Math.abs(fc) < minFC) {
            return false;
          }
          // type protein_coding or non_coding
          if (self.typeRadio === 'protein_coding') {
            if (type !== 'protein_coding') {
              return false
            }
          }
          // show up or down
          if (self.checkedUp === self.checkedDown) {
            return true;
          } else if (self.checkedUp === true) {
            if (fc < 0) {
              return false;
            }
          } else if (self.checkedDown === true) {
            if (fc > 0) {
              return false;
            }
          }
          return true;
        }
      );
      var table = $('#exampledeg').DataTable();

      table.draw()

      let degFilterData = table.column(0, {
        search: 'applied'
      }).data()
      // 判断 degFilterData 是否存在 是为了 在没有进行筛选时 页面 destroyed 会报错 length undefined
      if (degFilterData) {
        let degGeneSum = degFilterData.length
        let degFilterArgs = {
          pvalue: self.maxpval ? self.maxpval : this.originFilterArgs.pvalue,
          FDR: self.maxfdr ? self.maxfdr : this.originFilterArgs.FDR,
          log2FoldChange: self.minfc ? self.minfc : this.originFilterArgs.log2FoldChange
        }
        self.$store.commit("setdegGeneSum", degGeneSum)
        self.$store.commit("setdegFilterArgs", degFilterArgs)
      }
    },
    initTable (data) {
      let self = this

      this.data = data

      $.fn.dataTable.ext.type.order['value-abs-pre'] = function ( d ) { // log2FoldChange 按照绝对值进行排序
        var v = Math.abs(d);
        return v;
      };

      $(document).ready(function() {
        $('#exampledeg').DataTable({
          columnDefs: [
            {
              targets: 0,
              orderData: [5, 4, 7, 6]  //如果第一列进行排序，有相同数据则按照第 6 列顺序排列
            },
            {
              targets: 5,
              type: "value-abs",
            }
          ],
          "order": [[ 5, "desc" ],[ 4, "desc" ]],
          lengthMenu: [
            [25, 50, 100, -1],
            [25, 50, 100, "All"]
          ],
          pageLength: 25,
          dom: 'Bfrtip',
          buttons: [{
              extend: 'csv',
              text: '导出 csv',
              filename: 'ColorSeq' + ' ' + self.$store.state._case + ' vs ' + self.$store.state._control
            },
            {
              extend: 'excel',
              text: '导出 excel',
              filename: 'ColorSeq' + ' ' + self.$store.state._case + ' vs ' + self.$store.state._control
            },
            {
              extend: 'copy',
              text: '复制所有',
              header: false,  // header 不复制
              title: null,    // 不显示 网页的 title
            },
            {
              extend: 'copy',
              text: '复制 ID',
              exportOptions: {
                columns: [0]
              },
              header: false,
              title: null,
            },
          ]
        });
        self.tableShow = true
      });
    },
    getTabelValue () {
      let _case = sessionStorage.getItem('_case')
      let _control = sessionStorage.getItem('_control')
      this.tableLoading = true

      let dbName = "deg"
      var request = indexedDB.open(dbName)
      request.onupgradeneeded = (e) => {
        this.db = e.target.result
        var objectStore = this.db.createObjectStore("degTable", {
          keyPath: 'name',
          autoIncrement: true
        })
      }
      request.onsuccess = (e) => {
        console.log("success!");
        this.db = e.target.result
        var tx = this.db.transaction(['degTable'], 'readwrite');
        var store = tx.objectStore('degTable');
        var req = store.get('deg' + _case + _control);
        req.onsuccess = (e) => {
          var degData = e.target.result;
          if (!degData) {
            this.axios.get('/server/deg?username=' + this.$store.state.username + '&p=' + this.$store.state.projectId + '&_case=' + _case + '&_control=' + _control + '&sig_only=true').then((res) => {
              if (res.data.message_type === 'success') {
                this.tableLoading = false
                this.initTable(res.data.message.data)
                // deg 列表存到 indexedDB 里
                let temp = {
                  name: 'deg' + _case + _control,
                  value: res.data.message.data,
                  degFilterArgs: res.data.message.param
                }
                // 开启一个事务
                var tx = this.db.transaction(['degTable'], 'readwrite');
                var store = tx.objectStore('degTable');
                var req = store.get('deg' + _case + _control);
                req.onsuccess = (e) => {
                  store.add(temp);
                }
                // degGeneSum 存在缓存中 筛选条件card 显示
                this.$store.commit("setdegGeneSum", res.data.message.data.length)
                this.originFilterArgs = res.data.message.param
                this.$store.commit("setdegFilterArgs", res.data.message.param)
              } else {
                this.tableLoading = false
                this.$message.error(res.data.message);
              }
            })
          } else {
            this.tableLoading = false
            this.$store.commit("setdegGeneSum", degData.value.length)
            this.originFilterArgs = degData.degFilterArgs
            this.$store.commit("setdegFilterArgs", degData.degFilterArgs)
            this.initTable(degData.value)
          }
        }
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
  color: #666;
}

.label-font {
  font-size: 14px;
}

.input-style {
  height: 20px;
  /* margin-right: 20px; */
  margin-top: 10px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to
/* .fade-leave-active below version 2.1.8 */

  {
  opacity: 0;
}

.margin-bottom-20 {
  margin-bottom: 20px;
}

.overflow-auto {
  overflow: auto;
}

.labelStyle {
  display: inline-block;
  width: 170px;
  text-align: end;
}

.filterbtnDiv {
  float: right;
  margin-bottom: 10px;
}

.text-align-center {
  text-align: center;
}
</style>
