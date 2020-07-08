<template>
  <div class="">
      <transition name="fade">
        <div class="">
          <table id="example" class="display" cellspacing="0" width="100%" v-show="tableShow">
              <thead>
                <tr>
                  <th><input type="checkbox" :checked="data.length === $store.state.checked.length" class="inputcheckbox" name="select_all" @click="checkedAll"></th>
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
                  <td> <input type="checkbox" class="inputcheckbox" name="" v-model="$store.state.checked" :value="index"> </td>
                  <td>{{item.target_id}}</td>
                  <td>{{item.name}}</td>
                  <td>{{item.description}}</td>
                  <td>{{item.type}}</td>
                  <td>{{numFormat(item.baseMean)}}</td>
                  <td>{{item.log2FoldChange}}</td>
                  <td>{{item.pvalue}}</td>
                  <td>{{item.padj}}</td>
                </tr>
              </tbody>
          </table>
        </div>

    </transition>
  </div>

</template>

<script>
export default {
  data () {
    return {
      data: [],
      tableShow: false,
      isCheckedAll: false,
    }
  },
  components: {
  },
  mounted () {
    this.getTabelValue()
  },
  watch: {
    '$route': 'getTabelValueReset'
  },
  methods: {
    //  千分位
    numFormat (num) {
        num=num.toString().split(".");  // 分隔小数点
        var arr=num[0].split("").reverse();  // 转换成字符数组并且倒序排列
        var res=[];
        for(var i=0,len=arr.length;i<len;i++){
          if(i%3===0&&i!==0){
             res.push(",");   // 添加分隔符
          }
          res.push(arr[i]);
        }
        res.reverse(); // 再次倒序成为正确的顺序
        if(num[1]){  // 如果有小数的话添加小数部分
          res=res.join("").concat("."+num[1]);
        }else{
          res=res.join("");
        }
        return res;
    },
    // 全选 or 取消全选
    checkedAll () {
      if (this.data.length !== this.$store.state.checked.length && this.isCheckedAll === true) {
        this.isCheckedAll = true
      } else {
        this.isCheckedAll = !this.isCheckedAll
      }
      if(this.isCheckedAll) {
        this.$store.state.checked = []
        for (let i = 0; i < this.data.length; i++) {
          this.$store.state.checked.push(i)
        }
      } else {
        this.$store.state.checked = []
      }
    },
    getTabelValueReset () {
      let checkboxs = document.getElementsByClassName('inputcheckbox')
      for (let i = 0;i < checkboxs.length;i++) {
        checkboxs[i].checked = false
      }
      this.data = []
      this.$store.state.checked = []
      this.tableShow = false
      if ( $.fn.dataTable.isDataTable( '#example' ) ) {
        var dt = $('#example').DataTable();
        dt.destroy()
      }
      this.getTabelValue()
    },
    initTable (data) {
      let self = this
      this.data = data
      $(document).ready(function() {
          // $('#example').dataTable().fnDestroy()
          $('#example').DataTable( {
              lengthMenu: [[25, 50, 100, -1], [25, 50, 100, "All"]],
              pageLength: 25,
              columnDefs: [{
                'targets':   0,
                'orderable': false,
                'className': 'dt-body-center',
              }],
              order: [],
          } );
          self.tableShow = true
      });
    },
    getTabelValue () {
      let _case = sessionStorage.getItem('_case')
      let _control = sessionStorage.getItem('_control')
      this.axios.get('/server/deg?username=' + this.$store.state.username + '&p=' + this.$store.state.projectId + '&_case=' + _case + '&_control=' + _control + '&sig_only=true').then((res) => {
        if (res.data.message_type === 'success') {
          for (let i = 0;i < res.data.message.data.length;i++) {
            res.data.message.data[i].baseMean = parseFloat(res.data.message.data[i].baseMean).toFixed(3) - 0
            res.data.message.data[i].log2FoldChange = parseFloat(res.data.message.data[i].log2FoldChange).toFixed(3) - 0
            res.data.message.data[i].pvalue = parseFloat(res.data.message.data[i].pvalue).toFixed(3) - 0
            res.data.message.data[i].padj = parseFloat(res.data.message.data[i].padj).toFixed(3) - 0
          }
          this.initTable(res.data.message.data)
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
    backProjectList () {
      this.$router.push({'name': 'report'})
    },
  }
}
</script>

<style scoped="true">
.cursor-pointer{
  cursor: pointer;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.overflow-auto {
  overflow: auto;
}
</style>
