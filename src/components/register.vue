<template>
  <div>
    <el-dialog title="注 册" :visible.sync="registerDialog" width="400px">

    <el-form :model="form" >
      <el-form-item label="用户名" :label-width="formLabelWidth">
        <el-input type="text" v-model="form.username" auto-complete="off" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth">
        <el-input type="password" v-model="form.password" auto-complete="off" clearable></el-input>
      </el-form-item>
      <el-form-item label="确认密码" :label-width="formLabelWidth">
        <el-input type="password" v-model="form.surepassword" auto-complete="off" clearable></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="registerDialog = false">取 消</el-button>
      <el-button type="primary" @click="register()">注 册</el-button>
    </div>
  </el-dialog>
  </div>
</template>

<script>
import navbar from './navbar.vue'
export default {
  data () {
    return {
      registerDialog: false,
        form: {
          username: '',
          password: '',
          surepassword: ''
        },
        formLabelWidth: '120px'
    }
  },
  components: {
    navbar
  },
  mounted () {
  },
  methods: {
    register () {
      if (!this.form.username) {
        this.$message.error('用户名不能为空!')
      } else if(!this.form.password) {
        this.$message.error('密码不能为空!')
      } else if(!this.form.surepassword) {
        this.$message.error('确认密码不能为空!')
      } else {
        let formData = new FormData()
        formData.append('username', this.form.username)
        formData.append('password', this.form.password)
        this.axios.post('/server/login', formData).then((res) => {
          console.log(res.data)
        })
      }
      this.registerDialog = false
    }
  }
}
</script>

<style scoped="true">
.imgStyle {
  width: 200px;
  height: 200px;
  margin: 0 auto;
}
.textStyle {
  text-align: center;
}
</style>
