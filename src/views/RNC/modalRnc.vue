<template>
<!-- INICIA RNC MODAL FORM -->
    <v-dialog v-model="show" scrollable transition="dialog-bottom-transition" >
        <v-card tile >
            <v-toolbar flat dark color="blue" >
                <v-toolbar-title>{{pageTitle}}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="show = false" >
                <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-toolbar flat dense color="transparent" >
                <v-toolbar-title>{{descricaoTituloSg}}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn @click="salvar()" v-if="!isLeitura" :disabled="!conteudoCarregado" class="ml-2 btn btn-primary" :loading="loadingSalvar" color="blue" >
                    <v-icon dark left>
                        mdi-content-save
                    </v-icon>
                    Salvar
                </v-btn>
            </v-toolbar>
            <v-toolbar flat dense color="transparent" >
                <v-tabs
                    v-model="tab"
                    dark
                    background-color="blue"
                    show-arrows>
                    <v-tabs-slider color="teal lighten-4"></v-tabs-slider>
            
                    <v-tab :href="'#detalhes'">Detalhes</v-tab>
                    <v-tab :href="'#anexos'">Anexos</v-tab>
                    
                </v-tabs>
            </v-toolbar>
            
            <v-card-text>
                <v-tabs-items v-model="tab" touchless>
                    <v-tab-item :value="'detalhes'">
                        <v-card flat>
                            <v-card-text>
                                <ListagemDetalhesPorMotivo v-if="tipoOutroValor == 'outraNatureza'" :infosRegistro="infosRegistro" :motivo="outroValor" :crudType="crudType" :registro="registro"/>
                                <DetalhesRnc v-else-if="crudType != 't'" v-model="detalhes" :identificadorRegistroSistemaAreaDemandanteRnc="identificadorRegistroSistemaAreaDemandanteRnc" :isLeitura="isLeitura" :crudType="crudType" :registro="registro" />
                                <TratarDetalhesRnc v-else :infosRegistro="infosRegistro" v-model="detalhes" :isLeitura="isLeitura" :crudType="crudType" :registro="registro" />
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item :value="'anexos'" :eager="true">
                        <v-card flat>
                            <v-card-text>
                                <DocumentacaoRnc :codigoGrupoFila="codigoGrupoFila" :sg="sg" :codigoSg="codigoSg"/>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                </v-tabs-items>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import DetalhesRnc from './detalhesRnc'
