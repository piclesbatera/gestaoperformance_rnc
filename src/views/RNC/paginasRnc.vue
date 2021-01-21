<template>
    <div :id="'rnc_'+crudType" :class="'rnc_'+crudType">
        <h3>{{tituloPagina}}</h3>
        <fieldset class="border p-2">
            <legend class="w-auto">Consulta</legend>
                <form @submit.prevent="consulta">
                    <div class="row">
                        <div class="col-lg-2">
                            <div class="form-group">
                                <label class="bmd-label-floating label-text" for="consultaPor">Consulta por</label><font color="red"> *</font>
                                <b-form-select id="consultaPor" v-model="consultaPor" name="consultaPor" :options="consultaPorOptions" ></b-form-select>
                            </div>
                        </div>
                        <div class="col-lg-2" >
                            <div class="form-group">
                                <label class="bmd-label-floating label-text" for="valorConsulta">
                                    <span>
                                        {{valorLabel}}
                                    </span>   
                                </label>
                                <b-form-input id="valorConsulta" v-model="valorConsulta" name="valorConsulta" placeholder="Valor de consulta"></b-form-input>
                            </div>
                        </div>
                        <div class="col-lg-2" v-if="temRNC">
                            <div class="form-group">
                                <label class="bmd-label-floating label-text" for="valorConsultaRNC">
                                    <span>
                                        RNC
                                    </span>   
                                </label>
                                <b-form-input id="valorConsultaRNC" v-model="valorConsultaRNC" name="valorConsultaRNC" placeholder="Busca por RNC"></b-form-input>
                            </div>
                        </div>
                        <div class="col-lg-2">
                            <div class="form-group">
                                <label class="bmd-label-floating blank-label"></label>
                                <v-btn
                                    class="btn btn-primary form-control"
                                    :loading="loadingConsulta"
                                    :disabled="loadingConsulta"
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
                                <v-btn @click="consultaAvancadaButton();" class="btn btn-primary form-control" color="blue" dark >
                                    <v-icon title="Filtros Avançados">mdi-magnify</v-icon>
                                    Filtros avançados
                                </v-btn>
                            </div>
                        </div>
                    </div>
                    <div class="row" v-if="consultaAvancada">
                        <div class="col-lg-12">
                            <fieldset class="border p-2">
                                <legend class="w-auto">Filtros Avançados</legend>
                                <div v-if="consultaPor == 'sgi'">
                                    <div class="row">
                                        <div class="col-lg-2" >
                                            <div class="form-group">
                                                <label class="bmd-label-floating label-text" for="consultaAvancadaSgiUF">
                                                    <span>
                                                        UF
                                                    </span>   
                                                </label>
                                                <b-form-select id="consultaAvancadaSgiUF" v-model="consultaAvancadaSgiUF" name="consultaAvancadaSgiUF" :options="UFOptions" ></b-form-select>
                                            </div>
                                        </div>
                                        <div class="col-lg-2" >
                                            <div class="form-group">
                                                <label class="bmd-label-floating label-text" for="consultaAvancadaSgiProjeto">
                                                    <span>
                                                        Projeto
                                                    </span>   
                                                </label>
                                                <b-form-input id="consultaAvancadaSgiProjeto" v-model="consultaAvancadaSgiProjeto" name="consultaAvancadaSgiProjeto" placeholder="Nome do Projeto"></b-form-input>
                                            </div>
                                        </div>
                                        <div class="col-lg-2" >
                                            <div class="form-group">
                                                <label class="bmd-label-floating label-text" for="consultaAvancadaSgiEmpreiteiraProjeto">
                                                    <span>
                                                        Empreiteira Projeto
                                                    </span>   
                                                </label>
                                                <b-form-input id="consultaAvancadaSgiEmpreiteiraProjeto" v-model="consultaAvancadaSgiEmpreiteiraProjeto" name="consultaAvancadaSgiEmpreiteiraProjeto" placeholder="Nome da Empreiteira Projeto"></b-form-input>
                                            </div>
                                        </div>
                                        <div class="col-lg-2" >
                                            <div class="form-group">
                                                <label class="bmd-label-floating label-text" for="consultaAvancadaSgiEmpreiteiraConstrucao">
                                                    <span>
                                                        Empreiteira Construção
                                                    </span>   
                                                </label>
                                                <b-form-input id="consultaAvancadaSgiEmpreiteiraConstrucao" v-model="consultaAvancadaSgiEmpreiteiraConstrucao" name="consultaAvancadaSgiEmpreiteiraConstrucao" placeholder="Nome da Empreiteira Construção"></b-form-input>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-else>
                                    <div class="row">
                                        <div class="col-lg-2" >
                                            <div class="form-group">
                                                <label class="bmd-label-floating label-text" for="consultaAvancadaSgpTipoAcionamento">
                                                    <span>
                                                        Tipo Acionamento
                                                    </span>   
                                                </label>
                                                <b-form-select id="consultaAvancadaSgpTipoAcionamento" v-model="consultaAvancadaSgpTipoAcionamento" name="consultaAvancadaSgpTipoAcionamento" :options="tipoAcionamentoOptions" ></b-form-select>
                                            </div>
                                        </div>
                                        <div class="col-lg-2" >
                                            <div class="form-group">
                                                <label class="bmd-label-floating label-text" for="consultaAvancadaSgpUF">
                                                    <span>
                                                        UF
                                                    </span>   
                                                </label>
                                                <b-form-select id="consultaAvancadaSgpUF" v-model="consultaAvancadaSgpUF" name="consultaAvancadaSgpUF" :options="UFOptions" ></b-form-select>
                                            </div>
                                        </div>
                                        <div class="col-lg-2" >
                                            <div class="form-group">
                                                <label class="bmd-label-floating label-text" for="consultaAvancadaSgpEmpreiteira">
                                                    <span>
                                                        Empreiteira
                                                    </span>   
                                                </label>
                                                <b-form-input id="consultaAvancadaSgpEmpreiteira" v-model="consultaAvancadaSgpEmpreiteira" name="consultaAvancadaSgpEmpreiteira" placeholder="Nome da Empreiteira"></b-form-input>
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
                    <v-text-field v-model="consultaDataTable" append-icon="mdi-magnify" label="Pesquisa" single-line hide-details></v-text-field>
                    </v-card-title>
                    <v-divider></v-divider>
                    <div class="scrollable">
                        <v-data-table class="default_color_background" :headers="headersConsulta" :items="listaConsulta" :consulta="consultaDataTable" :loading="loadingConsulta" loading-text="Carregando..." no-data-text="Sem dados disponíveis">
                            <template v-slot:item.detail="{ item }">
                                <i :title="titleDetail" @click="abreRegistroSelecionado(item);" class="openDetail fa fa-edit"></i>
                            </template>
                        </v-data-table>
                    </div>
            </v-container>  
            </div>
        </div>
        <Rnc_modalForm :crudType="crudType" :identificadorAreaDemandanteRnc="identificadorAreaDemandanteRncClicado" :sg="sgClicado" :codigoGrupoFila="codigoGrupoFilaClicado" v-if="showRnc_modalForm" :codigoSg="codigoSgClicado" v-model="showRnc_modalForm" :descricaoTituloSg="descricaoTituloSgClicado"/>
    </div>  
