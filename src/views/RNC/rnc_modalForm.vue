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
                                    
                                </v-tabs>
                                <v-tabs-items v-model="tab" touchless>
                                    <!-- Detalhes -->
                                    <v-tab-item :value="'detalhes'">
                                        <v-card flat>
                                            <v-card-text>
                                                <Rnc_detalhesForm v-model="detalhes" :identificadorAreaDemandanteRnc="identificadorAreaDemandanteRnc" :crudType="crudType" />
                                            </v-card-text>
                                        </v-card>
                                    </v-tab-item>


                                    <!-- Anexos -->
                                    <v-tab-item :value="'anexos'" :eager="true">
                                        <v-card flat>
                                            <v-card-text>
                                                <Rnc_documentacaoView :codigoGrupoFila="codigoGrupoFila" :sg="sg" :codigoSg="codigoSg" :crudType="crudType"/>
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
import { baseApi, showError } from "@/global";
import axios from "axios";
export default {
    name: "rnc_modalForm",
    components: {
        Rnc_detalhesForm,
        Rnc_documentacaoView
    },
    props: {
        value: Boolean,
        identificadorAreaDemandanteRnc: Number,
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
        codigo: function(){
            var codigo = null;
            if(this.sg == 'sgi'){
                codigo = this.codigoSg;
            }
            return codigo;
        },
        codigoGL: function(){
            var codigoGL = null;
            if(this.sg == 'sgp'){
                codigoGL = this.codigoSg;
            }
            return codigoGL;
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
        createRequestData: function(){
            var formData = new FormData();
            var requestData = this.detalhes;
            var listaRNCsRequest = this.detalhes.listaRNCs;

            requestData['sg'] = this.sg;
            requestData['codigo'] = this.codigo;
            requestData['codigoGL'] = this.codigoGL;
            requestData['codigoGrupoFila'] = this.codigoGrupoFila;

            listaRNCsRequest.forEach( 
                (rnc, index) => 
                { 
                    rnc.listaIrregularidades = rnc.listaIrregularidades.filter(irregularidade => {return this.isNewUploadObject(irregularidade)})
                    var irregularidades = rnc.listaIrregularidades;
                    var irregularidade = null;
                    for(irregularidade of irregularidades){
                        formData.append('files-irregularidades-'+index, irregularidade.file);
                        if(irregularidade.descricaoAnexo && irregularidade.descricaoAnexo.trim() == ""){
                            irregularidade.descricaoAnexo = null;
                        }
                    }
                }
            );

            formData.append('data', JSON.stringify(requestData));
            return formData;
        },
        dealRequestData: function(){
            var formData = new FormData();
            var requestData = {};
            var listaRNCsRequest = this.detalhes.listaRNCs;
            
            listaRNCsRequest.forEach( 
                (rnc) => 
                { 
                    rnc['prazo'] = rnc.listaPrazos.filter(function(prazo){ return (prazo.new && prazo.prazo) });
                    rnc['evidencias'] = rnc.listaEvidencias.filter(evidencia => { return this.isNewUploadObject(evidencia) });
                    var evidencia = null;
                    for(evidencia of rnc['evidencias']){
                        formData.append('files-evidencias-'+rnc.id, evidencia.file);
                        if(evidencia.descricaoAnexo && evidencia.descricaoAnexo.trim() == ""){
                            evidencia.descricaoAnexo = null;
                        }
                    }
                }
            );
            requestData['listaRNCs'] = listaRNCsRequest;
            requestData['observacoes'] = this.detalhes.observacoes;
            formData.append('data', JSON.stringify(requestData));
            return formData;
        },
        validateRequestData: function(){
            var formData = new FormData();
            var requestData = {};
            var listaRNCsRequest = this.detalhes.listaRNCs;
            
            listaRNCsRequest.forEach( 
                (rnc) => 
                { 
                    rnc['prazo'] = rnc.listaPrazos.filter(function(prazo){ return prazo.updated });
                    rnc['irregularidades'] = rnc.listaIrregularidades.filter(irregularidade =>{ return this.isNewUploadObject(irregularidade) });
                    var irregularidade = null;
                    for(irregularidade of rnc['irregularidades']){
                        formData.append('files-irregularidades-'+rnc.id, irregularidade.file);
                        if(irregularidade.descricaoAnexo && irregularidade.descricaoAnexo.trim() == ""){
                            irregularidade.descricaoAnexo = null;
                        }
                    }
                }
            );
            requestData['listaRNCs'] = listaRNCsRequest;
            requestData['observacoes'] = this.detalhes.observacoes;
            formData.append('data', JSON.stringify(requestData));
            return formData;
        },
        requestParameters: function(){
            var requestParameters = {};

            requestParameters['url'] = this.requestRNCURL;
            requestParameters['method'] = this.requestRNCMethod;
            requestParameters['data'] = this.requestRNCData;

            return requestParameters;
        },
        requestRNCMethod: function(){
            var requestMethod = "";

            if(this.crudType == 'c'){
                requestMethod = "post";
            } else
            if(this.crudType == 't'){
                requestMethod = "patch";
            } else
            if(this.crudType == 'v'){
                requestMethod = "patch";
            }

            return requestMethod;
        },
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
        },
        requestRNCURL: function(){
            var requestURL = '';
            var id = this.detalhes.id;

            if(this.crudType == 'c'){
                requestURL = `${baseApi}/rnc`;
            } else
            if(this.crudType == 't'){
                requestURL = `${baseApi}/rnc/tratar/${id}`;
            } else
            if(this.crudType == 'v'){
                requestURL = `${baseApi}/rnc/validar/${id}`;
            }

            return requestURL;
        }
  },
  data: function() {
    return {
        loadingSave: false,
        listaIrregularidades: [],
        tab: null,
        detalhes: 
        {
        }
    }
  },
  methods: {
        save(){
            
            var requestParameters = this.requestParameters;

            var queryString = "";

            var url = `${requestParameters.url}${queryString}`;

            var requestData = requestParameters.data;

            this.loadingSave = true;
            this.$store.commit("setMist", true);
            this.$store.commit("setMistVisible", false);

            axios({
                method: requestParameters.method,
                url: url,
                data: requestData
            }).then(res => {
                res;
                this.finnalySave(true);
            }).catch(error => {
                this.finnalySave(false, error);
            });

            
        },
        finnalySave(save, error){
            this.$store.commit("setMist", false);
            this.loadingSave = false;
            if(save){
                this.show=false;
                this.$toasted.global.defaultSuccess();
            } else {
                showError(error);
            }
        },
        isNewUploadObject(uploadObject){
            return (uploadObject.new && uploadObject.nomeArquivo && uploadObject.descricaoAnexo)
        }
  },
  created: function(){
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