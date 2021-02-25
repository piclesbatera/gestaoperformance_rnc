<template>
  <v-card id="vuetify-tab-content">
    <v-toolbar color="blue" dark flat>
      <v-toolbar-title>Área da Gestão</v-toolbar-title>

      <template v-slot:extension>
          <v-tabs
            v-model="tab"
            dark
            background-color="blue"
            show-arrows>
            <v-tabs-slider color="teal lighten-4"></v-tabs-slider>
            <v-tab :href="'#usuarios'">Usuários</v-tab>
            <v-tab :href="'#analiseRncs'">Penalidade RNCs</v-tab>
          </v-tabs>
      </template>
    </v-toolbar>
    <v-tabs-items v-model="tab" touchless>
        <v-tab-item :value="'usuarios'">
            <v-card flat>
                <v-card-text>
                  <Usuarios />
                </v-card-text>
            </v-card>
        </v-tab-item>
        <v-tab-item :value="'analiseRncs'">
            <v-card flat>
                <v-card-text>
                  <AnaliseRnc />
                </v-card-text>
            </v-card>
        </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import { mapState } from "vuex";
import Usuarios from './usuarios' 
import AnaliseRnc from './analiseRnc'
export default {
  name: "paginaGestao",
  components: { Usuarios, AnaliseRnc },
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
  },
  data: function() {
    return {
      tab: ''
    };
  },
  created: function() {
    this.isNotGestor();
  },
  methods: {
    isNotGestor() {
      if (!this.isGestor) {
        this.$router.push("perfil");
      }
    }
  }
};
</script>

<style lang="css">
</style>

<style scoped>

#vuetify-tab-content div.v-card.v-sheet{
  min-height: 100%;
}

#vuetify-tab-content{
    height: 100%;
    max-width: 100%;
}

#vuetify-tab-content div.v-card.v-sheet div.v-window{
  padding: 10px;
}


</style>