</template>

<script>
import Rnc_modalForm from './rnc_modalForm'
import { baseApi, showError, showAllErrorScope, cleanErrorsScope } from "@/global";
import axios from "axios";
import tipoAcionamentoOptions from "@/assets/json/sgp/tipoAcionamento.json";
import UFOptions from "@/assets/json/brasil/UF.json";

export default {
    name: "paginasRnc",
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
        temRNC: function(){
            if(this.crudType == 't' || this.crudType == 'v'){
                return true;
            }
            return false;
        },
        headersConsulta: function(){
            if(this.consultaPor == 'sgi'){
                return this.headerSgi;
            } else {
                return this.headerSgp;
            }
        },
        listaConsulta: function(){
            if(this.consultaPor == 'sgi'){
                return this.sgiResultadoConsulta;
            } else {
                return this.sgpResultadoConsulta;
            }
        },
        tituloPagina: function(){
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
        valorLabel: function(){
            var label = "GL";

            if(this.consultaPor == 'sgi'){
                label = "ID";
            } else {
                label = "GL";
            }
            return label;
        },
        urlSg: function(){
            var queryString = this.parametrosSg;

            var url = `${baseApi}/rnc/sg/${this.crudType}/${this.consultaPor}${queryString}`;

            return url;
        },
        parametrosSg: function(){
            var queryString = '?';

            if(this.valorConsulta){
                queryString += '&codigoEmissao=' + this.valorConsulta;
            }

            if(this.valorConsultaRNC && this.this.temRNC){
                queryString += '&codigoRNC=' + this.valorConsultaRNC;
            }

            if(this.consultaAvancadaSgiUF && this.consultaAvancada && this.consultaPor == 'sgi'){
                queryString += '&UF=' + this.consultaAvancadaSgiUF;
            }

            if(this.consultaAvancadaSgiProjeto && this.consultaAvancada && this.consultaPor == 'sgi'){
                queryString += '&descricaoProjeto=' + this.consultaAvancadaSgiProjeto;
            }

            if(this.consultaAvancadaSgiEmpreiteiraProjeto && this.consultaAvancada && this.consultaPor == 'sgi'){
                queryString += '&descricaoEmpreiteiraProjeto=' + this.consultaAvancadaSgiEmpreiteiraProjeto;
            }
            if(this.consultaAvancadaSgiEmpreiteiraConstrucao && this.consultaAvancada && this.consultaPor == 'sgi'){
                queryString += '&descricaoEmpreiteiraConstrucao=' + this.consultaAvancadaSgiEmpreiteiraConstrucao;
            }

    
            if(this.consultaAvancadaSgpUF && this.consultaAvancada && this.consultaPor == 'sgp'){
                queryString += '&UF=' + this.consultaAvancadaSgpUF;
            }

            if(this.consultaAvancadaSgpTipoAcionamento && this.consultaAvancada && this.consultaPor == 'sgp'){
                queryString += '&tipoAcionamento=' + this.consultaAvancadaSgpTipoAcionamento;
            }
            if(this.consultaAvancadaSgpEmpreiteira && this.consultaAvancada && this.consultaPor == 'sgp'){
                queryString += '&descricaoEmpreiteira=' + this.consultaAvancadaSgpEmpreiteira;
            }

            return queryString;

        },
    },
    components: {
        Rnc_modalForm
    },
    data: function() {
        return {
            consultaDataTable: "",
            UFOptions,
            tipoAcionamentoOptions,
            loadingConsulta: false,
            identificadorAreaDemandanteRncClicado: null,
            codigoGrupoFilaClicado: null,
            sgClicado: "",
            descricaoTituloSgClicado: "",
            codigoSgClicado: "",
            consultaPor: "sgi",
            valorConsulta: "",
            valorConsultaRNC: "",
            showRnc_modalForm: false,
            consultaPorOptions: [
                { "value": "sgi", "text": "SGI" },
                { "value": "sgp", "text": "SGP" }
            ],
            sgiResultadoConsulta: [
                
            ],
            sgpResultadoConsulta: [

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
                filterable: false
                }
            ],
            headerSgp: [
                { text: 'Tipo Acionamento', value: 'Tipo Acionamento' },
                { text: 'GL', value: 'GL' },
                { text: 'Projeto', value: 'Projeto' },
                { text: 'UF', value: 'UF' },
                { text: 'Cliente', value: 'Cliente' },
                { text: 'GP Cliente', value: 'GPCliente' },
                { text: 'Empreiteira', value: 'Empreiteira' },
                {
                text: '',
                sortable: false,
                value: 'detail',
                filterable: false
                }
            ],
            // ADVANCED SEARCH
            consultaAvancada: false,

            // SGI
            consultaAvancadaSgiEmpreiteiraProjeto: "",
            consultaAvancadaSgiEmpreiteiraConstrucao: "",
            consultaAvancadaSgiUF: "",
            consultaAvancadaSgiProjeto: "",

            // SGP
            consultaAvancadaSgpTipoAcionamento: "",
            consultaAvancadaSgpEmpreiteira: "",
            consultaAvancadaSgpUF: "",
        };
    },
    methods: {
        abreRegistroSelecionado(sg){
            if(sg.detail == 'sgi'){
                this.codigoGrupoFilaClicado = null; 
                this.sgClicado = 'sgi'; 
                this.codigoSgClicado = sg.ID; 
            } else
            if(sg.detail == 'sgp') {
                this.codigoGrupoFilaClicado = String(sg.codigoGrupoFila);
                this.sgClicado = 'sgp'; 
                this.codigoSgClicado = sg.GL;
            }
            this.codigoSgClicado = parseInt(this.codigoSgClicado);
            this.identificadorAreaDemandanteRncClicado = sg.identificadorAreaDemandanteRnc;
            this.descricaoTituloSgClicado= sg.descricaoTituloSg;
            this.showRnc_modalForm=true;
        },
        consultaAvancadaButton(){
            this.consultaAvancada=!this.consultaAvancada;
        },
        consulta(){
            var consultaPor = this.consultaPor;
            var errors = {};

            errors = this.validatesErrorsSg();

            this.deletarConsultaSg();

            if(Object.keys(errors).length === 0){

                this.loadingConsulta = true;

                var url = this.urlSg;

                axios.get(url).then(res => {
                    var scope = `#rnc_${this.crudType}`;
                    cleanErrorsScope(scope);

                    this.inserirConsultaSg(consultaPor, res.data);

                    this.loadingConsulta = false;
                })
                .catch(error => {
                    this.loadingConsulta = false;
                    showError(error);
                });

            } else {
                var scope = `#rnc_${this.crudType}`;
                showAllErrorScope(errors, scope);
            }
        },
        validatesErrorsSg(){
            var errors = {};

            if(!this.consultaPor){
                errors['consultaPor'] = 'é obrigatório';
            }
            if(!this.consultaAvancada){
                if(!this.valorConsulta &&
                
                (
                    (this.temRNC && !this.valorConsultaRNC) || (this.crudType != 't')
                )

                ){
                    errors['valorConsulta'] = 'é obrigatório';

                    if(this.temRNC && !this.valorConsultaRNC){
                        errors['valorConsultaRNC'] = 'é obrigatório';
                    }
                }
            // ADVANCED VALIDATE
            } else {
                if(this.consultaPor == 'sgi'){
                    if(!this.valorConsulta 
                    && 
                    (
                        (this.temRNC && !this.valorConsultaRNC) || (this.crudType != 't')
                    ) 
                    &&
                    // ADVANCED CONDITION
                    !this.consultaAvancadaSgiUF && !this.consultaAvancadaSgiProjeto && !this.consultaAvancadaSgiEmpreiteiraProjeto && !this.consultaAvancadaSgiEmpreiteiraConstrucao){

                        errors['valorConsulta'] = 'é obrigatório';

                        if(this.temRNC && !this.valorConsultaRNC){
                            errors['valorConsultaRNC'] = 'é obrigatório';
                        }

                        // ADVANCED FORM
                        errors['consultaAvancadaSgiUF'] = 'é obrigatório';
                        errors['consultaAvancadaSgiProjeto'] = 'é obrigatório';
                        errors['consultaAvancadaSgiEmpreiteiraProjeto'] = 'é obrigatório';
                        errors['consultaAvancadaSgiEmpreiteiraConstrucao'] = 'é obrigatório';
                    }
                } else {
                    if(!this.valorConsulta 
                    && 
                    (
                        (this.temRNC && !this.valorConsultaRNC) || (this.crudType != 't')
                    ) 
                    &&
                    // ADVANCED CONDITION
                    !this.consultaAvancadaSgpTipoAcionamento && !this.consultaAvancadaSgpUF && !this.consultaAvancadaSgpEmpreiteira){

                        errors['valorConsulta'] = 'é obrigatório';

                        if(this.temRNC && !this.valorConsultaRNC){
                            errors['valorConsultaRNC'] = 'é obrigatório';
                        }

                        // ADVANCED FORM
                        errors['consultaAvancadaSgpTipoAcionamento'] = 'é obrigatório';
                        errors['consultaAvancadaSgpUF'] = 'é obrigatório';
                        errors['consultaAvancadaSgpEmpreiteira'] = 'é obrigatório';
                    }
                }
            }

            if(this.valorConsulta && this.valorConsultaRNC && this.temRNC){
                errors['valorConsulta'] = 'não pode ser preenchido junto a RNC';
                errors['valorConsultaRNC'] = 'não pode ser preenchido junto a '+ this.valorLabel;
            }

            return errors;
        },
        deletarConsultaSg(){
            if(this.consultaPor == 'sgi'){
                this.sgiResultadoConsulta = [];
            } else 
            if(this.consultaPor == 'sgp') {
                this.sgpResultadoConsulta = [];
            }
        },
        inserirConsultaSg(consultaPor, data){
            if(consultaPor == 'sgi'){
                var sgiResultadoConsulta = data;

                sgiResultadoConsulta.forEach( 
                (item) => 
                    {
                    item['detail'] = 'sgi';
                    }
                );

                this.sgiResultadoConsulta = sgiResultadoConsulta;
            } else 
            if(consultaPor == 'sgp') {
                var sgpResultadoConsulta = data;

                sgpResultadoConsulta.forEach( 
                (item) => 
                    {
                    item['detail'] = 'sgp';
                    }
                );

                this.sgpResultadoConsulta = sgpResultadoConsulta;
            }
        }
    },
    watch: {
        consultaPor: function(novoValor, antigoValor){
            if(novoValor != antigoValor){
                var scope = `#rnc_${this.crudType}`;
                cleanErrorsScope(scope);
                this.valorConsulta = "";
                this.valorConsultaRNC = "";
            }
        },
        valorConsulta: function(novoValor, antigoValor){
            if(novoValor != antigoValor && novoValor != ""){
                this.valorConsultaRNC = "";
            }
        },
        valorConsultaRNC: function(novoValor, antigoValor){
            if(novoValor != antigoValor && novoValor != ""){
                this.valorConsulta = "";
            }
        }
    }
};
</script>

<style scoped>

.default_color_background{
  background-color: #f7f7f7;
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
