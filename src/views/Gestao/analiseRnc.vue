<template>
  <v-container fluid grid-list-md>
    <v-row>
      <template v-if="!loadingContagemObras">
        <v-col v-for="contagemObra in contagemObras" :key="contagemObra.tipo">
          <v-card class="mx-auto" outlined elevation="2" >
            <v-list class="transparent" align="center" >
              <div class="overline">
                {{contagemObra.tipo}}
              </div>
            </v-list>
            <v-divider style="margin: 0px;"></v-divider>
            <v-list class="transparent" align="center">
              <v-list-item-group v-model="selected">
                <v-list-item :disabled="loadingObras" :value='JSON.stringify({"identificadorTipo": contagemObra.identificadorTipo, "sg": "sgi", "contagem": contagemObra.sgi})'>
                  <v-list-item-content>
                    <v-list-item-title>SGI</v-list-item-title>
                    <v-list-item-subtitle >
                      {{contagemObra.sgi}}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-divider style="margin: 0px;"></v-divider>
                <v-list-item :disabled="loadingObras" :value='JSON.stringify({"identificadorTipo": contagemObra.identificadorTipo, "sg": "sgp", "contagem": contagemObra.sgp})'>
                  <v-list-item-content>
                    <v-list-item-title>SGP</v-list-item-title>
                    <v-list-item-subtitle >
                      {{contagemObra.sgp}}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-col>
      </template>
      <template v-else>
        <v-col>
          <v-skeleton-loader
            class="mx-auto"
            type="image"
            max-height="150px"
          ></v-skeleton-loader>
        </v-col>
        <v-col>
          <v-skeleton-loader
            class="mx-auto"
            type="image"
            max-height="150px"
          ></v-skeleton-loader>
        </v-col>
        <v-col>
          <v-skeleton-loader
            class="mx-auto"
            type="image"
            max-height="150px"
          ></v-skeleton-loader>
        </v-col>
        <v-col>
          <v-skeleton-loader
            class="mx-auto"
            type="image"
            max-height="150px"
          ></v-skeleton-loader>
        </v-col>
      </template>
    </v-row>
    <v-row>
      <v-col>
          <v-card-title>
              <v-spacer></v-spacer>
              <v-text-field v-model="consultaDataTable" append-icon="mdi-magnify" label="Pesquisa" single-line hide-details></v-text-field>
          </v-card-title>
          <v-divider></v-divider>
          <v-data-table show-expand single-expand :headers="headersConsulta" :items="obras" :search="consultaDataTable" :loading="loadingObras"
                        loading-text="Carregando..." no-data-text="Sem dados disponíveis"
                        item-key="ID">
              <template v-slot:expanded-item="{ headers, item }">
                  <td :colspan="headers.length" style="padding:0px">
                    <v-data-table
                      :headers="headerRncsObra"
                      :items="item.rncs"
                      hide-default-footer
                      class="elevation-1"
                    ></v-data-table>
                  </td>
              </template>
          </v-data-table>
      </v-col>
    </v-row>
  </v-container> 
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
import { baseApi, showError } from "@/global";
export default {
  name: "analiseRnc",
  computed: {
    ...mapState(["usuario"]),
    headersConsulta: function(){
      return (this.sg == 'sgp') ? this.headerObrasSgp : this.headerObrasSgi;
    },
    sg: function(){
      var sg = "";
      if(this.selected){
        var selected = JSON.parse(this.selected);
        sg = selected.sg;
      }
      return sg;
    },
    identificadorTipo: function(){
      var identificadorTipo = "";
      if(this.selected){
        var selected = JSON.parse(this.selected);
        identificadorTipo = selected.identificadorTipo;
      }
      return identificadorTipo;
    },
    contagem: function(){
      var contagem = "";
      if(this.selected){
        var selected = JSON.parse(this.selected);
        contagem = selected.contagem;
      }
      return contagem;
    }
  },
  data: function() {
    return {
      selected: '',
      loadingContagemObras: true,
      loadingObras: false,
      contagemObras: {},
      obras: [],
      consultaDataTable: '',
      headerObrasSgi: [
                { text: 'Fila', value: 'Status' },
                { text: 'ID', value: 'ID' },
                { text: 'Projeto', value: 'Projeto' },
                { text: 'UF', value: 'UF' },
                { text: 'ID OPD', value: 'ID_OPD' },
                { text: 'Empreiteira Projeto', value: 'Empreiteira' },
                { text: 'Empreiteira Construção', value: 'EmpreiteiraConstrucao' },
                { text: '', value: 'data-table-expand' },
            ],
        headerObrasSgp: [
                { text: 'Tipo Acionamento', value: 'Tipo Acionamento' },
                { text: 'GL', value: 'GL' },
                { text: 'Projeto', value: 'Projeto' },
                { text: 'UF', value: 'UF' },
                { text: 'Cliente', value: 'Cliente' },
                { text: 'GP Cliente', value: 'GPCliente' },
                { text: 'Empreiteira', value: 'Empreiteira' },
                { text: '', value: 'data-table-expand' },
            ],
      headerRncsObra: [
        { text: 'RNC', value: 'id' },
        { text: 'Motivo', value: 'descricaoMotivo' },
        { text: 'Descrição', value: 'descricao' },
        { text: 'Tipo', value: 'descricaoTipo' },
        { text: 'Status', value: 'descricaoStatus' },
      ]
        
    };
  },
  created: function() {
    this.getContagemObras();
    this.getObras();
  },
  methods: {
    getContagemObras() {
      this.loadingContagemObras = true;
      axios
        .get(`${baseApi}/gestao/contagemObras/tipo`)
        .then(res => {
          var contagemObras = res.data;
          this.contagemObras = contagemObras;
        })
        .catch(error => {
          showError(error);
        }).finally(() => {
            this.loadingContagemObras = false;
        });
    },
    getObras() {
      if(this.sg && this.identificadorTipo){
        this.loadingObras = true;
        this.obras = [];
        axios
          .get(`${baseApi}/gestao/obras/tipo/${this.sg}/${this.identificadorTipo}`)
          .then(res => {
            var obras = res.data;
            this.obras = obras;
          })
          .catch(error => {
            showError(error);
          }).finally(() => {
              this.loadingObras = false;
          });
      } else {
        this.obras = [];
      }
    }
  },
  watch: {
      selected: function(novoValor, antigoValor){
        if(novoValor != antigoValor && novoValor != ""){
          if(!this.loadingObras){
            this.getObras();
          } 
        }
      }
    }
};
</script>

<style scoped>
.overline{
    font-size: 1rem!important;
}
</style>
