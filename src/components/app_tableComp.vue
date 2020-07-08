<template>
  <div class="">
      <transition name="fade">
        <div class="">
          <table id="example" class="display" cellspacing="0" width="100%" v-show="tableShow">
              <thead>
                <tr>
                  <th>target_id</th>
                  <th>name</th>
                  <th>description</th>
                  <th>type</th>
                  <th>chr</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for='(item, index) in data'>
                  <td>{{item.targetId}}</td>
                  <td>{{item.name}}</td>
                  <td>{{item.description}}</td>
                  <td>{{item.type}}</td>
                  <td>{{item.chr}}</td>
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
  methods: {
    initTable (data) {
      let self = this
      this.data = data
      $(document).ready(function() {
          // $('#example').dataTable().fnDestroy()
          $('#example').DataTable( {
              lengthMenu: [[25, 50, 100, -1], [25, 50, 100, "All"]],
              pageLength: 25,
              dom: 'Bfrtip',
              'buttons': [{
                  extend: 'csv',
                  text: '导出 csv',
                },
                {
                  extend: 'excel',
                  text: '导出 excel',
                }
              ],
          } );
          self.tableShow = true
      });
    },
    getTabelValue () {
      let formData = new FormData()
      formData.append('username', this.$store.state.username)
      formData.append('infoType', sessionStorage.infoType)
      formData.append('geneInfo', sessionStorage.geneInfo)
      formData.append('speciesId', this.$store.state.species)
      this.axios.post('/server/get_gene_info_entity', formData).then((res) => {
        this.initTable(res.data)
      }).catch((e) => {
        this.$message.error('输入基因请求错误!')
      })
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
