<template>
  <v-app>
    <div class="app">
      <Nevoa/>
      <template v-if="usuarioConectado" >
        <Header/>
        <Content />
        <Footer />
      </template>
      <template v-else>
        <Login/>
      </template>
    </div>
  </v-app>
</template>

<script>
import Header from "@/components/template/Header";
import Footer from "@/components/template/Footer";
import Content from "@/components/template/Content";
import Login from "@/components/auth/Login";
import Nevoa from "@/components/utils/nevoa";

import { mapState } from "vuex";
import { chaveUsuario } from "@/global";
export default {
  components: { Header, Footer, Content, Login, Nevoa },
  computed: {
    ...mapState(["usuario"]),
    usuarioConectado(){
      return (this.usuario && this.usuario.token);
    },
    usuarioRegistrado: function() {
      if(this.usuario && this.usuario.perfilUsuario){
        if (Object.keys(this.usuario.perfilUsuario).length > 0) {
          if (this.usuario.perfilUsuario.dataRegistro) {
            return true;
          }
        }
      }
      return false;
    }
  },
  methods: {
    verificaUsuario() {
      if (!this.usuario) {
        if (localStorage.getItem(chaveUsuario)) {
          this.$store.commit(
            "setUsuario",
            JSON.parse(localStorage.getItem(chaveUsuario))
          );
        }
      }
      if(this.usuarioConectado && !this.usuarioRegistrado && this.$route.name != 'Perfil'){
        this.$router.push("Perfil");
      }
    },
    usuarioDesconectado(){
      if(!this.usuarioConectado && this.$route.name != 'Login'){
        this.$router.push("login");
      }
    }
  },
  created: function() {
     this.verificaUsuario();
     this.usuarioDesconectado();
  }
};
</script>

<style src="@/assets/css/style.css">

</style>
