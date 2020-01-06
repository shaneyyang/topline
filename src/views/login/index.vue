<template>
  <div class="login-container">
      <div class="login-box">
        <!-- Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可。 -->
                <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
                  <img src="./logo_index.png" alt="">
          <el-form-item prop="mobile">
            <el-input v-model="loginForm.mobile" placeholder="请输入手机号码" ></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input v-model="loginForm.code"  placeholder="请输入校验码" ></el-input>
          </el-form-item>
          <el-form-item style="text-align:left;" prop="xieyi">
            <el-checkbox v-model="loginForm.xieyi" style="margin-right:10px;"></el-checkbox>
            <span>我已阅读并同意用户协议和隐私条款</span>
          </el-form-item>
          <el-form-item>
            <el-button style="width:100%;" type="primary" @click="login()">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
  </div>
</template>

<script>
// 引入gt.js文件
import './gt.js'
export default {
  data () {
    // 自定义校验函数，验证协议
    var xieyiTest = function (rule, value, callback) {
      value ? callback() : callback(new Error('请确认是否已经阅读协议'))
    }
    return {
      loginForm: {
        mobile: '18380448038',
        code: '246810',
        xieyi: false
      },
      // 返回规则
      loginFormRules: {
        mobile: [
          // 校验是否填入号码
          { required: true, message: '手机号码必填' },
          // 正则：校验手机号码合法性
          { pattern: /^1[35789]\d{9}$/, message: '手机号码格式不对' }

        ],
        code: [
          { required: true, message: '验证码必填' }
        ],
        xieyi: [
          // 复选框需要自定义校验规则
          { validator: xieyiTest }
        ]
      }
    }
  },
  methods: {
    login () {
      // 获取表单对象this.$refs.loginFormRef
      this.$refs.loginFormRef.validate(valid => {
        // valid:true 校验通过
        // valid:false 校验失败
        // 校验失败，代码停止
        if (!valid) { return false }
      })
      // 人机交互验证，向后台发送axios请求
      let pro = this.$http({
        url: '/mp/v1_0/captchas/' + this.loginForm.mobile,
        method: 'get'
      })
      pro.then(result => {
        // console.log(result)
        // 从result中解构赋值
        let { data } = result.data
        // 参考文档，调用函数
        window.initGeetest({
          // 以下配置参数来自服务端SDK
          gt: data.gt,
          challenge: data.challenge,
          offline: !data.success,
          new_captcha: true,
          product: 'bind'
        }, captchaObj => {
          captchaObj.onReady(() => {
            // 验证码ready之后才能调用verify方法显示验证码
            captchaObj.verify() // 显示验证码
          }).onSuccess(() => {
            this.loginAct()
          }).onError(() => {
          })
        })
      })
        .catch(err => {
          return this.$message.error('获取极验秘钥失败' + err)
        })
    },
    loginAct () {
      // 服务器端检测账号真实性
      let pro = this.$http({
        url: '/mp/v1_0/authorizations',
        method: 'POST',
        data: this.loginForm
      })
      pro.then(result => {
        // console.log(result)
        // 客户端浏览器把从服务器获取到的秘钥进行记录
        window.sessionStorage.setItem('userinfo', JSON.stringify(result.data.data))

        // 路由编程式导航
        // this.$router.push('/home') // 路由地址 实现导航
        this.$router.push({ name: 'home' }) // name属性实现编程式导航
      })
        .catch(err => { return this.$message.error('手机号码或验证码错误' + err) })
        // error是Element里面封装好的用法，弹窗
    }
  }
}
</script>

<style lang="less" scoped>
.login-container{
  height:100%;
  background-color: gray;
  background-image:url('./login_bg.jpg');
  background-size: cover;
  display:flex;
  justify-content: center;
  align-items: center;
  .login-box{
      width:410px;
      height:345px;
      background-color: #fff;
      display:flex;
      justify-content: center;
      align-items: center;
      text-align:center;
      img {
        width:50%;
        margin:20px auto;
      }
      .el-form{
        width:75%;
      }
  }
}
</style>
