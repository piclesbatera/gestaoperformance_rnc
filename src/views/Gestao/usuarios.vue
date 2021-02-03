<template>
  <v-container fluid grid-list-md>
          <v-card-title>
              <v-spacer></v-spacer>
              <v-text-field v-model="consultaDataTable" append-icon="mdi-magnify" label="Pesquisa" single-line hide-details></v-text-field>
          </v-card-title>
          <v-divider></v-divider>
          <div class="scrollable">
              <v-data-table :headers="headersConsulta" :items="usuariosDataTable" :search="consultaDataTable" :loading="loadingUsuarios" loading-text="Carregando..." no-data-text="Sem dados disponíveis">
                  <!-- <template v-slot:item.acesso="{ item }">
                    <template v-if="item.acesso">
                      Permitido
                      <v-icon></v-icon>
                    </template>
                    <template v-else>
                      Sem permissão
                      <v-icon></v-icon>
                    </template>
                  </template> -->
                  <template v-slot:item.aceitarAcesso="{ item }">
                      <template v-if="item.loadingConcessao">
                        <v-progress-circular indeterminate color="primary" ></v-progress-circular>
                      </template>
                      <template v-else>
                        <v-btn icon v-if="item.acesso" title="remover acesso ao sistema" @click="concederAcesso(item, false);">
                          <v-icon>mdi-account-cancel</v-icon>
                        </v-btn>
                        <v-btn icon v-else title="permitir acesso ao sistema" @click="concederAcesso(item, true)">
                          <v-icon>mdi-account-check</v-icon>
                        </v-btn>
                      </template>
                  </template>
              </v-data-table>
          </div>
  </v-container> 
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
import { baseApi, showError } from "@/global";
export default {
  name: "usuarios",
  computed: {
    ...mapState(["usuario"]),
    headersConsulta: function(){
      return this.headerUsuarioTim;
    },
    usuariosDataTable: function(){
      if(this.usuarios){
        return this.usuarios.map(e => {
          if(e.acesso){
            e['acessoDataTable'] = 'Permitido';
          } else {
            e['acessoDataTable'] = 'Sem Permissão';
          }
          return e;
        })
      } else {
        return [];
      }
    }
  },
  data: function() {
    return {
      loadingUsuarios: true,
      usuarios: [],
      consultaDataTable: '',
      headerUsuarioTim: [
                { text: 'Matrícula', value: 'login' },
                { text: 'Primeiro Nome', value: 'usuarioTim.primeiroNome' },
                { text: 'Último Nome', value: 'usuarioTim.sobrenome' },
                { text: 'Email', value: 'email' },
                {
                    text: 'Acesso', value: 'acessoDataTable'
                },
                {
                    text: '', align: 'center' , sortable: false, value: 'aceitarAcesso', filterable: false
                }
            ],
    };
  },
  created: function() {
    this.getUsuarios();
  },
  methods: {
    concederAcesso(usuario, concessao){
      usuario.loadingConcessao = true;
      var login = usuario.login;
      axios.patch(`${baseApi}/gestao/usuario/${login}`, {acesso: concessao})
        .then(res => {
          var usuarioEditado = res.data;
          // var usuarioIndex = this.usuarios.indexOf(usuario);
          // var usuarioOriginal = this.usuarios[usuarioIndex];
          Object.assign(usuario, usuarioEditado);
          this.$toasted.global.defaultSuccess({msg: "Concessão alterada para o usuário "+login+"!"});
        })
        .catch(error => {
          showError(error);
        }).finally(() => {
            usuario.loadingConcessao = false;
        });
      
    },
    getUsuarios() {
      this.loadingUsuarios = true;
      axios
        .get(`${baseApi}/gestao/usuarios`)
        .then(res => {
          var usuarios = res.data;
          usuarios.forEach( 
            (item) => 
                {
                  item['loadingConcessao'] = false;
                }
            );
          this.usuarios = usuarios;
        })
        .catch(error => {
          showError(error);
        }).finally(() => {
            this.loadingUsuarios = false;
        });
    }
  }
};
</script>

<style scoped>
.openDetail{
    cursor: pointer;
    font-size: x-large;
}
.openDetail[disabled='disabled']{
    cursor: pointer;
    font-size: x-large;
    pointer-events: none;
    opacity: 0.5;
}  
</style>