import ListagemDetalhesPorMotivo from './listagemDetalhesPorMotivo'
import TratarDetalhesRnc from './tratarDetalhesRnc'
import DocumentacaoRnc from './documentacaoRnc'
import { baseApi, showError } from "@/global";
import axios from "axios";
export default {
    name: "modalRnc",
    components: {
        DetalhesRnc,
        ListagemDetalhesPorMotivo,
        TratarDetalhesRnc,
        DocumentacaoRnc
    },
    props: {
        value: Boolean,
        crudType: String,
        registro: Object,
        outroValor: Number,
        tipoOutroValor: String
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
        conteudoCarregado: function(){
            return Boolean(this.detalhes && Object.keys(this.detalhes).length > 0);
        },
        sg: function(){
            var sg = null;
            if(this.registro && this.registro.detail){
                sg = this.registro.detail;
            }
            return sg;
        },
        isLeitura: function(){
            return Boolean(this.outroValor);
        },
        identificadorRegistroSistemaAreaDemandanteRnc: function(){
            var identificadorRegistroSistemaAreaDemandanteRnc = null;
            if(this.isLeitura && this.tipoOutroValor == 'outraAreaDemandante'){
                identificadorRegistroSistemaAreaDemandanteRnc = this.outroValor;
            } else
            if(this.registro && this.registro.identificadorRegistroSistemaAreaDemandanteRnc){
                identificadorRegistroSistemaAreaDemandanteRnc = this.registro.identificadorRegistroSistemaAreaDemandanteRnc;
            }
            return identificadorRegistroSistemaAreaDemandanteRnc;
        },
        descricaoTituloSg: function(){
          var descricaoTituloSg = null;
          if(this.registro && this.registro.descricaoTituloSg){
              descricaoTituloSg = this.registro.descricaoTituloSg;
          }  
          return descricaoTituloSg;
        },
        codigoGrupoFila: function(){
            var codigoGrupoFila = null;
            if(this.sg == 'sgp' && this.registro.codigoGrupoFila){
                codigoGrupoFila = Number(this.registro.codigoGrupoFila);
            }
            return codigoGrupoFila;
        },
        codigoSg: function(){
            var codigoSg = null;
            if(this.registro){
                if(this.sg == 'sgi'){
                    codigoSg = Number(this.registro.ID);
                } else
                if(this.sg == 'sgp'){
                    codigoSg = Number(this.registro.GL);
                }
            }
            return codigoSg;
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
        infosRegistro: function(){
            var info = {};

            info['sg'] = this.sg;
            info['codigoSg'] = this.codigoSg;
            info['codigoGrupoFila'] = this.codigoGrupoFila;
            
            return info;
        },
        pageTitle: function(){
            var title = "Criar RNC";

            if(this.isLeitura){
                title = "RNC";
            } else
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
            var requestData = this.detalhes;
            var formData = new FormData();
            var listaRNCsRequest = this.detalhes.listaRNCs;

            requestData['sg'] = this.sg;
            requestData['codigo'] = this.codigo;
            requestData['codigoGL'] = this.codigoGL;
            requestData['codigoGrupoFila'] = this.codigoGrupoFila;
            requestData['descricaoTituloSg'] = this.registro.descricaoTituloSg;
            requestData['codigoContrato'] = this.registro.codigoContrato

            listaRNCsRequest.forEach( 
                (rnc, index) => 
                { 
                    // CRIACAO
                    if(rnc.status == null || rnc.status == 2){
                        if(rnc.listaIrregularidades){
                            var listaIrregularidades = rnc.listaIrregularidades.filter(irregularidade => {return this.novoObjetoUpload(irregularidade)})
                            var irregularidade = null;
                            for(irregularidade of listaIrregularidades){
                                formData.append('files-irregularidades-'+index, irregularidade.file);
                                if(irregularidade.descricaoAnexo && irregularidade.descricaoAnexo.trim() == ""){
                                    irregularidade.descricaoAnexo = null;
                                }
                            }
                        }
                    }

                    if(rnc.status == 1 || rnc.status == 3){
                        if(rnc.cronogramaFile){
                            // rnc.arquivoCronograma = rnc.cronogramaFile.name;
                            formData.append('files-cronograma-'+rnc.id, rnc.cronogramaFile);
                        }
                    }

                    if(rnc.status == 5){
                        if(rnc.listaTratativas){    
                            var ultimaTratativa = {}; 
                            ultimaTratativa = rnc.listaTratativas.reduce((anterior, atual) => (anterior.numeracaoTratativa > atual.numeracaoTratativa) ? anterior : atual);
                            if(ultimaTratativa && ultimaTratativa.listaEvidencias){
                                var listaEvidencias = ultimaTratativa.listaEvidencias.filter(evidencia => { return this.novoObjetoUpload(evidencia) });
                                var evidencia = null;
                                for(evidencia of listaEvidencias){
                                    formData.append('files-evidencias-'+rnc.id, evidencia.file);
                                    if(evidencia.descricaoAnexo && evidencia.descricaoAnexo.trim() == ""){
                                        evidencia.descricaoAnexo = null;
                                    }
                                }
                            }
                        }
                    }

                    if(rnc.status == 1){
                        if(rnc.manifestacaoRncRef.listaEvidenciasManifestacaoRnc){
                            var listaEvidenciasManifestacaoRnc = rnc.manifestacaoRncRef.listaEvidenciasManifestacaoRnc.filter(evidenciaManifestacaoRnc => { return this.novoObjetoUpload(evidenciaManifestacaoRnc) });
                            var evidenciaManifestacaoRnc = null;
                            for(evidenciaManifestacaoRnc of listaEvidenciasManifestacaoRnc){
                                formData.append('files-evidenciasManifestacaoRnc-'+rnc.id, evidenciaManifestacaoRnc.file);
                                if(evidenciaManifestacaoRnc.descricaoAnexo && evidenciaManifestacaoRnc.descricaoAnexo.trim() == ""){
                                    evidenciaManifestacaoRnc.descricaoAnexo = null;
                                }
                            }
                        }
                    }
                }
            );

            formData.append('data', JSON.stringify(requestData));
            return formData;
        },
        requestRNCURL: function(){
            var requestURL = '';
            var id = this.detalhes.id;

            if(this.crudType == 'c'){
                requestURL = `${baseApi}/rnc/criar`;
            } else
            if(this.crudType == 't'){
                requestURL = `${baseApi}/rnc/tratar`;
            } else
            if(this.crudType == 'v'){
                requestURL = `${baseApi}/rnc/validar/${id}`;
            }

            return requestURL;
        }
  },
  data: function() {
    return {
        loadingSalvar: false,
        tab: null,
        detalhes: 
        {
        }
    }
  },
  methods: {
        salvar(){
            
            var requestParameters = this.requestParameters;

            var queryString = "";

            var url = `${requestParameters.url}${queryString}`;

            var requestData = requestParameters.data;

            this.loadingSalvar = true;
            this.$store.commit("setNevoa", {ativo: true, visivel: true});

            axios({
                method: requestParameters.method,
                url: url,
                data: requestData
            }).then(res => {
                res;
                var registro = this.registro;
                if(!registro.identificadorRegistroSistemaAreaDemandanteRnc){
                    registro.identificadorRegistroSistemaAreaDemandanteRnc = res.data.id;
                    this.$emit('registro', registro);
                }
                this.encerraSalvar(true);
            }).catch(error => {
                this.encerraSalvar(false, error);
            });

            
        },
        encerraSalvar(salvar, error){
            this.$store.commit("setNevoa", false);
            this.loadingSalvar = false;
            if(salvar){
                this.show=false;
                this.$toasted.global.defaultSuccess();
            } else {
                showError(error);
            }
        },
        novoObjetoUpload(objetoUpload){
            return (objetoUpload.novo && objetoUpload.nomeArquivo && objetoUpload.descricaoAnexo)
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