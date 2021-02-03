<template>
  <div class="user-icons">
    <!-- USUARIO ICON -->
    <v-menu
      bottom
      min-width="200px"
      rounded
      offset-y >
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          x-large
          color="white"
          v-on="on"
        >
          <v-icon>fa fa-user</v-icon>
        </v-btn>
      </template>
      <v-card class="p-2">
          <div class="pt-2 mx-auto text-center">
            <h5>{{ usuario.nomeUsuario }}</h5>
            <p class="caption mt-1">
              {{ email }}
            </p>
            <template v-if="isGestor">
              <v-divider class="my-3"></v-divider>
              <v-btn
                text
                block
                to="gestao"
              >
                Gestão
              </v-btn>
            </template>
            <v-divider class="my-3"></v-divider>
            <v-btn
              text
              block
              to="perfil"
            >
              Perfil
            </v-btn>
            <v-divider class="my-3"></v-divider>
            <v-btn
              text
              block
              @click.prevent="logout"
            >
              Sair
            </v-btn>
          </div>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { chaveUsuario } from "@/global";
export default {
  name: "UserDropdown",
  computed: {
    ...mapState(["usuario"]),
    usuarioRegistrado: function() {
      if(this.usuario && this.usuario.perfilUsuario){
        if (Object.keys(this.usuario.perfilUsuario).length > 0) {
          if (this.usuario.perfilUsuario.dataRegistro) {
            return true;
          }
        }
      }
      return false;
    },
    isUsuarioTim: function(){
      return Boolean(this.usuarioRegistrado && this.usuario.perfilUsuario.usuarioTim);
    },
    isGestor: function(){
      return Boolean(this.isUsuarioTim && this.usuario.perfilUsuario.usuarioTim.gestor);
    },
    email: function(){
      var email = "";
      if(this.usuarioRegistrado && this.usuario.perfilUsuario && this.usuario.perfilUsuario.email){
        email = this.usuario.perfilUsuario.email;
      }
      return email;
    }
  },
  methods: {
    logout() {
      localStorage.removeItem(chaveUsuario);
      this.$store.commit("setUsuario", null);
      this.$toasted.global.defaultSuccess({
        msg: "Logout efetuado com sucesso!"
      });
      this.$router.push("login");
    }
  }
};
</script>

<style>
.user-icons {
  padding: 0px 20px 0px 0px;
}
</style>
