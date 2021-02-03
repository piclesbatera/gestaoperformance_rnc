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
          <ValidationObserver v-else ref="observer">
            <v-form :readonly="usuarioRegistrado" @submit.prevent="solicitacaoAcesso()">
              <div class="row">
                <div class="col-md-3">
                  <v-text-field
                    v-model="usuario.nomeUsuario"
                    label="Nome de Úsuario"
                    outlined
                    dense
                    required
                    readonly>
                  </v-text-field>
                </div>
                <div class="col-md-4">
                  <ValidationProvider v-slot="{ errors }" name="Endereço de Email" rules="requerido|email" >
                    <v-text-field
                      type="email"
                      id="email"
                      v-model="usuario.perfilUsuario.email"
                      :error-messages="errors"
                      label="Endereço de Email"
                      outlined
                      dense
                      required>
                    </v-text-field>
                  </ValidationProvider>
                </div>
                <div class="col-md-5">
                  <ValidationProvider v-slot="{ errors }" name="Área" rules="requerido" >
                    <v-select
                      id="areaDemandante"
                      v-model="usuario.perfilUsuario.usuarioTim.areaDemandante"
                      :items="areasDemandantes"
                      label="Área"
                      dense
                      :error-messages="errors"
                      outlined
                      required></v-select>
                  </ValidationProvider>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <ValidationProvider v-slot="{ errors }" name="Primeiro Nome" rules="requerido|alfa_espacos|minimo:2|maximo:30" >
                    <v-text-field
                      id="primeiroNome"
                      v-model="usuario.perfilUsuario.usuarioTim.primeiroNome"
                      :counter="30"
                      maxlength="30"
                      :error-messages="errors"
                      label="Primeiro Nome"
                      outlined
                      dense
                      required>
                    </v-text-field>
                  </ValidationProvider>
                </div>
                <div class="col-md-6">
                  <ValidationProvider v-slot="{ errors }" name="Último Nome" rules="requerido|alfa_espacos|minimo:2|maximo:30" >
                    <v-text-field
                      id="sobrenome"
                      v-model="usuario.perfilUsuario.usuarioTim.sobrenome"
                      :counter="30"
                      maxlength="30"
                      :error-messages="errors"
                      label="Último Nome"
                      outlined
                      dense
                      required>
                    </v-text-field>
                  </ValidationProvider>
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
            </v-form>
          </ValidationObserver>
        </v-container>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";

import { baseApi, chaveUsuario, showError, cleanErrors } from "@/global";

import { ValidationProvider, ValidationObserver } from 'vee-validate';
import {validacaoFormulario} from '@/components/utils/validation.js';

export default {
  name: "perfil",
  components: {
      ValidationProvider, ValidationObserver
  },
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
      formularioValido: false,
      loading: true,
      loadingSolicitacaoAcesso: false,
      areasDemandantes: [
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
      if(validacaoFormulario(this.$refs.observer)){
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
      }
    },
    getAreasDemandantes(){
      var comboBox = [];

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

