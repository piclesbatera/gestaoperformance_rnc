<template>
    <div id="vuetify-menu-content" >
        <v-card v-if="acesso">
          <v-tabs
              :optional="true"
              dark
              background-color="#1e469a"
              show-arrows>
              <v-tabs-slider color="teal lighten-4"></v-tabs-slider>
      
              <!-- <v-tab to="/" style="display:none;">Home</v-tab> -->
              <v-tab to="/gestaoPerformance">Gestão de Performance</v-tab>
              <v-tab to="/rnc">RNC</v-tab>
          </v-tabs>
        </v-card>
    </div>
</template>

<script>
import { mapState } from "vuex";
export default {
   name: "menu-tab",
   computed: {
     ...mapState(["usuario"]),
     usuarioRegistrado: function() {
      if (Object.keys(this.usuario.perfilUsuario).length > 0) {
        if (this.usuario.perfilUsuario.dataRegistro) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    acesso: function() {
      if (this.usuarioRegistrado) {
        return this.usuario.perfilUsuario.acesso;
      } else {
        return false;
      }
    }
   },
   data: function() {
    return {
    };
  },
  methods: {
    
  }
};
</script>

<style>
#vuetify-menu-content{
  max-width: 100%;
  background-color: #f7f7f7;
}

</style>