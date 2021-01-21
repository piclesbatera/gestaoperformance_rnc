<template>
  <header class="header">
    <h1 class="title">{{ title }}</h1>
    <span v-if="usuario && usuario.perfilUsuario" class="d-none d-sm-block welcome-label">Olá, {{ nomeUsuario }}</span>
    <UserIcons />
  </header>
</template>

<script>
import { mapState } from "vuex";
import UserIcons from "./UserIcons";
export default {
  name: "Header",
  components: { UserIcons },
  props: {
    
  },
  computed: {
    ...mapState(["usuario"]),
    title: function(){
      return process.env.VUE_APP_TITLE;
    },
    nomeUsuario: function(){
      if (Object.keys(this.usuario.perfilUsuario).length > 0 && Object.keys(this.usuario.perfilUsuario.usuarioTim).length > 0 && this.usuario.perfilUsuario.dataRegistro && this.usuario.perfilUsuario.usuarioTim.primeiroNome){
        return this.usuario.perfilUsuario.usuarioTim.primeiroNome;
      } else {
        return this.usuario.nomeUsuario;
      }
    }
  },
  methods: {
  }
};
</script>

<style scoped>
.welcome-label{
  font-weight: 900;
  padding: 0 10px 0px 0px;
  color: #fff;
}
.header {
  grid-area: header;
  background-color: #1e469a;

  display: flex;
  justify-content: center;
  align-items: center;
}
.title {
  font-size: 1.2rem;
  font-weight: 900;
  text-align: center;
  flex-grow: 1;
  color: #fff;
  margin: 0;
}

</style>
