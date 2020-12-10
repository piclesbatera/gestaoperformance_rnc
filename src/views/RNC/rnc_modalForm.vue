<template>
<!-- INICIA RNC MODAL FORM -->
<v-dialog v-model="show"  content-class="container dialog" >
  <v-layout justify-center>
      <v-flex>
        <v-toolbar color="blue" dark>
            <v-toolbar-title>{{pageTitle}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn class="ma-2" icon @click.stop="show=false" title="Fechar" >
                <v-icon>fa fa-times</v-icon>
            </v-btn>
        </v-toolbar>
        
        <v-card>
            <v-container fluid grid-list-md>
                <form ref="controleRNCForm" @submit.prevent="save()">
                    <div class="row">
                        <div class="col-md-12">
                            <h6>
                                {{descricaoTituloSg}}
                            </h6>
                        </div>
                    </div>
                    <v-divider></v-divider>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="float-right"> 
                                <v-btn type="submit" :loading="loadingSave" class="btn btn-primary form-control" color="blue" dark >
                                    <v-icon dark left>
                                        mdi-content-save
                                    </v-icon>
                                    Salvar
                                </v-btn>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <v-card>
                                <v-tabs
                                    v-model="tab"
                                    dark
                                    background-color="blue"
                                    show-arrows>
                                    <v-tabs-slider color="teal lighten-4"></v-tabs-slider>
                            
                                    <v-tab :href="'#detalhes'">Detalhes</v-tab>
                                    <v-tab :href="'#anexos'">Anexos</v-tab>
                                    <v-tab :href="'#irregularidades'">Irregularidades</v-tab>
                                </v-tabs>
                                <v-tabs-items v-model="tab" touchless>
                                    <!-- Detalhes -->
                                    <v-tab-item :value="'detalhes'">
                                        <v-card flat>
                                            <v-card-text>
                                                <Rnc_detalhesForm v-model="detalhes" :crudType="crudType" />
                                            </v-card-text>
                                        </v-card>
                                    </v-tab-item>


                                    <!-- Anexos -->
                                    <v-tab-item :value="'anexos'">
                                        <v-card flat>
                                            <v-card-text>
                                                <Rnc_documentacaoView :codigoGrupoFila="codigoGrupoFila" :sg="sg" :codigoSg="codigoSg" :crudType="crudType"/>
                                            </v-card-text>
                                        </v-card>
                                    </v-tab-item>


                                    <!-- Irregularidades -->
                                    <v-tab-item :value="'irregularidades'">
                                        <v-card flat>
                                            <v-card-text>
                                                <Rnc_uploadDetailForm :initialRow="permissionAlterIrregularidades" :newObject="newIrregularidadeObject" :permissionAlterComponent="permissionAlterIrregularidades" v-model="listaIrregularidades" :folder="'irregularidades'" />
                                            </v-card-text>
                                        </v-card>
                                    </v-tab-item>
                                </v-tabs-items>
                            </v-card>
                        </div>
                    </div>
                </form>
            </v-container>
        </v-card>
      </v-flex>
    </v-layout>
</v-dialog>
</template>

<script>
import Rnc_detalhesForm from './rnc_detalhesForm'
import Rnc_documentacaoView from './rnc_documentacaoView'
import Rnc_uploadDetailForm from './rnc_uploadDetailForm'
import { baseApi, showError } from "@/global";
import axios from "axios";
export default {
    name: "rnc_modalForm",
    components: {
        Rnc_detalhesForm,
        Rnc_documentacaoView,
        Rnc_uploadDetailForm
    },
    props: {
        value: Boolean,
        codigoGrupoFila: String,
        sg: String,
        descricaoTituloSg: String,
        codigoSg: Number,
        crudType: String
    },
    computed: {
        show: {
            get () {
                return this.value
            },
            set (value) {
                this.$emit('input', value);
            }
        },
        pageTitle: function(){
            var title = "Criar RNC";

            if(this.crudType == 'c'){
                title = "Criar RNC";
            } else
            if(this.crudType == 't'){
                title = 'Tratar RNC';
            } else
            if(this.crudType == 'v'){
                title = 'Validar RNC';
            }

            return title;
        },
        permissionAlterIrregularidades: function(){
            return ((this.crudType == 'c' || this.crudType == 'v'));
        },
        createRequestData: function(){
            var requestData = {};
            requestData['detalhes'] = this.detalhes;
            requestData['irregularidades'] = this.listaIrregularidades;
            return requestData;
        },
        dealRequestData: function(){
            var requestData = {};
            requestData['listaMotivos'] = this.detalhes.listaMotivos;
            return requestData;
        },
        validateRequestData: function(){
            var requestData = {};
            requestData['listaMotivos'] = this.detalhes.listaMotivos;
            requestData['irregularidades'] = this.listaIrregularidades;
            return requestData;
        },
        // validationSave: function(){
        //     var requestData = this.requestRNCData;

        //     if(this.crudType == 'c'){
        //         var detalhes = requestData.detalhes;
                


        //     } else
        //     if(this.crudType == 't'){




        //     } else
        //     if(this.crudType == 'v'){




        //     }

        //     return true;
        // },
        requestRNCData: function(){
            var requestData = null;

            if(this.crudType == 'c'){
                requestData = this.createRequestData;
            } else
            if(this.crudType == 't'){
                requestData = this.dealRequestData;
            } else
            if(this.crudType == 'v'){
                requestData = this.validateRequestData;
            }

            return requestData;
        }
  },
  data: function() {
    return {
        loadingSave: false,
        listaIrregularidades: [],
        newIrregularidadeObject: '{ "id": null,  "descricaoAnexo": "", "file": null, "filename": null, "loadingFile": false }',
        tab: null,
        detalhes: {
            areaDemandante: null,
            classificacao: null,
            listaMotivos: [
                {
                    id: 1,
                    motivo: 1,
                    tipo: 3,
                    status: null,
                    listaEvidencias: [
                        {
                            id: null,
                            descricaoAnexoEvidencia: "",
                            file: null,
                            loadingFile: false
                        }
                    ],
                    listaPrazos: [
                        {
                            id: 1,
                            codigo: '001',
                            dataCadastro: "2020-12-04",
                            dataPrazo: "2020-12-20",
                            state: false
                        },
                        {
                            id: 2,
                            codigo: '002',
                            dataCadastro: "2020-12-08",
                            dataPrazo: "2020-12-15",
                            state: true
                        },
                        // {
                        //     id: 3,
                        //     codigo: '003',
                        //     dataPrazo: "2020-12-10",
                        //     state: null
                        // }
                    ]
                },
                {
                    id: 2,
                    motivo: 2,
                    tipo: 1,
                    status: true,
                    listaEvidencias: [
                        {
                            id: null,
                            descricaoAnexoEvidencia: "",
                            file: null,
                            loadingFile: false
                        }
                    ]
                },
                {
                    id: 3,
                    motivo: 1,
                    tipo: 3,
                    status: null
                }
            ],
            observacoes: null,
        }
    }
  },
  methods: {
        newMotivo(){
                if(!this.detalhes.listaMotivos){
                    this.detalhes.listaMotivos = [];
                }

                var motivo = {
                    motivo: null,
                    tipo: null,
                };
                this.detalhes.listaMotivos.push(motivo);
            
        },
        save(){

            // if(!this.validationSave()){
            //     return false;
            // }

            var queryString = "";

            var url = `${baseApi}/rnc/${queryString}`;

            this.loadingSave = true;

            var requestData = this.requestRNCData;

            axios.post(url, requestData, { headers: {'Content-Type': 'application/json'} }).then(res => {
                res;
                this.finnalySave(true);
            }).catch(error => {
                this.finnalySave(false, error);
            });
            
        },
        finnalySave(save, error){
            if(save){
                this.loadingSave = false;
                this.show=false;
                this.$toasted.global.defaultSuccess();
            } else {
                this.loadingSave = false;
                showError(error);
            }
        },
        initCriacaoRNC(){
            // if(this.crudType == 'c'){
                
            // }
        },
        initTratarRNC(){
            // if(this.crudType == 't'){

            // }
        },
        initValidarRNC(){
            // if(this.crudType == 'v'){
                
            // }
        }
  },
  created: function(){
      this.initCriacaoRNC();
      this.initTratarRNC();
      this.initValidarRNC();
  }
}
</script>

<style scoped>

.v-text-field {
    padding-top: 0px;
    margin-top: 0px;
}

.col, .col-1, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9, .col-10, .col-11, .col-12, .col-auto, .col-lg, .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg-auto, .col-md, .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12, .col-md-auto, .col-sm, .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm-auto, .col-xl, .col-xl-1, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, .col-xl-9, .col-xl-10, .col-xl-11, .col-xl-12, .col-xl-auto {
    padding: 3px 12px;
}

hr{
    margin-top: 5px;
    margin-bottom: 5px;
}

</style>