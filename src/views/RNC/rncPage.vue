<template>
    <div :id="'rnc_'+crudType" :class="'rnc_'+crudType">
        <h3>{{pageTitle}}</h3>
        <fieldset class="border p-2">
            <legend class="w-auto">Consulta</legend>
                <form @submit.prevent="search">
                    <div class="row">
                        <div class="col-lg-2">
                            <div class="form-group">
                                <label class="bmd-label-floating label-text" for="searchFor">Consulta por</label><font color="red"> *</font>
                                <b-form-select id="searchFor" v-model="searchFor" name="searchFor" :options="searchForOptions" ></b-form-select>
                            </div>
                        </div>
                        <div class="col-lg-2" >
                            <div class="form-group">
                                <label class="bmd-label-floating label-text" for="searchValue">
                                    <span>
                                        {{labelValue}}
                                    </span>   
                                </label>
                                <b-form-input id="searchValue" v-model="searchValue" name="searchValue" placeholder="Valor de consulta"></b-form-input>
                            </div>
                        </div>
                        <div class="col-lg-2" v-if="needRNC">
                            <div class="form-group">
                                <label class="bmd-label-floating label-text" for="searchValueRNC">
                                    <span>
                                        RNC
                                    </span>   
                                </label>
                                <b-form-input id="searchValueRNC" v-model="searchValueRNC" name="searchValueRNC" placeholder="Busca por RNC"></b-form-input>
                            </div>
                        </div>
                        <div class="col-lg-2">
                            <div class="form-group">
                                <label class="bmd-label-floating blank-label"></label>
                                <v-btn
                                    class="btn btn-primary form-control"
                                    :loading="loadingSearch"
                                    :disabled="loadingSearch"
                                    color="blue"
                                    type="submit"
                                >
                                Buscar
                                </v-btn>
                            </div>
                        </div>
                        <div class="col-lg-2" right>
                            <div class="form-group">
                                <label class="bmd-label-floating blank-label"></label>
                                <v-btn @click="advancedSearchButton();" class="btn btn-primary form-control" color="blue" dark >
                                    <v-icon title="Filtros Avançados">mdi-magnify</v-icon>
                                    Filtros avançados
                                </v-btn>
                            </div>
                        </div>
                    </div>
                    <div class="row" v-if="advancedSearch">
                        <div class="col-lg-12">
                            <fieldset class="border p-2">
                                <legend class="w-auto">Filtros Avançados</legend>
                                <div v-if="searchFor == 'sgi'">
                                    <div class="row">
                                        <div class="col-lg-2" >
                                            <div class="form-group">
                                                <label class="bmd-label-floating label-text" for="advancedSearchSgiUF">
                                                    <span>
                                                        UF
                                                    </span>   
                                                </label>
                                                <b-form-select id="advancedSearchSgiUF" v-model="advancedSearchSgiUF" name="advancedSearchSgiUF" :options="UFOptions" ></b-form-select>
                                            </div>
                                        </div>
                                        <div class="col-lg-2" >
                                            <div class="form-group">
                                                <label class="bmd-label-floating label-text" for="advancedSearchSgiProjeto">
                                                    <span>
                                                        Projeto
                                                    </span>   
                                                </label>
                                                <b-form-input id="advancedSearchSgiProjeto" v-model="advancedSearchSgiProjeto" name="advancedSearchSgiProjeto" placeholder="Nome do Projeto"></b-form-input>
                                            </div>
                                        </div>
                                        <div class="col-lg-2" >
                                            <div class="form-group">
                                                <label class="bmd-label-floating label-text" for="advancedSearchSgiEmpreiteiraProjeto">
                                                    <span>
                                                        Empreiteira Projeto
                                                    </span>   
                                                </label>
                                                <b-form-input id="advancedSearchSgiEmpreiteiraProjeto" v-model="advancedSearchSgiEmpreiteiraProjeto" name="advancedSearchSgiEmpreiteiraProjeto" placeholder="Nome da Empreiteira Projeto"></b-form-input>
                                            </div>
                                        </div>
                                        <div class="col-lg-2" >
                                            <div class="form-group">
                                                <label class="bmd-label-floating label-text" for="advancedSearchSgiEmpreiteiraConstrucao">
                                                    <span>
                                                        Empreiteira Construção
                                                    </span>   
                                                </label>
                                                <b-form-input id="advancedSearchSgiEmpreiteiraConstrucao" v-model="advancedSearchSgiEmpreiteiraConstrucao" name="advancedSearchSgiEmpreiteiraConstrucao" placeholder="Nome da Empreiteira Construção"></b-form-input>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-else>
                                    <div class="row">
                                        <div class="col-lg-2" >
                                            <div class="form-group">
                                                <label class="bmd-label-floating label-text" for="advancedSearchSgpTipoAcionamento">
                                                    <span>
                                                        Tipo Acionamento
                                                    </span>   
                                                </label>
                                                <b-form-select id="advancedSearchSgpTipoAcionamento" v-model="advancedSearchSgpTipoAcionamento" name="advancedSearchSgpTipoAcionamento" :options="tipoAcionamentoOptions" ></b-form-select>
                                            </div>
                                        </div>
                                        <div class="col-lg-2" >
                                            <div class="form-group">
                                                <label class="bmd-label-floating label-text" for="advancedSearchSgpUF">
                                                    <span>
                                                        UF
                                                    </span>   
                                                </label>
                                                <b-form-select id="advancedSearchSgpUF" v-model="advancedSearchSgpUF" name="advancedSearchSgpUF" :options="UFOptions" ></b-form-select>
                                            </div>
                                        </div>
                                        <div class="col-lg-2" >
                                            <div class="form-group">
                                                <label class="bmd-label-floating label-text" for="advancedSearchSgpEmpreiteira">
                                                    <span>
                                                        Empreiteira
                                                    </span>   
                                                </label>
                                                <b-form-input id="advancedSearchSgpEmpreiteira" v-model="advancedSearchSgpEmpreiteira" name="advancedSearchSgpEmpreiteira" placeholder="Nome da Empreiteira"></b-form-input>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </form>
        </fieldset>
        <div class="row">
            <div class="col-lg-12">
                <v-container fluid grid-list-md>
                    <v-card-title>
                    
                    <v-spacer></v-spacer>
                    <v-text-field v-model="searchDataTable" append-icon="mdi-magnify" label="Pesquisa" single-line hide-details></v-text-field>
                    </v-card-title>
                    <v-divider></v-divider>
                    <div class="scrollable">
                        <v-data-table class="default_color_background" :headers="headersSearch" :items="listaSearch" :search="searchDataTable" :loading="loadingSearch" loading-text="Carregando..." no-data-text="Sem dados disponíveis">
                            <template v-slot:item.detail="{ item }">
                                <i :title="titleDetail" @click="clickOpenDetail(item);" class="openDetail fa fa-edit"></i>
                            </template>
                        </v-data-table>
                    </div>
            </v-container>  
            </div>
        </div>
        <Rnc_modalForm :crudType="crudType" :sg="sgClicked" :codigoGrupoFila="codigoGrupoFilaClicked" v-if="showRnc_modalForm" :codigoSg="codigoSgClicked" v-model="showRnc_modalForm" :descricaoTituloSg="descricaoTituloSgClicked"/>
    </div>  
