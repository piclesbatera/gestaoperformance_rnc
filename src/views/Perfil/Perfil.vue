<template>
<v-container>
  <v-card class="elevation-6">
      <v-toolbar dark color="blue">
        <v-toolbar-title>Perfil</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-container>
          <div v-if="loading">
            <span>Carregando...</span>
            <!-- <v-progress-linear color="deep-purple accent-4" indeterminate rounded height="6"></v-progress-linear> -->
            <v-progress-linear indeterminate color="blue" ></v-progress-linear>
          </div>
          <form v-else @submit="solicitacaoAcesso">
            <div class="row">
            <div class="col-md-3">
              <div class="form-group">
                <label class="bmd-label-floating">Nome de Úsuario</label
                ><font color="red"> *</font>
                <input
                  type="text"
                  class="form-control"
                  id="nomeUsuario"
                  v-model="usuario.nomeUsuario"
                  disabled
                />
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label class="bmd-label-floating label-text" for="email"
                  >Endereço de Email</label
                ><font color="red"> *</font>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="usuario.perfilUsuario.email"
                  :disabled="usuarioRegistrado"
                  required
                  placeholder="email@endereco.com"
                />
              </div>
            </div>
            <div class="col-md-5">
              <div class="form-group">
                <label class="bmd-label-floating label-text" for="areaDemandante"
                  >Área</label
                ><font color="red"> *</font>
                <b-form-select
                  v-model="usuario.perfilUsuario.usuarioTim.areaDemandante"
                  :options="areasDemandantes"
                  id="areaDemandante"
                  :disabled="usuarioRegistrado"
                  required
                ></b-form-select>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label class="bmd-label-floating label-text" for="primeiroNome"
                  >Primeiro Nome</label
                ><font color="red"> *</font>
                <input
                  type="text"
                  class="form-control"
                  id="primeiroNome"
                  v-model="usuario.perfilUsuario.usuarioTim.primeiroNome"
                  :disabled="usuarioRegistrado"
                  required
                  placeholder="Nome de cadastro"
                />
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label class="bmd-label-floating label-text" for="sobrenome"
                  >Último Nome</label
                ><font color="red"> *</font>
                <input
                  type="text"
                  class="form-control"
                  id="sobrenome"
                  v-model="usuario.perfilUsuario.usuarioTim.sobrenome"
                  :disabled="usuarioRegistrado"
                  required
                  placeholder="Nome de cadastro"
                />
              </div>
            </div>
          </div>
          <v-btn
            v-if="!usuarioRegistrado"
            class="btn btn-primary pull-right"
            :loading="loadingSolicitacaoAcesso"
            :disabled="loadingSolicitacaoAcesso"
            color="blue"
            type="submit"
          >
          Solicitar Acesso
          </v-btn>
          <h6 v-else class="card-category text-gray">
            {{mensagemBoasVindas}}
          </h6>
          <div class="clearfix"></div>
          </form>
        </v-container>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
import {
  baseApi,
  chaveUsuario,
  showError,
  cleanErrors
} from "@/global";


export default {
  computed: {
    ...mapState(["usuario"]),
    mensagemBoasVindas: function(){
      if(!this.acesso){
        return "Aguardando liberação de acesso...";
      } else {
        return "Seja bem-vindo.";
      }
    },
    nomeUsuarioCard: function() {
      if (this.usuarioRegistrado) {
        return this.usuario.perfilUsuario.primeiroNome;
      } else {
        return this.usuario.nomeUsuario;
      }
    },
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
      loading: true,
      loadingSolicitacaoAcesso: false,
      areasDemandantes: [
        { "value": null, "text": "Selecione uma àrea" }
      ]
    };
  },
  created: async function() {
    await this.getAreasDemandantes();
    this.getPerfilUsuario();
  },
  methods: {
    getPerfilUsuario() {
      this.loading = true;
      return axios
        .get(`${baseApi}/usuario?`)
        .then(res => {
          // this.usuario.perfilUsuario = res.data;
          this.$store.commit("setPerfilUsuario", res.data);
          localStorage.setItem(chaveUsuario, JSON.stringify(this.usuario));
        })
        .catch(error => {
          showError(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    solicitacaoAcesso() {
      event.preventDefault();
      this.usuario.perfilUsuario.login = "";
      this.loadingSolicitacaoAcesso = true;
      axios
        .post(`${baseApi}/usuario`, this.usuario.perfilUsuario)
        .then(() => {
          cleanErrors();
          this.getPerfilUsuario();
          this.$toasted.global.defaultSuccess();
        })
        .catch(error => {
            showError(error);
        })
        .finally(() => {
          this.loadingSolicitacaoAcesso = false;
        });
    },
    getAreasDemandantes(){
      var comboBox = [{ "value": null, "text": "Selecione uma àrea" }];

      return axios
        .get(`${baseApi}/usuario/areasDemandantes?`)
        .then(res => {
          if(res.data && res.data.areasDemandantes){
            var areasDemandantes = res.data.areasDemandantes;
            areasDemandantes.forEach((item) => 
            { 
              var areaDemandante = {};
              areaDemandante['value'] = item.id;
              areaDemandante['text'] = item.descricaoAreaDemandante;
              comboBox.push(areaDemandante);
            });
          }
        })
        .catch(error => {
          showError(error);
        })
        .finally(() => {
          this.areasDemandantes = comboBox;
        });

    }
  }
};
</script>

