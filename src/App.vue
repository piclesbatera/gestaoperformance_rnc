<template>
  <v-app>
    <div class="app">
      <Nevoa :visivel="nevoaVisivel" :ativo="nevoa"/>
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
    ...mapState(["usuario", "nevoaVisivel", "nevoa"]),
    usuarioConectado(){
      return (this.usuario && this.usuario.token);
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
    },
    usuarioDesconectado(){
      if(!this.usuarioConectado){
        this.$router.push({ path: "/login" });
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
