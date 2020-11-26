<template>
    <div id="criarRNC" class="criarRNC">
        <h3 v-if="crudType == 'c'" >Criação de RNC</h3>
        <h3 v-else-if="crudType == 'e'" >Edição de RNC</h3>
        <h3 v-else-if="crudType == 's'" >Consulta de RNC</h3>
        <h3 v-else >RNC</h3>
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
                                    <span v-if="searchFor == 'sgi'">
                                        ID
                                    </span>  
                                    <span v-else>
                                        GL
                                    </span>    
                                </label><font color="red"> *</font>
                                <b-form-input id="searchValue" v-model="searchValue" name="searchValue" placeholder="Valor de consulta"></b-form-input>
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
                <div class="row" v-if="searchFor == 'sgi'">
                    <div class="col-lg-12">
                        <div class="table-responsive-md">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
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
                                            <i title="Criar RNC" @click="sgClicked = 'sgi'; codigoSgClicked = sgi.ID; descricaoTituloSgClicked=sgi.descricaoTituloSg; showRnc_modalForm=true;" class="openDetail fa fa-edit"></i>
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
                                            <i title="Criar RNC" @click="sgClicked = 'sgp'; codigoSgClicked = sgp.GL; descricaoTituloSgClicked=sgp.descricaoTituloSg; showRnc_modalForm=true;" class="openDetail fa fa-edit"></i>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
        </fieldset>
        <Rnc_modalForm :sg="sgClicked" v-if="showRnc_modalForm" :codigoSg="codigoSgClicked" v-model="showRnc_modalForm" :descricaoTituloSg="descricaoTituloSgClicked"/>
    </div>
</template>

<script>
import Rnc_modalForm from './rnc_modalForm'
import { baseApi, showError, showAllError, cleanErrors } from "@/global";
import axios from "axios";
export default {
    name: "rncPage",
    props: {
        crudType: {
            default: "s",
            type: String
        }
    },
    components: {
        Rnc_modalForm
        },
    data: function() {
        return {
            loadingSearch: false,
            sgClicked: "",
            descricaoTituloSgClicked: "",
            codigoSgClicked: "",
            searchFor: "sgi",
            searchValue: "",
            showRnc_modalForm: false,
            searchForOptions: [
                // { "value": null, "text": "SGI" },
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

            if(!searchFor){
                errors['searchFor'] = 'é obrigatório';
            }
            if(!searchValue){
                errors['searchValue'] = 'é obrigatório';
            }

            if(searchFor == 'sgi'){
                this.sgiSearchResult = [];
            } else 
            if(searchFor == 'sgp') {
                this.sgpSearchResult = [];
            }

            if(Object.keys(errors).length === 0){

                this.loadingSearch = true;

                var queryString = ``;
                var url = `${baseApi}/rnc/sg/${searchFor}/${searchValue}${queryString}`;

                axios.get(url).then(res => {
                    cleanErrors();
                    
                    if(searchFor == 'sgi'){
                        this.sgiSearchResult = res.data;
                    } else 
                    if(searchFor == 'sgp') {
                        this.sgpSearchResult = res.data;
                    }

                    this.loadingSearch = false;
                })
                .catch(error => {
                    this.loadingSearch = false;
                    showError(error);
                });

            } else {
                showAllError(errors);
            }
        }
    },
    watch: {
        searchFor: function(newValue, oldValue){
            if(newValue != oldValue){
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