<template>
  <div id="app" v-if="userConnected" >
    <Header title="TIM" />
    <Content />
    <Footer />
  </div>
  <div id="app-login" v-else>
    <Login/>
  </div>
</template>

<script>
import Header from "@/components/template/Header";
import Footer from "@/components/template/Footer";
import Content from "@/components/template/Content";
import Login from "@/components/auth/Login";

import { mapState } from "vuex";
import { userKey } from "@/global";
export default {
  components: { Header, Footer, Content, Login },
  computed: {
    ...mapState(["user"]),
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

<style>
html{
  overflow-y: initial !important;
}
* {
  font-family: Roboto, "Helvetica Neue", Arial, "Droid Sans", sans-serif;
}
body {
  margin: 0;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  height: 100vh;

  display: grid;

  grid-template-rows: 60px 1fr 40px;
  grid-template-columns: 100vw;

  grid-template-areas:
    "header"
    "content"
    "footer";
}

a.v-tab{
  text-decoration:none; 
}
a.v-tab:hover{
  text-decoration:none; 
}


/* VALIDATION CSS */
.invalid-msg{
  width: 100%;
  margin-top: .25rem;
  font-size: 80%;
  color: #dc3545 !important;
}
select.invalid-element,
input.invalid-element{
  border-color: #dc3545 !important;
}
select.invalid-element:focus,
input.invalid-element:focus{
  box-shadow: 0 0 0 0.2rem rgb(218 120 110 / 25%);
}


.no-outline-focus:focus{
    outline: 0px;
}

div.v-dialog.v-dialog--active.dialog{
  padding: 0px;
  margin-right: 1rem;
  margin-left: 1rem;
  box-shadow: 0 0 black;
}
.containerPage{
    height: calc(100% - 60px);
    margin: 0.7rem 0px 0px 0rem;
}
</style>
