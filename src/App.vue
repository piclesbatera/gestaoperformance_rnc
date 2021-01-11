<template>
  <v-app>
    <div class="app">
      <Mist :visible="mistVisible" :activated="mist"></Mist>
      <template v-if="userConnected" >
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
import Mist from "@/components/utils/mist";

import { mapState } from "vuex";
import { userKey } from "@/global";
export default {
  components: { Header, Footer, Content, Login, Mist },
  computed: {
    ...mapState(["user", "mistVisible", "mist"]),
    userConnected(){
      return (this.user && this.user.token);
    }
  },
  methods: {
    verificaUsuario() {
      if (!this.user) {
        if (localStorage.getItem(userKey)) {
          this.$store.commit(
            "setUser",
            JSON.parse(localStorage.getItem(userKey))
          );
        }
      }
    },
    usuarioConectado(){
      if( 
        !(this.user && this.user.token)
        ){
        this.$router.push({ path: "/login" });
      }
    }
  },
  created: function() {
     this.verificaUsuario();
    //  this.usuarioConectado();
  }
};
</script>

<style src="@/assets/css/style.css">

</style>