</template>

<script>
import Rnc_modalForm from './rnc_modalForm'
import { baseApi, showError, showAllErrorScope, cleanErrorsScope } from "@/global";
import axios from "axios";
import tipoAcionamentoOptions from "@/assets/json/sgp/tipoAcionamento.json";
import UFOptions from "@/assets/json/brasil/UF.json";

export default {
    name: "rncPage",
    props: {
        crudType: {
            default: "invalid",
            type: String
        }
    },
    computed: {
        titleDetail: function(){
            var titleDetail = "";
            if(this.crudType == 'c'){
                titleDetail = "Criar RNC";
            } else
            if(this.crudType == 't'){
                titleDetail = "Tratar RNC";
            } else
            if(this.crudType == 'v'){
                titleDetail = "Validar RNC";
            }
            return titleDetail;
        },
        needRNC: function(){
            if(this.crudType == 't' || this.crudType == 'v'){
                return true;
            }
            return false;
        },
        headersSearch: function(){
            if(this.searchFor == 'sgi'){
                return this.headerSgi;
            } else {
                return this.headerSgp;
            }
        },
        listaSearch: function(){
            if(this.searchFor == 'sgi'){
                return this.sgiSearchResult;
            } else {
                return this.sgpSearchResult;
            }
        },
        pageTitle: function(){
            var title = "RNC";
            if(this.crudType == 'c'){
                title = 'Criação de RNC';
            } else
            if(this.crudType == 't'){
                title = 'Tratar RNC';
            } else
            if(this.crudType == 'v'){
                title = 'Validar RNC';
            } else {
                title = 'RNC';
            }

            return title;
        },
        labelValue: function(){
            var label = "GL";

            if(this.searchFor == 'sgi'){
                label = "ID";
            } else {
                label = "GL";
            }
            return label;
        }
    },
    components: {
        Rnc_modalForm
    },
    data: function() {
        return {
            searchDataTable: "",
            UFOptions,
            tipoAcionamentoOptions,
            loadingSearch: false,
            codigoGrupoFilaClicked: "",
            sgClicked: "",
            descricaoTituloSgClicked: "",
            codigoSgClicked: "",
            searchFor: "sgi",
            searchValue: "",
            searchValueRNC: "",
            showRnc_modalForm: false,
            searchForOptions: [
                { "value": "sgi", "text": "SGI" },
                { "value": "sgp", "text": "SGP" }
            ],
            sgiSearchResult: [
                
            ],
            sgpSearchResult: [

            ],
            headerSgi: [
                { text: 'Fila', value: 'Status' },
                { text: 'ID', value: 'ID' },
                { text: 'Projeto', value: 'Projeto' },
                { text: 'UF', value: 'UF' },
                { text: 'ID OPD', value: 'ID_OPD' },
                { text: 'Empreiteira Projeto', value: 'Empreiteira' },
                { text: 'Empreiteira Construção', value: 'EmpreiteiraConstrucao' },
                {
                text: '',
                sortable: false,
                value: 'detail',
                }
            ],
            headerSgp: [
                { text: 'Tipo Acionamento', value: 'TIPO ACIONAMENTO' },
                { text: 'GL', value: 'GL' },
                { text: 'Projeto', value: 'PROJETO' },
                { text: 'UF', value: 'UF' },
                { text: 'Cliente', value: 'CLIENTE' },
                { text: 'GP Cliente', value: 'GPCliente' },
                { text: 'Empreiteira', value: 'FORNECEDOR' },
                {
                text: '',
                sortable: false,
                value: 'detail',
                }
            ],
            // ADVANCED SEARCH
            advancedSearch: false,

            // SGI
            advancedSearchSgiEmpreiteiraProjeto: "",
            advancedSearchSgiEmpreiteiraConstrucao: "",
            advancedSearchSgiUF: "",
            advancedSearchSgiProjeto: "",

            // SGP
            advancedSearchSgpTipoAcionamento: "",
            advancedSearchSgpEmpreiteira: "",
            advancedSearchSgpUF: "",
        };
    },
    methods: {
        clickOpenDetail(sg){
            if(sg.detail == 'sgi'){
                this.codigoGrupoFilaClicked = ''; 
                this.sgClicked = 'sgi'; 
                this.codigoSgClicked = sg.ID; 
                this.descricaoTituloSgClicked= sg.descricaoTituloSg;
                this.showRnc_modalForm=true;
            } else
            if(sg.detail == 'sgp') {
                this.codigoGrupoFilaClicked = sg.codigoGrupoFila;
                this.sgClicked = 'sgp'; 
                this.codigoSgClicked = sg.GL; 
                this.descricaoTituloSgClicked= sg.descricaoTituloSg;
                this.showRnc_modalForm=true;
            }
        },
        advancedSearchButton(){
            this.advancedSearch=!this.advancedSearch;
        },
        search(){
            var searchFor = this.searchFor;
            var errors = {};

            errors = this.validatesErrorsSg();

            this.deleteSearchSg();

            if(Object.keys(errors).length === 0){

                this.loadingSearch = true;

                var url = this.getUrlSg();

                axios.get(url).then(res => {
                    var scope = `#rnc_${this.crudType}`;
                    cleanErrorsScope(scope);

                    this.insertSearchSg(searchFor, res.data);

                    this.loadingSearch = false;
                })
                .catch(error => {
                    this.loadingSearch = false;
                    showError(error);
                });

            } else {
                var scope = `#rnc_${this.crudType}`;
                showAllErrorScope(errors, scope);
            }
        },
        getUrlSg(){
            var queryString = this.getParametersSg();

            var url = `${baseApi}/rnc/sg/${this.searchFor}/${queryString}`;

            return url;
        },
        getParametersSg(){
            var queryString = '?';

            if(this.searchValue){
                queryString += '&codigoEmissao=' + this.searchValue;
            }

            if(this.searchValueRNC && this.this.needRNC){
                queryString += '&codigoRNC=' + this.searchValueRNC;
            }

            if(this.advancedSearchSgiUF && this.advancedSearch && this.searchFor == 'sgi'){
                queryString += '&UF=' + this.advancedSearchSgiUF;
            }

            if(this.advancedSearchSgiProjeto && this.advancedSearch && this.searchFor == 'sgi'){
                queryString += '&descricaoProjeto=' + this.advancedSearchSgiProjeto;
            }

            if(this.advancedSearchSgiEmpreiteiraProjeto && this.advancedSearch && this.searchFor == 'sgi'){
                queryString += '&descricaoEmpreiteiraProjeto=' + this.advancedSearchSgiEmpreiteiraProjeto;
            }
            if(this.advancedSearchSgiEmpreiteiraConstrucao && this.advancedSearch && this.searchFor == 'sgi'){
                queryString += '&descricaoEmpreiteiraConstrucao=' + this.advancedSearchSgiEmpreiteiraConstrucao;
            }

    
            if(this.advancedSearchSgpUF && this.advancedSearch && this.searchFor == 'sgp'){
                queryString += '&UF=' + this.advancedSearchSgpUF;
            }

            if(this.advancedSearchSgpTipoAcionamento && this.advancedSearch && this.searchFor == 'sgp'){
                queryString += '&tipoAcionamento=' + this.advancedSearchSgpTipoAcionamento;
            }
            if(this.advancedSearchSgpEmpreiteira && this.advancedSearch && this.searchFor == 'sgp'){
                queryString += '&descricaoEmpreiteira=' + this.advancedSearchSgpEmpreiteira;
            }

            return queryString;

        },
        validatesErrorsSg(){
            var errors = {};

            if(!this.searchFor){
                errors['searchFor'] = 'é obrigatório';
            }
            if(!this.advancedSearch){
                if(!this.searchValue &&
                
                (
                    (this.needRNC && !this.searchValueRNC) || (this.crudType != 't')
                )

                ){
                    errors['searchValue'] = 'é obrigatório';

                    if(this.needRNC && !this.searchValueRNC){
                        errors['searchValueRNC'] = 'é obrigatório';
                    }
                }
            // ADVANCED VALIDATE
            } else {
                if(this.searchFor == 'sgi'){
                    if(!this.searchValue 
                    && 
                    (
                        (this.needRNC && !this.searchValueRNC) || (this.crudType != 't')
                    ) 
                    &&
                    // ADVANCED CONDITION
                    !this.advancedSearchSgiUF && !this.advancedSearchSgiProjeto && !this.advancedSearchSgiEmpreiteiraProjeto && !this.advancedSearchSgiEmpreiteiraConstrucao){

                        errors['searchValue'] = 'é obrigatório';

                        if(this.needRNC && !this.searchValueRNC){
                            errors['searchValueRNC'] = 'é obrigatório';
                        }

                        // ADVANCED FORM
                        errors['advancedSearchSgiUF'] = 'é obrigatório';
                        errors['advancedSearchSgiProjeto'] = 'é obrigatório';
                        errors['advancedSearchSgiEmpreiteiraProjeto'] = 'é obrigatório';
                        errors['advancedSearchSgiEmpreiteiraConstrucao'] = 'é obrigatório';
                    }
                } else {
                    if(!this.searchValue 
                    && 
                    (
                        (this.needRNC && !this.searchValueRNC) || (this.crudType != 't')
                    ) 
                    &&
                    // ADVANCED CONDITION
                    !this.advancedSearchSgpTipoAcionamento && !this.advancedSearchSgpUF && !this.advancedSearchSgpEmpreiteira){

                        errors['searchValue'] = 'é obrigatório';

                        if(this.needRNC && !this.searchValueRNC){
                            errors['searchValueRNC'] = 'é obrigatório';
                        }

                        // ADVANCED FORM
                        errors['advancedSearchSgpTipoAcionamento'] = 'é obrigatório';
                        errors['advancedSearchSgpUF'] = 'é obrigatório';
                        errors['advancedSearchSgpEmpreiteira'] = 'é obrigatório';
                    }
                }
            }

            if(this.searchValue && this.searchValueRNC && this.needRNC){
                errors['searchValue'] = 'não pode ser preenchido junto a RNC';
                errors['searchValueRNC'] = 'não pode ser preenchido junto a '+ this.labelValue;
            }

            return errors;
        },
        deleteSearchSg(){
            if(this.searchFor == 'sgi'){
                this.sgiSearchResult = [];
            } else 
            if(this.searchFor == 'sgp') {
                this.sgpSearchResult = [];
            }
        },
        insertSearchSg(searchFor, data){
            if(searchFor == 'sgi'){
                var sgiSearchResult = data;

                sgiSearchResult.forEach( 
                (item) => 
                    {
                    item['detail'] = 'sgi';
                    }
                );

                this.sgiSearchResult = sgiSearchResult;
            } else 
            if(searchFor == 'sgp') {
                var sgpSearchResult = data;

                sgpSearchResult.forEach( 
                (item) => 
                    {
                    item['detail'] = 'sgp';
                    }
                );

                this.sgpSearchResult = sgpSearchResult;
            }
        }
    },
    watch: {
        searchFor: function(newValue, oldValue){
            if(newValue != oldValue){
                var scope = `#rnc_${this.crudType}`;
                cleanErrorsScope(scope);
                this.searchValue = "";
                this.searchValueRNC = "";
            }
        },
        searchValue: function(newValue, oldValue){
            if(newValue != oldValue && newValue != ""){
                this.searchValueRNC = "";
            }
        },
        searchValueRNC: function(newValue, oldValue){
            if(newValue != oldValue && newValue != ""){
                this.searchValue = "";
            }
        }
    }
};
</script>

<style scoped>

.default_color_background{
  background-color: #f7f7f7;
}

.btn-primary{
    color: #fff;
    background-color: #007bff;
    border-color: #007bff;
}

.openDetail{
    cursor: pointer;
    font-size: x-large;
} 

</style>

<style >
/* .scrollable{
    max-height: 830px;
    overflow-y: auto;
}
.scrollable .v-data-footer{
    position: sticky;
    background-color: #f7f7f7;
    bottom: 0px;
} */
</style>
