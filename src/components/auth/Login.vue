<template>
  <div class="login-content" :style="{'background-image': `url(${require('@/assets/img/fibra_otica.png')})`}">
    <div class="login-form">
        <form @submit="signin" >
        <div class="avatar">
          <img src="@/assets/img/logo.png" alt="Avatar">
        </div>
            <h2 class="text-center">Login</h2>   
            <div class="form-group">
              <label class="bmd-label-floating" for="username">
                <i class="fa fa-user"></i>
                Usuário
              </label>
              <input type="text" v-model="userLogin.login" class="form-control" name="username" placeholder="Usuário" required="required">
            </div>
            <div class="form-group">
              <label class="bmd-label-floating" for="username">
                    <i class="fa fa-key"></i>
                    Senha
                  </label>
                <input type="password" v-model="userLogin.senha" class="form-control" name="password" placeholder="Senha" required="required">
            </div>        
            <div class="form-group">
                <button type="submit" class="btn btn-primary btn-lg btn-block">Entrar</button>
            </div>
        </form>
    </div>
  </div>
</template>

<script>
import { baseApi, userKey, showError } from "@/global";
import { mapState } from "vuex";
import axios from "axios";
export default {
  name: "Login",
  computed: {
    ...mapState(["user"])
  },
  data: function() {
    return {
      userLogin: {}
    };
  },
  methods: {
    signin() {
      event.preventDefault();
      axios
        .post(`${baseApi}/login`, this.userLogin)
        .then(res => {
          this.$store.commit("setUser", res.data);
          localStorage.setItem(userKey, JSON.stringify(res.data));
          this.$toasted.global.defaultSuccess();
          this.$router.push({ path: "/rnc" });
        })
        .catch(showError);
    }
  },
  created: function(){
    if(this.user && this.user.token){
      this.$router.push({ path: "/rnc" });
    }
  }
};
</script>

<style scoped>
.login-content {
  background-size: 100% 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}


.form-control:focus {
	border-color: #0b369adb;
}
.form-control, .btn {        
	border-radius: 2px;
}
.login-form {
	width: 350px;
	margin: 0 auto;
	padding: 100px 0 30px;		
}
.login-form form {
	color: #7a7a7a;
	border-radius: 2px;
	margin-bottom: 15px;
	font-size: 13px;
	background: #ececec;
	box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
	padding: 30px;	
	position: relative;	
}
.login-form h2 {
	font-size: 22px;
	margin: 35px 0 25px;
}
.login-form .avatar {
	position: absolute;
	margin: 0 auto;
	left: 0;
	right: 0;
	top: -50px;
	width: 95px;
	height: 95px;
	border-radius: 50%;
	z-index: 9;
	background: #0b369adb;
	padding: 15px;
	box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
}
.login-form .avatar img {
	width: 100%;
}	
.login-form input[type="checkbox"] {
	position: relative;
	top: 1px;
}
.login-form .btn, .login-form .btn:active {        
	font-size: 16px;
	font-weight: bold;
  color: #fff;
	background: #0b369adb !important;
	border: none;
	margin-bottom: 20px;
}
.login-form .btn:hover, .login-form .btn:focus {
	background: #0e42bccf !important;
}    
.login-form a {
	color: #fff;
	text-decoration: underline;
}
.login-form a:hover {
	text-decoration: none;
}
.login-form form a {
	color: #7a7a7a;
	text-decoration: none;
}
.login-form form a:hover {
	text-decoration: underline;
}
.login-form .bottom-action {
	font-size: 14px;
}

</style>