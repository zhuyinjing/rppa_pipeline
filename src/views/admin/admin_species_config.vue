<template>
  <div class="content">
    <el-tabs type="border-card">
      <el-tab-pane label="物种信息">
        <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="200px">
          <el-form-item label="id" prop="id">
            <el-input v-model="ruleForm2.id"></el-input>
          </el-form-item>
          <el-form-item label="Latin Name" prop="latinName">
            <el-input v-model="ruleForm2.latinName"></el-input>
          </el-form-item>
          <el-form-item label="Common Name" prop="commonName">
            <el-input v-model.number="ruleForm2.commonName"></el-input>
          </el-form-item>
          <el-form-item label="keggOrgCode" prop="keggOrgCode">
            <el-input v-model.number="ruleForm2.keggOrgCode"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm2('ruleForm2')">提交</el-button>
            <el-button @click="resetForm('ruleForm2')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="参考基因组">
        <el-form :model="ruleForm1" status-icon :rules="rules1" ref="ruleForm1" label-width="200px">
          <el-form-item label="物种 id" prop="id">
            <el-input v-model="ruleForm1.id"></el-input>
          </el-form-item>
          <el-form-item label="基因组 （genome）" prop="genome">
            <el-input v-model="ruleForm1.genome"></el-input>
          </el-form-item>
          <el-form-item label="转录组 （transcriptome）" prop="transcriptome">
            <el-input v-model.number="ruleForm1.transcriptome"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm1('ruleForm1')">提交</el-button>
            <el-button @click="resetForm('ruleForm1')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="基因注释">
        <el-form :model="ruleForm4" status-icon :rules="rules4" ref="ruleForm4" label-width="200px">
          <el-form-item label="物种 id" prop="id">
            <el-input v-model="ruleForm4.id"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm4('ruleForm4')">提交</el-button>
            <el-button @click="resetForm('ruleForm4')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="基因-转录组-蛋白 三元组">
        <el-form :model="ruleForm3" status-icon :rules="rules3" ref="ruleForm3" label-width="200px">
          <el-form-item label="id" prop="id">
            <el-input v-model="ruleForm3.id"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm3('ruleForm3')">提交</el-button>
            <el-button @click="resetForm('ruleForm3')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
export default {
    data() {
      var validateNotNull = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('不能为空'));
        } else {
          callback();
        }
      };
      return {
        ruleForm1: {
          id: '',
          genome: '',
          transcriptome: ''
        },
        rules1: {
          id: [
            { validator: validateNotNull, trigger: 'blur' }
          ],
          genome: [
            { validator: validateNotNull, trigger: 'blur' }
          ],
          transcriptome: [
            { validator: validateNotNull, trigger: 'blur' }
          ]
        },
        ruleForm2: {
          id: '',
          latinName: '',
          commonName: '',
          keggOrgCode: ''
        },
        rules2: {
          id: [
            { validator: validateNotNull, trigger: 'blur' }
          ],
          latinName: [
            { validator: validateNotNull, trigger: 'blur' }
          ],
          commonName: [
            { validator: validateNotNull, trigger: 'blur' }
          ],
          keggOrgCode: [
            { validator: validateNotNull, trigger: 'blur' }
          ]
        },
        ruleForm3: {
          id: ''
        },
        rules3: {
          id: [
            { validator: validateNotNull, trigger: 'blur' }
          ]
        },
        ruleForm4: {
          id: ''
        },
        rules4: {
          id: [
            { validator: validateNotNull, trigger: 'blur' }
          ]
        },
      };
    },
    methods: {
      submitForm1(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.get('/admin/create_refer_info?username=' + this.$store.state.username + '&speciesId=' + this.ruleForm1.id + '&genome=' + this.ruleForm1.genome + '&transcriptome=' + this.ruleForm1.transcriptome).then(res => {
              this.$message.info(res.data.message)
            })
          } else {
            return false;
          }
        });
      },
      submitForm2(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.get('/admin/create_species_info?username=' + this.$store.state.username + '&speciesId=' + this.ruleForm2.id + '&commonName=' + this.ruleForm2.commonName + '&commonName=' + this.ruleForm2.commonName + '&keggOrgCode=' + this.ruleForm2.keggOrgCode).then(res => {
              this.$message.info(res.data.message)
            })
          } else {
            return false;
          }
        });
      },
      submitForm3(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.get('/admin/create_centrol_dogma_triple?username=' + this.$store.state.username + '&speciesId=' + this.ruleForm3.id).then(res => {
              this.$message.info(res.data.message)
            })
          } else {
            return false;
          }
        });
      },
      submitForm4(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.get('/admin/create_gene_desc_info?speciesId=' + this.ruleForm4.id).then(res => {
              this.$message.info(res.data.message)
            })
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style scoped="true">
.content {
  width: 60%;
  margin: 19px auto;
}
</style>
