<template>
    <div :id="'rnc_'+crudType" :class="'rnc_'+crudType">
        <h3>{{pageTitle}}</h3>
        <fieldset class="border p-2">
            <legend class="w-auto">Consulta</legend>
                <form @submit.prevent="search">
                    <div class="row">
                        <div class="col-lg-2">
                            <div class="form-group">
                                <label class="bmd-label-floating label-text" for="dateInstall">Consulta por</label><font color="red"> *</font>
                                <b-form-select id="searchFor" v-model="searchFor" name="searchFor" :options="searchForOptions" ></b-form-select>
                            </div>
                        </div>
                        <div class="col-lg-2" >
                            <div class="form-group">
                                <label class="bmd-label-floating label-text" for="searchValue">
                                    <span>
                                        {{labelValue}}
                                    </span>   
                                </label><font color="red"> *</font>
                                <b-form-input id="searchValue" v-model="searchValue" name="searchValue" placeholder="Valor de consulta"></b-form-input>
                            </div>
                        </div>
                        <div class="col-lg-2" v-if="crudType == 'e'">
                            <div class="form-group">
                                <label class="bmd-label-floating label-text" for="searchValue">
                                    <span>
                                        RNC
                                    </span>   
                                </label><font color="red">*</font>
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
                                    color="primary"
                                    type="submit"
                                >
                                Buscar
                                </v-btn>
                            </div>
                        </div>
                    </div>
                </form>
                
        </fieldset>
        <div class="row" v-if="searchFor == 'sgi'">
                    <div class="col-lg-12">
                        <div class="table-responsive-md">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th v-if="crudType == 'e'">RNC</th>
                                        <th>Fila</th>
                                        <th>ID</th>
                                        <th>Projeto</th>
                                        <th>UF</th>
                                        <th>ID OPD</th>
                                        <th>Empreitera Projeto</th>
                                        <th colspan="2">Empreitera Construção</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="sgi in sgiSearchResult" :key="sgi.id" class="trAlign">
                                        <td v-if="crudType == 'e'">

                                        </td>
                                        <td>
                                            {{sgi.Status}}
                                        </td>
                                        <td>
                                            {{sgi.ID}}
                                        </td>
                                        <td>
                                            {{sgi.Projeto}}
                                        </td>
                                        <td>
                                            {{sgi.UF}}
                                        </td>
                                        <td>
                                            {{sgi.ID_OPD}}
                                        </td>
                                        <td>
                                            {{sgi.Empreiteira}}
                                        </td>
                                        <td>
                                            {{sgi.EmpreiteiraConstrucao}}
                                        </td>
                                        <td>
                                            <i title="Criar RNC" @click="codigoGrupoFilaClicked = ''; sgClicked = 'sgi'; codigoSgClicked = sgi.ID; descricaoTituloSgClicked=sgi.descricaoTituloSg; showRnc_modalForm=true;" class="openDetail fa fa-edit"></i>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="row" v-else>
                    <div class="col-lg-12">
                        <div class="table-responsive-md">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th v-if="crudType == 'e'">RNC</th>
                                        <th>Tipo Acionamento</th>
                                        <th>GL</th>
                                        <th>Projeto</th>
                                        <th>UF</th>
                                        <th>Cliente</th>
                                        <th>GP Cliente</th>
                                        <th colspan="2">Empreiteira</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="sgp in sgpSearchResult" :key="sgp.id" class="trAlign">
                                        <td v-if="crudType == 'e'">
                                            
                                        </td>
                                        <td>
                                            {{sgp['TIPO ACIONAMENTO']}}
                                        </td>
                                        <td>
                                            {{sgp.GL}}
                                        </td>
                                        <td>
                                            {{sgp.PROJETO}}
                                        </td>
                                        <td>
                                            {{sgp.UF}}
                                        </td>
                                        <td>
                                            {{sgp.CLIENTE}}
                                        </td>
                                        <td>
                                            {{sgp.GPCliente}}
                                        </td>
                                        <td>
                                            {{sgp.FORNECEDOR}}
                                        </td>
                                        <td>
                                            <i title="Criar RNC" @click="codigoGrupoFilaClicked = sgp.codigoGrupoFila; sgClicked = 'sgp'; codigoSgClicked = sgp.GL; descricaoTituloSgClicked=sgp.descricaoTituloSg; showRnc_modalForm=true;" class="openDetail fa fa-edit"></i>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
        <Rnc_modalForm :crudType="crudType" :sg="sgClicked" :codigoGrupoFila="codigoGrupoFilaClicked" v-if="showRnc_modalForm" :codigoSg="codigoSgClicked" v-model="showRnc_modalForm" :descricaoTituloSg="descricaoTituloSgClicked"/>
    </div>
</template>

<script>
import Rnc_modalForm from './rnc_modalForm'
import { baseApi, showError, showAllErrorScope, cleanErrorsScope } from "@/global";
import axios from "axios";
export default {
    name: "controlePage",
    props: {
        crudType: {
            default: "s",
            type: String
        }
    },
    computed: {
        pageTitle(){
            var title = "RNC";
            if(this.crudType == 'c'){
                title = 'Criação de RNC';
            } else
            if(this.crudType == 'e'){
                title = 'Edição de RNC';
            } else
            if(this.crudType == 's'){
                title = 'Consulta de RNC';
            } else {
                title = 'RNC';
            }

            return title;
        },
        labelValue(){
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

            ]
        };
    },
    methods: {
        search(){
            var searchFor = this.searchFor;
            var searchValue = this.searchValue;
            var errors = {};

            errors = this.validatesErrorsSg();

            this.deleteSearchSg();

            if(Object.keys(errors).length === 0){

                this.loadingSearch = true;

                var queryString = ``;
                var url = `${baseApi}/rnc/sg/${searchFor}/${searchValue}${queryString}`;

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
        validatesErrorsSg(){
            var errors = {};
            var crudType = this.crudType;

            if(crudType == 'c'){
                if(!this.searchFor){
                    errors['searchFor'] = 'é obrigatório';
                }
                if(!this.searchValue){
                    errors['searchValue'] = 'é obrigatório';
                }
            } else
            if(crudType == 'e'){
                if(!this.searchFor){
                    errors['searchFor'] = 'é obrigatório';
                }
                if(!this.searchValue && !this.searchValueRNC){
                    errors['searchValue'] = 'é obrigatório';
                    errors['searchValueRNC'] = 'é obrigatório';
                } else
                if(this.searchValue && this.searchValueRNC){
                    errors['searchValue'] = 'não pode ser preenchido com RNC';
                    errors['searchValueRNC'] = 'não pode ser preenchido com '+ this.labelValue;
                } else
                if(this.searchValueRNC){
                     errors['searchValueRNC'] = 'está temporariamente desabilitado';
                }
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
                this.sgiSearchResult = data;
            } else 
            if(searchFor == 'sgp') {
                this.sgpSearchResult = data;
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

label.blank-label::after{
  content: "\a0";
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


<style>

.trAlign{
    text-align: center;
}

.trAlign td{
    vertical-align: middle;
    background-color: white;
}

</style>