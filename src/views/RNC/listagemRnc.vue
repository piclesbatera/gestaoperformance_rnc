<template>
    <div>
        <div v-if="!listaRNCs">
            <span>Carregando...</span>
            <!-- <v-progress-linear color="deep-purple accent-4" indeterminate rounded height="6"></v-progress-linear> -->
            <v-progress-linear indeterminate color="blue" ></v-progress-linear>
        </div>
        <div v-else class="container-fluid">
            <div class="row">
                <div class="col-lg-12">
                    <v-expansion-panels  hover>
                        <div class="w-100 mb-1">
                            <div class="float-right">
                                <v-btn @click="novaRNC();" v-if="crudType == 'c' && !isLeitura" class="btn btn-primary form-control" color="blue" dark >
                                    <v-icon dark left>
                                        mdi-folder-plus
                                    </v-icon>
                                    Adicionar RNC
                                </v-btn>
                            </div>
                        </div>
                        <v-expansion-panel style="background-color: #f7f7f7;" :class="{'resolvida': row.resolvido, 'naoResolvida': row.resolvido == false}" v-for="(row, index) in listaRNCs" :key="index">
                            <v-expansion-panel-header :disable-icon-rotate="row.rncResolvida">
                                <v-row no-gutters>
                                    <v-col cols="2" v-if="row.id">
                                        RNC: {{row.id}}
                                    </v-col>
                                    <v-col cols="10" class="text--secondary" >
                                        <v-row no-gutters style="width: 100%" >
                                            <v-col cols="1">
                                                <span v-if="row.descricaoRef && row.descricaoRef.motivoRef">
                                                    Tipo: {{ row.descricaoRef.tipoRef.descricaoTipo }}
                                                </span>
                                            </v-col>
                                            <v-col cols="9">
                                                <span v-if="row.descricaoRef">
                                                    Motivo: {{ row.descricaoRef.motivoRef.descricaoMotivo }}
                                                </span>
                                            </v-col>
                                            <v-col cols="2">
                                                <span v-if="row.statusRef">
                                                    Status: {{ row.statusRef.descricaoStatus }}
                                                </span>
                                            </v-col> 
                                        </v-row>
                                    </v-col>
                                </v-row>

                                <!-- ICONS -->

                                <!-- <template v-if="row.resolvido == null" v-slot:actions>
                                    <v-icon color="primary">
                                        $expand
                                    </v-icon>
                                </template> -->

                                <template v-if="row.rncResolvida" v-slot:actions>
                                    <v-icon color="teal">
                                        mdi-check
                                    </v-icon>
                                </template>

                                <!-- <template v-else v-slot:actions>
                                    <v-icon color="error">
                                        mdi-alert-circle
                                    </v-icon>
                                </template> -->
                                <!-- ICONS -->
                            </v-expansion-panel-header>
                            <v-expansion-panel-content :eager="true">
                                <div class="w-100 mb-1">
                                    <div class="float-right">
                                        <v-btn @click="removeRNC(row);" v-if="!row.dataCriacao" class="btn btn-primary form-control" style="z-index: 999" color="blue" dark >
                                            <v-icon dark left>
                                                mdi-delete
                                            </v-icon>
                                            Remover RNC
                                        </v-btn>
                                    </div>
                                </div>
                                <!-- {{row}} -->
                                <DetalhesTabsRnc :isLeitura="isLeitura" :rnc="row" :crudType="crudType" :motivos="motivos" :tipos="tipos" :registro="registro" />
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import DetalhesTabsRnc from './detalhesTabsRnc'
import { baseApi, showError } from "@/global";
import axios from "axios";
import { mapState } from "vuex";
import tiposRnc from "@/assets/json/rnc/tipos.json";
export default {
    name: "listagemRnc",
    components: {
        DetalhesTabsRnc
    },
    props: {
        // value: Object,
        crudType: String,
        isLeitura: {
            type: Boolean,
            default: false
        },
        registro: Object,
        listaRNCs: Array
    },
    computed: {
        ...mapState(["usuario"]),
        loading: function(){
            return Boolean(!this.listaRNCs || this.loadingMotivo || this.loadingTipo);
        }
    },
  data: function() {
    return {
        dataValue: null,
        loadingMotivo: true,
        loadingTipo: true,
        motivos: [
            { "value": null, "text": "Selecione um motivo" }
        ],
        tipos: tiposRnc
    }
  },
  methods: {
        novaRNC(){
            var listaRNCs = this.listaRNCs;
            if(!listaRNCs){
                listaRNCs = [];
            }

            var rnc =  {
                        id: null,
                        motivo: null,
                        descricao: null,
                        tipo: null,
                        resolvido: null,
                        listaIrregularidades: [
                        ]
                    };
            listaRNCs.push(rnc);
            this.listaRNCs = listaRNCs;
        },
        removeRNC(rnc){
            const index = this.listaRNCs.indexOf(rnc);
            this.listaRNCs.splice(index, 1);
        },
        getMotivos(){
            var comboBox = [{ "value": null, "text": "Selecione um motivo" }];
            var queryString = '?';
            var contrato = this.registro.codigoContrato;
            queryString += '&contrato='+contrato;

            return axios
                .get(`${baseApi}/rnc/motivos${queryString}`)
                .then(res => {
                if(res.data && res.data.motivosRnc){
                    var motivos = res.data.motivosRnc;
                    motivos.forEach((item) => 
                    { 
                        var motivo = {};
                        motivo['value'] = item.id;
                        motivo['text'] = item.descricaoMotivo;
                        comboBox.push(motivo);
                    });
                }
                })
                .catch(error => {
                    showError(error);
                })
                .finally(() => {
                    this.motivos = comboBox;
                    this.loadingMotivo = false;
                });

        },
        getTipos(){
            var comboBox = [{ "value": null, "text": "Nenhum tipo" }];

            return axios
                .get(`${baseApi}/rnc/tipos?`)
                .then(res => {
                if(res.data && res.data.tiposRnc){
                    var tipos = res.data.tiposRnc;
                    tipos.forEach((item) => 
                    { 
                        var tipo = {};
                        tipo['value'] = item.id;
                        tipo['text'] = item.descricaoTipo;
                        comboBox.push(tipo);
                    });
                }
                })
                .catch(error => {
                    showError(error);
                })
                .finally(() => {
                    this.tipos = comboBox;
                    this.loadingTipo = false;
                });

        },
        async iniciar(){
            if(this.crudType == 'c' && !this.isLeitura){
                this.getMotivos();
            }
            this.getTipos();
        }
  },
  created: function(){
      this.iniciar();
  }
}
</script>


<style scoped>
.resolvida{
    border: 1px solid green;
}
.naoResolvida{
    border: 1px solid red;
}


</style>
