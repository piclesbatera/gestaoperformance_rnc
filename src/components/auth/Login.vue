<template>
  <div class="login-content" v-if="loadingComponent" :style="{'background-image': `url(${require('@/assets/img/fibra_otica.png')})`}">
    <div class="login-form">
        <form @submit="conectar" >
        <div class="avatar">
          <img src="@/assets/img/logo.png" alt="Avatar">
        </div>
            <h2 class="text-center">Login</h2>   
            <div class="form-group">
              <label class="bmd-label-floating" for="username">
                <i class="fa fa-user"></i>
                Usuário
              </label>
              <input type="text" v-model="loginForm.login" class="form-control" name="username" placeholder="Usuário" required="required">
            </div>
            <div class="form-group">
              <label class="bmd-label-floating" for="username">
                    <i class="fa fa-key"></i>
                    Senha
                  </label>
                <input type="password" v-model="loginForm.senha" class="form-control" name="password" placeholder="Senha" required="required">
            </div>        
            <div class="form-group">
                <!-- <button type="submit" class="btn btn-primary btn-lg btn-block">Entrar</button> -->
                <v-btn
                    class="btn btn-primary form-control"
                    :loading="loadingLogin"
                    :disabled="loadingLogin"
                    color="blue"
                    type="submit"
                >
                Entrar
                </v-btn>
            </div>
        </form>
    </div>
  </div>
</template>

<script>
import { baseApi, chaveUsuario, showError } from "@/global";
import { mapState } from "vuex";
import axios from "axios";
export default {
  name: "Login",
  computed: {
    ...mapState(["usuario"])
  },
  data: function() {
    return {
      loginForm: {},
      loadingLogin: false,
      loadingComponent: false
    };
  },
  methods: {
    conectar() {
      event.preventDefault();
      this.loadingLogin = true;
      axios
        .post(`${baseApi}/login`, this.loginForm)
        .then(res => {
          this.$store.commit("setUsuario", res.data);
          localStorage.setItem(chaveUsuario, JSON.stringify(res.data));
          this.$toasted.global.defaultSuccess();
        })
        .catch(error => {
          showError(error);
        })
        .finally(() => {
          this.loadingLogin = false;
        });
    }
  },
  created: function(){
    if(this.usuario && this.usuario.token){
      this.$router.push("perfil");
    } else {
      this.loadingComponent = true;
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