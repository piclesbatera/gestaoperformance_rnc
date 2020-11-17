<template>
  <div class="login-content" :style="{'background-image': `url(${require('@/assets/fibra_otica.png')})`}">
    <div class="login-top-part">
    <img alt="Logo TIM" src="@/assets/logo_email.png" style="padding-top: 10px; padding-bottom : 10px;">
     <div class="login-bottom-part">
    <input
    type="text"
    v-model="userCredentials.user"
    name="username"
    placeholder="Login de rede"
    style="margin-top:50px;"
    />
    <input
    type="password"
    v-model="userCredentials.password"
    name="password"
    placeholder="Senha"
    style="margin-top:10px;"
    />
    <input id="btn-login" type="button" @click="signin" value="Entrar"/>
    </div>
    </div>
  </div>
</template>

<script>
//import {Card,Row,Col} from 'bootstrap'

export default {
  name: "Login",
 data(){
     return {
         userCredentials: {}
     };
 },
 methods:{
   signin(){
     alert('Método de Login!!')
   }
 }

};
</script>

<style>
.login-content {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-bottom-part{
	background-color: #004691;
	height: 200px;
  width: 300px;
  border-radius : 0px 0px 30px 30px;
	text-align: right;
	font-family: Arial, Helvetica, sans-serif;
	font-size: 40px;
	color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  position: relative;
}
.login-top-part{
  background-color: #B4C4EE;
  border-radius : 30px 30px 0px 0px;
  height: 200px;
  width: 300px;
  box-sizing: border-box;
  align-items: center;
}

#btn-login{
  margin-top: 10px;
  align-self: center;
  width: 50px;
  height: 25px;
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  font-family: Arial, Helvetica, sans-serif;
  transition-duration: 0.4s;
  
}

</style>