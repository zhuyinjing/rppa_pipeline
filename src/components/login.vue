<template>
  <div>
    <!-- <el-card class="box-card">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input type="text" v-model="form.username" auto-complete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input type="password" v-model="form.password" auto-complete="off" clearable></el-input>
        </el-form-item>
      </el-form>
      <div class="registerDivStyle">
        <span>没有账号？</span> <span class="register-font cursor-poiter" @click="register()">注 册</span>
      </div>
      <div style="float: right">
        <el-button type="primary" @click="login()">登 录</el-button>
      </div>
    </el-card> -->

    <el-dialog title="登 录" :visible.sync="loginDialog" width="400px">

    <el-form :model="form">
      <el-form-item label="用户名" :label-width="formLabelWidth">
        <el-input type="text" v-model="form.username" auto-complete="off" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth">
        <el-input type="password" v-model="form.password" auto-complete="off" clearable></el-input>
      </el-form-item>
    </el-form>
    <div class="" style="text-align:center">
      <span>没有账号？</span> <el-button type="text" @click="register()">注 册</el-button>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="loginDialog = false">取 消</el-button>
      <el-button type="primary" @click="login()">登 录</el-button>
    </div>
  </el-dialog>

  <register ref="registerDiv"></register>
  </div>
</template>

<script>
import navbar from './navbar.vue'
import register from './register.vue'

export default {
  data () {
    return {
      loginDialog: false,
        form: {
          username: '',
          password: ''
        },
        formLabelWidth: '60px'
    }
  },
  components: {
    navbar,
    register
  },
  mounted () {
  },
  methods: {
    login () {
      if (!this.form.username) {
        this.$message.error('用户名不能为空!')
      } else if(!this.form.password) {
        this.$message.error('密码不能为空!')
      } else {
        let formData = new FormData()
        formData.append('username', this.form.username)
        this.axios.post('/server/login', formData).then((res) => {
          console.log(res.data)
        })
      }
    },
    register () {
      this.$refs.registerDiv.registerDialog = true
      setTimeout(() => {
        this.loginDialog = false
      }, 0)
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
.box-card {
  width: 400px;
  height: 240px;
  margin: 20px auto;
}
.cursor-poiter {
  cursor: pointer;
}
.register-font {
  color: #409EFF;
}
.registerDivStyle {
  text-align:center;
  margin-bottom: 10px;
}
</style>
