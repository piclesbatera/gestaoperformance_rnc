<template>
<!-- INICIA RNC MODAL FORM -->
<v-dialog v-model="show" content-class="container dialog" >
  <v-layout justify-center>
      <v-flex>
        <v-toolbar color="blue" dark>
            <v-toolbar-title>{{pageTitle}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn class="ma-2 no-outline-focus" icon @click.stop="show=false" title="Fechar" >
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
                                    <v-tab :href="'#prazos'" v-if="previewTabPrazo">Prazos</v-tab>
                                    <v-tab :href="'#evidencias'" v-if="previewTabEvidencias">Evidências</v-tab>
                                </v-tabs>
                                <v-tabs-items v-model="tab">
                                    <!-- Detalhes -->
                                    <v-tab-item :value="'detalhes'">
                                        <v-card flat>
                                            <v-card-text>
                                                <div class="container-fluid">
                                                    <div class="row">
                                                        <div class="col-lg-6">
                                                            <div class="form-group">
                                                                <label class="bmd-label-floating label-text" for="areaDemandante">Área Demandante</label><font color="red"> *</font>
                                                                <b-form-select id="areaDemandante" v-model="areaDemandante" name="areaDemandante" :options="areasDemandantes" ></b-form-select>
                                                            </div>
                                                        </div>
                                                        <div class="col-lg-6" >
                                                            <div class="form-group">
                                                                <label class="bmd-label-floating label-text" for="classificacao">Classificação</label><font color="red"> *</font>
                                                                <b-form-select id="classificacao" v-model="classificacao" name="classificacao" :options="classificacoes" ></b-form-select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-lg-6">
                                                            <div class="form-group">
                                                                <label class="bmd-label-floating label-text" for="motivo">Motivo</label><font color="red"> *</font>
                                                                <b-form-select id="motivo" v-model="motivo" name="motivo" :options="motivos" ></b-form-select>
                                                            </div>
                                                        </div>
                                                        <div class="col-lg-6">
                                                            <div class="form-group">
                                                                <label class="bmd-label-floating label-text" for="tipo">Tipo</label><font color="red"> *</font>
                                                                <b-form-select id="tipo" v-model="tipo" name="tipo" :options="tipos" ></b-form-select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-lg-12">
                                                            <label class="bmd-label-floating label-text" for="observacoes">Observações</label>
                                                            <b-form-textarea id="observacoes" no-resize v-model="observacoes" placeholder="Digite uma observação" rows="6" maxLength="200"></b-form-textarea>
                                                            <a @click="showObservacoesHistory_modalView=true;" style="float: right;" title="Abrir o histórico de observações">
                                                                <i class="fa fa-history"></i>
                                                                Visualizar histórico</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </v-card-text>
                                        </v-card>
                                    </v-tab-item>


                                    <!-- Anexos -->
                                    <v-tab-item :value="'anexos'">
                                        <v-card flat>
                                            <v-card-text>
                                                <div class="container-fluid">
                                                    <div class="row">
                                                        <div class="col-lg-12">
                                                            <div class="table-responsive-md">
                                                                <table class="table table-bordered">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Documentação</th>
                                                                            <th>Quantidade</th>
                                                                            <th></th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr v-for="documentacao in listaDocumentacao" :key="documentacao.id" class="trAlign">
                                                                            <td>
                                                                                {{documentacao.Documentacao}}
                                                                            </td>
                                                                            <td>
                                                                                {{documentacao.Quantidade}}
                                                                            </td>
                                                                            <td>
                                                                                <i title="Visualizar anexos" @click="descricaoDocumentacaoClicked = documentacao.Documentacao; showAnexos_modalView=true" class="openDetail fa fa-folder-open"></i>  
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </v-card-text>
                                        </v-card>
                                    </v-tab-item>


                                    <!-- Irregularidades -->
                                    <v-tab-item :value="'irregularidades'">
                                        <v-card flat>
                                            <v-card-text>
                                                <div class="container-fluid">
                                                    <div class="row" v-if="permissionAlterIrregularidades">
                                                        <div class="col-md-12">
                                                            <div class="float-right">
                                                                <v-btn @click="newirregularidade();" class="btn btn-primary form-control" color="blue" dark >
                                                                    <v-icon dark left>
                                                                        mdi-plus
                                                                    </v-icon>
                                                                    Novo
                                                                </v-btn>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <v-divider></v-divider>
                                                    <div v-for="irregularidade in listaIrregularidades" :key="irregularidade.id">
                                                        <div class="row">
                                                            <div class="col-lg-12">
                                                                <h6 v-if="irregularidade.file">{{irregularidade.file.name}}</h6>
                                                            </div>
                                                        </div>
                                                        <div class="row">
                                                            <b-input-group size="sm" class="m-2">
                                                                <b-input-group-prepend is-text>
                                                                    <v-icon @click="deleteIrregularidade(irregularidade);" :disabled="!permissionAlterIrregularidades || (permissionAlterIrregularidades && irregularidade.id) || irregularidade.loadingFile" title="Remover">mdi-delete</v-icon>
                                                                </b-input-group-prepend>
                                                                <b-input-group-prepend is-text>
                                                                    <v-file-input
                                                                        v-if="!irregularidade.loadingFile"
                                                                        @change="uploadTempFile(listaIrregularidades, irregularidade, 'irregularidades')"
                                                                        hide-input
                                                                        :disabled="!permissionAlterIrregularidades"
                                                                        v-model="irregularidade.file"
                                                                        :success="irregularidade.file != null"
                                                                    ></v-file-input>
                                                                    <v-progress-circular :size="24" v-else indeterminate color="primary" ></v-progress-circular>
                                                                </b-input-group-prepend>
                                                                <b-input-group-prepend is-text>
                                                                    <v-icon :disabled="!irregularidade.file" title="Download" @click="downloadIrregularidadeFile(irregularidade);">mdi-download</v-icon>
                                                                </b-input-group-prepend>
                                                                <b-form-input v-model="irregularidade.descricaoAnexoIrregularidade" placeholder="descrição" style="height: 100%;"></b-form-input>
                                                            </b-input-group>
                                                        </div>
                                                    </div>
                                                </div>
                                            </v-card-text>
                                        </v-card>
                                    </v-tab-item>



                                    <!-- Prazos -->
                                    <v-tab-item :value="'prazos'" v-if="previewTabPrazo">
                                        <v-card flat>
                                            <v-card-text>
                                                <div class="container-fluid">
                                                    <div v-for="prazo in listaPrazos" :key="prazo.codigo">
                                                        <div class="row">
                                                            <div class="col-lg-6" >
                                                                <div class="form-group">
                                                                    <label class="bmd-label-floating label-text" :for="'dataPrazo_'+prazo.codigo">Prazo</label><font color="red" v-if="crudType == 't'"> *</font>
                                                                    <b-form-datepicker :min="prazo.minDate" :max="prazo.maxDate" :state="prazo.state" :disabled="crudType == 'v' || prazo.state != null" :id="'dataPrazo_'+prazo.codigo" v-model="prazo.dataPrazo" v-bind="datePickerLabels" locale="pt-BR" class="mb-2"
                                                                        :date-format-options="{
                                                                            year: 'numeric',
                                                                            month: 'numeric',
                                                                            day: 'numeric'
                                                                        }"></b-form-datepicker>
                                                                </div>
                                                            </div>
                                                            <template v-if="validationButtonsPrazo(prazo)">
                                                                <div class="col-lg-3">
                                                                    <div class="form-group">
                                                                        <label class="bmd-label-floating blank-label"></label>
                                                                        <v-btn class="btn btn-danger form-control" color="red" dark @click="prazo.state = false;">
                                                                            Rejeitar
                                                                            <v-icon dark right >
                                                                                mdi-cancel
                                                                            </v-icon>
                                                                        </v-btn>
                                                                    </div>
                                                                </div>
                                                                <div class="col-lg-3">
                                                                    <div class="form-group">
                                                                        <label class="bmd-label-floating blank-label"></label>
                                                                        <v-btn class="btn btn-primary form-control" color="blue" dark @click="prazo.state = true;">
                                                                            Aceitar
                                                                            <v-icon dark right >
                                                                                mdi-checkbox-marked-circle
                                                                            </v-icon>
                                                                        </v-btn>
                                                                    </div>
                                                                </div>
                                                            </template>
                                                        </div>
                                                        <div class="row" v-if="observationField(prazo)">
                                                            <div class="col-lg-12">
                                                                <label class="bmd-label-floating label-text" :for="'observacaoPrazo_'+prazo.codigo">Observação</label>
                                                                <b-form-textarea maxLength="200" :id="'observacaoPrazo_'+prazo.codigo" :disabled="!enableObservacaoPrazo(prazo)" v-model="prazo.observacaoPrazo" placeholder="Digite uma observação" rows="2" no-resize ></b-form-textarea>
                                                            </div>
                                                        </div>
                                                        <v-divider></v-divider>
                                                    </div>
                                                </div>
                                            </v-card-text>
                                        </v-card>
                                    </v-tab-item>


                                    <!-- Evidências -->
                                    <v-tab-item :value="'evidencias'" v-if="previewTabEvidencias">
                                        <v-card flat>
                                            <v-card-text>
                                                <div class="container-fluid">
                                                    <div class="row" v-if="permissionAlterEvidencias">
                                                        <div class="col-md-12">
                                                            <div class="float-right">
                                                                <v-btn @click="newEvidencia();" class="btn btn-primary form-control" color="blue" dark >
                                                                    <v-icon dark left>
                                                                        mdi-plus
                                                                    </v-icon>
                                                                    Novo
                                                                </v-btn>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <v-divider></v-divider>
                                                    <div v-for="evidencia in listaEvidencias" :key="evidencia.id">
                                                        <div class="row">
                                                            <div class="col-lg-12">
                                                                <h6 v-if="evidencia.file">{{evidencia.file.name}}</h6>
                                                            </div>
                                                        </div>
                                                        <div class="row">
                                                            <b-input-group size="sm" class="m-2">
                                                                <b-input-group-prepend is-text>
                                                                    <v-icon @click="deleteEvidencia(evidencia);" :disabled="!permissionAlterEvidencias" title="Remover">mdi-delete</v-icon>
                                                                </b-input-group-prepend>
                                                                <b-input-group-prepend is-text>
                                                                    <v-file-input
                                                                        v-if="!evidencia.loadingFile"
                                                                        @change="uploadTempFile(listaEvidencias, evidencia, 'evidencias', listaEvidencias.indexOf(evidencia))"
                                                                        hide-input
                                                                        :disabled="!permissionAlterEvidencias"
                                                                        v-model="evidencia.file"
                                                                        :success="evidencia.file != null"
                                                                    ></v-file-input>
                                                                    <v-progress-circular :size="24" v-else indeterminate color="primary" ></v-progress-circular>
                                                                </b-input-group-prepend>
                                                                <b-input-group-prepend is-text>
                                                                    <v-icon v-if="evidencia.file" title="Download" @click="downloadEvidenciaFile(evidencia);">mdi-download</v-icon>
                                                                    <v-icon v-else :disabled="true" title="Download">mdi-download</v-icon>
                                                                </b-input-group-prepend>
                                                                <b-form-input v-model="evidencia.descricaoAnexoEvidencia" placeholder="descrição" style="height: 100%;"></b-form-input>
                                                            </b-input-group>
                                                        </div>
                                                    </div>
                                                </div>
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
        <Anexos_modalView :codigoGrupoFila="codigoGrupoFila" :sg="sg" :codigoSg="codigoSg" :descricaoDocumentacao="descricaoDocumentacaoClicked" v-if="showAnexos_modalView" v-model="showAnexos_modalView" />
        <ObservacoesHistory_modalView v-if="showObservacoesHistory_modalView" v-model="showObservacoesHistory_modalView" />
      </v-flex>
    </v-layout>
