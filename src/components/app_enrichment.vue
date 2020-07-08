<template>
  <el-container style="height:calc(100% - 62px);margin-top:2px">
    <el-aside v-show="$store.state.appmenuShow" style="width:300px;height:100%;border-right:1px solid #e6e6e6">
      <appLeftMenu></appLeftMenu>
    </el-aside>
    <el-main>
      <appImgMenuShowComp></appImgMenuShowComp>

      <div class="">
        <h4>Choose Databases:</h4>
        <el-row>
          <el-col :span="8">
            <el-radio-group v-model="selected" @change="search()">
              <el-row>
                <el-col :span="24">
                  <h4>Pathway</h4>
                </el-col>
                <el-col :span="24">
                  <el-radio label="KEGG PATHWAY"></el-radio>
                </el-col>
                <el-col :span="24">
                  <el-radio label="Reactome"></el-radio>
                </el-col>
                <el-col :span="24">
                  <el-radio label="BioCyc"></el-radio>
                </el-col>
                <el-col :span="24">
                  <el-radio label="PANTHER"></el-radio>
                </el-col>
              </el-row>
            </el-radio-group>
          </el-col>
          <el-col :span="8">
            <el-col :span="24">
              <h4>Disease</h4>
            </el-col>
            <el-radio-group v-model="selected" @change="search()">
              <el-row>
                <el-col :span="24">
                  <el-radio label="OMIM"></el-radio>
                </el-col>
                <el-col :span="24">
                  <el-radio label="KEGG DISEASE"></el-radio>
                </el-col>
                <el-col :span="24">
                  <el-radio label="NHGRI GWAS Catalog"></el-radio>
                </el-col>
              </el-row>
            </el-radio-group>
          </el-col>
          <el-col :span="8">
            <el-radio-group v-model="selected" @change="search()">
              <el-row>
                <el-col :span="24">
                  <h4>GO</h4>
                </el-col>
                <el-col :span="24">
                  <el-radio label="Gene Ontology"></el-radio>
                </el-col>
                <el-col :span="24">
                  <el-radio label="Gene Ontology Slim"></el-radio>
                </el-col>
              </el-row>
            </el-radio-group>
          </el-col>
        </el-row>
        <br>

        <!-- <a :href="fileUrl" download ref="downloadA"></a>

        <el-button size="mini" type="primary" icon="el-icon-download" plain @click="exportTable()">导出</el-button> <br><br> -->

        <table id="example0" v-show="tableShow" cellspacing="0" width="100%" class="display table table-striped table-bordered">
            <thead>
              <tr>
                <th></th>
                <th>term</th>
                <th>database</th>
                <th>entryId</th>
                <th>inputNumber</th>
                <th>backgroundNumber</th>
                <th>pValue</th>
                <th>correctedPValue</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in data">
                <td class="details-control" @click="detailsClick(item[7], $event)"></td>
                <td>{{item[0]}}</td>
                <td>{{item[1]}}</td>
                <td><a :href="item[8]" target="_blank">{{item[2]}}</a></td>
                <td>{{item[3]}}</td>
                <td>{{item[4]}}</td>
                <td>{{item[5]}}</td>
                <td>{{item[6]}}</td>
              </tr>
            </tbody>
        </table>
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
      selected: 'KEGG PATHWAY',
      tableShow: false,
      data: [],
      table: null,
    }
  },
  components: {
    appLeftMenu,
    appImgMenuShowComp,
  },
  created () {
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      this.axios.get('/server/app_enrich?username=' + this.$store.state.username + '&randNum=' + sessionStorage.getItem('jobId') + '&type=' + this.selected).then((res) => {
        if (res.data.message_type === 'success') {
          this.data = res.data.message
          setTimeout(() => {
            this.table = $('#example0').DataTable({})
            this.tableShow = true
          }, 0)
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(e => {
        this.$message.error('请求出错，请联系网站管理员！')
      })
    },
    search () {
      this.tableShow = false
      this.data = []
      if ($.fn.dataTable.isDataTable('#example0')) {
        var dt = $('#example0').DataTable();
        dt.destroy()
        this.getData()
      }
    },
    detailsClick (data, e) {
      let _target = e.target

      var detailRows = [];

      var tr = $(_target).closest('tr');
      var row = this.table.row( tr );
      var idx = $.inArray( tr.attr('id'), detailRows );

      if ( row.child.isShown() ) {
          tr.removeClass( 'details' );
          row.child.hide();

          // Remove from the 'open' array
          detailRows.splice( idx, 1 );
      }
      else {
          tr.addClass( 'details' );
          this.getGeneName(data.split('|')).then( res => row.child(res).show() )

          // Add to the 'open' array
          if ( idx === -1 ) {
              detailRows.push( tr.attr('id') );
          }
      }

    },
    async getGeneName (list) {
      let geneName = ''
      let formData = new FormData()
      formData.append('geneInfoList', list)
      formData.append('speciesId', this.$store.state.species)
      formData.append('infoType', 1)
      await this.axios.post('/server/transform_gene_id_name', formData).then((res) => {
        geneName = res.data.join(' ')
      })
      return '<div class="detailDiv">' + geneName + '</div>'
    },
  }
}
</script>

<style scoped="true">
.margin-top-200 {
  margin-top: 200px;
}
.labelStyle {
  display:inline-block;
  width:200px;
  text-align:end;
}
.filterbtn {
  margin-left:240px;
  margin-top:-100px;
}
.label-font {
  font-size: 14px;
}
.input-style{
  margin-right: 20px;
  margin-top: 10px;
}
</style>
<style media="screen">
.color_scales {
  z-index: 9 !important;
}
.el-tabs__content {
  overflow: auto;
}

td.details-control {
  background: url('../assets/img/details_open.png') no-repeat center center;
  cursor: pointer;
}

tr.details td.details-control {
  background: url('../assets/img/details_close.png') no-repeat center center;
}

.font-overflow {
  word-break: break-all;
  word-wrap: break-word;
}

#example0_wrapper,
#example4_wrapper,
#example1_wrapper,
#example2_wrapper,
#example3_wrapper,
#example4_wrapper {
  overflow: auto !important;
}
</style>
