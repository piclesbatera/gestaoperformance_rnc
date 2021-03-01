<template>
  <v-container fluid grid-list-md>
    <v-row>
      <template v-if="!loadingcontagemRNCs">
        <v-col v-for="contagemRNC in contagemRNCs" :key="contagemRNC.tipo">
          <v-card class="mx-auto contagemRNC-cards" outlined elevation="2" height="">
            <v-list class="transparent" align="center" >
              <div class="overline">
                {{contagemRNC.tipo}}
              </div>
            </v-list>
            <v-divider style="margin: 0px;"></v-divider>
            <v-list class="transparent" align="center">
              <v-list-item-group v-model="selected">
                <v-list-item class="contagemRNC-selectable" :disabled="loadingRNCs" :value='JSON.stringify({"identificadoresTipos": contagemRNC.identificadoresTipos, "contagemTotal": contagemRNC.contagemTotal})'>
                  <v-list-item-content>
                    <v-list-item-title style="font-size: 2rem;">{{contagemRNC.contagemTotal}}</v-list-item-title>
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
            max-width="40%"
            max-height="20vh"
          ></v-skeleton-loader>
        </v-col>
        <v-col>
          <v-skeleton-loader
            class="mx-auto"
            type="image"
            max-width="40%"
            max-height="20vh"
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
          <v-data-table :custom-sort="customSort" :headers="headerRncs" :items="rncsDataTable" :search="consultaDataTable" :loading="loadingRNCs"
            loading-text="Carregando..." no-data-text="Sem dados disponíveis"
            item-key="id">
            <template v-slot:item.view="{ item }">
              <v-btn title="abrir RNC" v-if="!item.loading" @click="abreRegistroSelecionado(item);" icon color="black">
                  <v-icon>fa fa-edit</v-icon>
              </v-btn>
              <v-progress-circular :size="24" v-else indeterminate ></v-progress-circular>
            </template>
          </v-data-table>
      </v-col>
    </v-row>
    <ModalAnaliseRnc :registroRnc="registroSelecionado" v-if="showModalRnc" @loadingRNC="updateLoadingRNC" v-model="showModalRnc"/>
  </v-container> 
</template>

<script>
import { mapState } from "vuex";
import ModalAnaliseRnc from './modalAnaliseRnc'
import axios from "axios";
import { baseApi, showError } from "@/global";
import moment from 'moment';
export default {
  name: "analiseRnc",
  components: {
    ModalAnaliseRnc
  },
  computed: {
    ...mapState(["usuario"]),
    identificadoresTipos: function(){
      var identificadoresTipos = null;
      if(this.selected){
        var selected = JSON.parse(this.selected);
        identificadoresTipos = selected.identificadoresTipos;
      }
      return identificadoresTipos;
    },
    contagemTotal: function(){
      var contagemTotal = "";
      if(this.selected){
        var selected = JSON.parse(this.selected);
        contagemTotal = selected.contagemTotal;
      }
      return contagemTotal;
    },
    rncsDataTable: function(){
      return this.rncs.map(e => {
          e['dataCriacaoLocalString'] = (e['dataCriacao']) ? moment(e['dataCriacao'].replaceAll("Z", "")).format('DD/MM/YYYY HH:mm:ss') : "";
          e['penalizacaoPorcentagem'] = (e['penalizacao']) ? e['penalizacao'] + '%' : "";
          return e;
      });
    }
  },
  data: function() {
    return {
      showModalRnc: false,
      registroSelecionado: null,
      selected: '',
      loadingcontagemRNCs: true,
      loadingRNCs: false,
      contagemRNCs: {},
      rncs: [],
      consultaDataTable: '',
      headerRncs: [
        { text: 'RNC', value: 'id' },
        { text: 'Data de Criação', value: 'dataCriacaoLocalString' },
        { text: 'Motivo', value: 'motivo' },
        { text: 'Descrição', value: 'descricao' },
        { text: 'Tipo', value: 'tipo' },
        { text: 'Status', value: 'descricaoStatus' },
        { text: 'Penalização', value: 'penalizacaoPorcentagem', align: 'end'},
        {
          text: '', sortable: false, value: 'view', filterable: false
        }
      ]
        
    };
  },
  created: function() {
    this.getcontagemRNCs();
    this.getRNCs();
  },
  methods: {
    updateLoadingRNC(loading){
      this.registroSelecionado.loading = loading;
    },
    abreRegistroSelecionado(rnc){
        this.$set(rnc, 'loading', false);
        this.registroSelecionado = rnc;
        this.showModalRnc=true;
      },
    customSort(items, index, isDesc) {
      items.sort((a, b) => {
        if (index[0] === "dataCriacaoLocalString") {
          if (!isDesc[0]) {
            return moment(a[index], "DD/MM/YYYY HH:mm:ss").valueOf() - moment(b[index], "DD/MM/YYYY HH:mm:ss").valueOf();
          } else {
            return moment(b[index], "DD/MM/YYYY HH:mm:ss").valueOf() - moment(a[index], "DD/MM/YYYY HH:mm:ss").valueOf();
          }
        } else if(index[0] === "penalizacaoPorcentagem"){
          if (!isDesc[0]) {
              return (a['penalizacao'] - b['penalizacao']);
          } else {
              return (b['penalizacao'] - a['penalizacao']);
          }
        }
        else if (!(isNaN(a[index[0]]))) {
          if (!isDesc[0]) {
              return (a[index[0]] - b[index[0]]);
          } else {
              return (b[index[0]] - a[index[0]]);
          }
        } else {
            if (!isDesc[0]) {
                return (a[index[0]] < b[index[0]]) ? -1 : 1;
            } else {
                return (b[index[0]] < a[index[0]]) ? -1 : 1;
            }
        }
      });
      return items;
    },
    getcontagemRNCs() {
      this.loadingcontagemRNCs = true;
      axios
        .get(`${baseApi}/gestao/contagemRNCs/tipo`)
        .then(res => {
          var contagemRNCs = res.data;
          this.contagemRNCs = contagemRNCs;
        })
        .catch(error => {
          showError(error);
        }).finally(() => {
            this.loadingcontagemRNCs = false;
        });
    },
    getRNCs() {
      if(this.identificadoresTipos){
        this.loadingRNCs = true;
        this.rncs = [];
        var identificadoresTipos = "";
        this.identificadoresTipos.forEach(identificadorTipo => {
          identificadoresTipos += "&identificadoresTipos="+identificadorTipo;
        });
        var queryString = (identificadoresTipos) ? `?${identificadoresTipos}` : "";
        axios
          .get(`${baseApi}/gestao/rnc/tipos${queryString}`)
          .then(res => {
            var rncs = res.data;
            this.rncs = rncs;
          })
          .catch(error => {
            showError(error);
          }).finally(() => {
              this.loadingRNCs = false;
          });
      } else {
        this.rncs = [];
      }
    }
  },
  watch: {
      selected: function(novoValor, antigoValor){
        if(novoValor != antigoValor && novoValor != ""){
          if(!this.loadingRNCs){
            this.getRNCs();
          } 
        }
      }
    }
};
</script>

<style scoped>
.contagemRNC-cards{
    width: 40%;
}
.contagemRNC-selectable{
  height: 10vh;
}
.overline{
    font-size: 1rem!important;
}
</style>