</v-dialog>
</template>

<script>
import Anexos_modalView from './anexos_modalView'
import ObservacoesHistory_modalView from './observacoesHistory_modalView'
import { baseApi, showError, getDateCalculated } from "@/global";
import axios from "axios";
export default {
    name: "rnc_modalForm",
    components: {
        Anexos_modalView,
        ObservacoesHistory_modalView
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
    pageTitle(){
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
    previewTabPrazo(){
        if(this.crudType == 't' || this.crudType == 'v'){
            return true;
        }
        return false;
    },
    previewTabEvidencias(){
        return ((Array.isArray(this.listaPrazos) && this.listaPrazos.length) && (this.listaPrazos[this.listaPrazos.length - 1].state == true) && (this.crudType == 'v' || this.crudType == 't'));
    },
    permissionAlterEvidencias(){
        return ((Array.isArray(this.listaPrazos) && this.listaPrazos.length) && (this.listaPrazos[this.listaPrazos.length - 1].state == true) && (this.crudType == 't'));
    },
    permissionAlterIrregularidades(){
        return ((this.crudType == 'c' || this.crudType == 'v'));
    },
    createRequestData(){
        var requestData = {};
        requestData['irregularidades'] = this.listaIrregularidades;
        return requestData;
    }
  },
  data: function() {
    return {
        loadingSave: false,
        havingPrazoToAccept: false,
        listaIrregularidades: null,
        listaEvidencias: null,
        listaPrazos: [
            // {
            //     id: 1,
            //     codigo: '001',
            //     dataCadastro: "2020-12-04",
            //     dataPrazo: "2020-12-20",
            //     state: false,
            //     observacaoPrazo: "Observação de teste - 001"
            // },
            // {
            //     id: 2,
            //     codigo: '002',
            //     dataCadastro: "2020-12-04",
            //     dataPrazo: "2020-12-15",
            //     state: true,
            //     observacaoPrazo: "Observação de teste - 002"
            // },
            // {
            //     id: 3,
            //     codigo: '003',
            //     dataPrazo: "2020-12-10",
            //     state: null,
            //     observacaoPrazo: ""
            // }
        ],
        listaDocumentacao: [],
        descricaoDocumentacaoClicked: "",
        showObservacoesHistory_modalView: false,
        loadingDocumentacao: false,
        showAnexos_modalView: false,
        idDocumentacaoClicked: "",
        tab: null,
        areaDemandante: null,
        classificacao: null,
        motivo: null,
        tipo: null,
        observacoes: null,
        areasDemandantes: [
            { "value": null, "text": "Selecione uma área demandante" }
        ],
        classificacoes: [
            { "value": null, "text": "Selecione uma classificação" }
        ],
        motivos: [
            { "value": null, "text": "Selecione um motivo" }
        ],
        tipos: [
            { "value": null, "text": "Selecione um tipo" }
        ],
        datePickerLabels: {
        labelPrevDecade: "Década anterior",
        labelPrevYear: "Ano anterior",
        labelPrevMonth: "Mês passado",
        labelCurrentMonth: "Mês atual",
        labelNextMonth: "Próximo mês",
        labelNextYear: "Próximo ano",
        labelNextDecade: "Próxima década",
        labelToday: "Hoje",
        labelSelected: "Data selecionada",
        labelNoDateSelected: "Sem data escolhida",
        labelCalendar: "Calendário",
        labelNav: "Navegação no calendário",
        labelHelp: "Navegue pelo calendário com as setas do teclado"
      }
    }
  },
  methods: {
        uploadTempFile(listObject, object, folder, id){
            let formData = new FormData();
            formData.append('file', object.file);

            if(!this.filesValidation(listObject, object)){
                return false;
            }

            var queryString = (id != null && id != undefined) ? `?id=${id}` : "";

            var url = `${baseApi}/upload/temp/${folder}${queryString}`;

            object.loadingFile = true;

            axios.post(url, formData, { headers: {'Content-Type': 'multipart/form-data'} }).then(res => {
                object.filename = object.file.name;
                object.loadingFile = false;
            }).catch(error => {
                object.filename = null;
                object.file = null;
                object.loadingFile = false;
                showError(error);
            });
            
        },
        filesValidation(listObject, object){
            var contains = false;
            var highSize = false;
            listObject.forEach( 
                (item) => 
                {
                    if(item.file && item != object){
                        if(object.file.name == item.file.name){
                            contains = true;
                        }
                    }
                }
            );
            if(object.file.size > 15728640){
                highSize = true;
            }

            if(contains || highSize){
                if(contains){
                    object.filename = null;
                    object.file = null;
                    showError('O nome do arquivo já está sendo utilizado.');
                }
                if(highSize){
                    object.filename = null;
                    object.file = null;
                    showError('O arquivo não pode ser maior do que 15MB');
                }
                return false;
            }

            return true;
        },
        save(){

            var queryString = "";

            var url = `${baseApi}/rnc/${queryString}`;

            this.loadingSave = true;

            axios.post(url, this.createRequestData, { headers: {'Content-Type': 'application/json'} }).then(res => {
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
        renameFile(file, appendName){
            var blob = file.slice(0, file.size);
            var newFile = new File([blob], appendName + file.name);
            file = newFile;
        },
        initHavingPrazoToAccept(){
            if( this.crudType == 'v' && (this.listaPrazos[this.listaPrazos.length-1].state == null) ){
                this.havingPrazoToAccept = true;
            }
        },
        validationButtonsPrazo(prazo){
            const index = this.listaPrazos.indexOf(prazo);
            var showValidationButtonsPrazo = 
            (
                (this.havingPrazoToAccept)
                &&
                (index == (this.listaPrazos.length-1))
            );
            return showValidationButtonsPrazo;
        },
        enableObservacaoPrazo(prazo){
            const index = this.listaPrazos.indexOf(prazo);
            var enableObservacaoPrazo = 
            (
                (this.havingPrazoToAccept)
                &&
                (index == (this.listaPrazos.length-1))
            );
            return enableObservacaoPrazo;
        },
        downloadIrregularidadeFile(irregularidade){
            var irregularidadeFile = irregularidade.file;

            const url = window.URL.createObjectURL(irregularidadeFile);
            var a = document.createElement("a");
            a.href = url;
            a.download = irregularidadeFile.name;
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            // window.open(url);
        },
        newirregularidade(){
            if(this.permissionAlterIrregularidades){
                if(!this.listaIrregularidades){
                    this.listaIrregularidades = [];
                }

                var irregularidade = {
                    id: null,
                    descricaoAnexoIrregularidade: "",
                    file: null,
                    filename: null,
                    loadingFile: false
                };
                this.listaIrregularidades.push(irregularidade);
            }
            
        },
        deleteIrregularidade(irregularidade){
            const index = this.listaIrregularidades.indexOf(irregularidade);
            this.listaIrregularidades.splice(index, 1);
        },
        downloadEvidenciaFile(evidencia){
            var evidenciaFile = evidencia.file;

            const url = window.URL.createObjectURL(evidenciaFile);
            var a = document.createElement("a");
            a.href = url;
            a.download = evidenciaFile.name;
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            // window.open(url);
        },
        newEvidencia(){
            if(this.previewTabEvidencias && this.permissionAlterEvidencias){
                if(!this.listaEvidencias){
                    this.listaEvidencias = [];
                }

                var evidencia = {
                    id: null,
                    descricaoAnexoEvidencia: "",
                    file: null,
                    loadingFile: false
                };
                this.listaEvidencias.push(evidencia);
            }
        },
        deleteEvidencia(evidencia){
            const index = this.listaEvidencias.indexOf(evidencia);
            this.listaEvidencias.splice(index, 1);
        },
        getDocumentacao(){
            this.loadingDocumentacao = true;

            var queryString = `?codigoGrupoFila=${this.codigoGrupoFila}`;
            var url = `${baseApi}/rnc/sg/documentacao/${this.sg}/${this.codigoSg}${queryString}`;

            axios.get(url).then(res => {
                
                this.listaDocumentacao = res.data;

                this.loadingDocumentacao = true;
            }).catch(error => {
                this.loadingDocumentacao = true;
                showError(error);
            });
        },
        initCriacaoRNC(){
            if(this.crudType == 'c'){
                this.initIrregularidades();
            }
        },
        initTratarRNC(){
            if(this.crudType == 't'){
                this.criaPrazos();
                this.initEvidencias();
            }
        },
        criaPrazos(){
            var minDate = new Date();
            var maxDate = null;
            if(Array.isArray(this.listaPrazos) && this.listaPrazos.length){
                if(this.listaPrazos[this.listaPrazos.length - 1].state == false){
                    var codigo = (parseInt(this.listaPrazos[this.listaPrazos.length - 1].codigo) + 1).toString();
                    codigo = codigo.padStart(3, "0");
                    maxDate = getDateCalculated(this.listaPrazos[this.listaPrazos.length-1].dataPrazo, -5);
                    var prazoEstendido = {
                        id: null,
                        codigo: codigo,
                        dataPrazo: "",
                        state: null,
                        observacaoPrazo: "",
                        maxDate: maxDate,
                        minDate: minDate
                    };
                    this.listaPrazos.push(prazoEstendido);
                }
            } else {
                maxDate = new Date();
                maxDate.setDate(maxDate.getDate() + 20);
                this.listaPrazos = [
                    {
                        id: null,
                        codigo: '001',
                        dataPrazo: "",
                        state: null,
                        observacaoPrazo: "",
                        maxDate: maxDate,
                        minDate: minDate,
                        createdDate: null
                    }
                ];
            }
        },
        initValidarRNC(){
            if(this.crudType == 'v'){
                this.initHavingPrazoToAccept();
                this.initIrregularidades();
            }
        },
        initIrregularidades(){
            this.newirregularidade();
        },
        initEvidencias(){
            this.newEvidencia()
        },
        observationField(prazo){
            return this.crudType == 'v' || (this.crudType == 't' && prazo.state != null);
        },
        observacaoLength(prazo){
            if(prazo.observacaoPrazo.length == 0 ){
                return null;
            } else
            if(prazo.observacaoPrazo.length > 100){
                return false;
            } else {
                return true;
            }
        }
  },
  created: function(){
      this.getDocumentacao();
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

div.v-card.v-sheet{
  background-color: #f7f7f7;
}

.openDetail{
    cursor: pointer;
    font-size: x-large;
    color: #ffa200a8;
} 

.table td, .table th {
    padding: .25rem .75rem;
}


</style>


<style>
.v-application--is-ltr .v-input__prepend-outer {
    margin: 0px;
}
</style>