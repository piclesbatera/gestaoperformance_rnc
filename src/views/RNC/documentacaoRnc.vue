<template>
    <div v-if="loadingDocumentacao">
        <span>Carregando documentação</span>
        <!-- <v-progress-linear color="deep-purple accent-4" indeterminate rounded height="6"></v-progress-linear> -->
        <v-progress-linear indeterminate color="blue" ></v-progress-linear>
    </div>
    <div v-else>
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
        <Anexos_modalView :codigoGrupoFila="codigoGrupoFila" :sg="sg" :codigoSg="codigoSg" :descricaoDocumentacao="descricaoDocumentacaoClicked" v-if="showAnexos_modalView" v-model="showAnexos_modalView" />
    </div>
</template>

<script>
import Anexos_modalView from './anexos_modalView'
import { baseApi, showError } from "@/global";
import axios from "axios";
export default {
    name: "documentacaoRnc",
    components: {
        Anexos_modalView
    },
    props: {
        codigoGrupoFila: String,
        sg: String,
        codigoSg: Number
    },
    computed: {
    },
  data: function() {
    return {
        showAnexos_modalView: false,
        listaDocumentacao: [],
        descricaoDocumentacaoClicked: "",
        loadingDocumentacao: false,
        idDocumentacaoClicked: ""
    }
  },
  methods: {
        getDocumentacao(){
            this.loadingDocumentacao = true;
            console.log('codigoSg:');
            console.log(this.codigoSg);
            var queryString = `?codigoGrupoFila=${this.codigoGrupoFila}`;
            var url = `${baseApi}/rnc/sg/documentacao/${this.sg}/${this.codigoSg}${queryString}`;
            console.log(url);
            axios.get(url).then(res => {
                
                this.listaDocumentacao = res.data;

                this.loadingDocumentacao = false;
            }).catch(error => {
                this.loadingDocumentacao = false;
                showError(error);
            });
        }
  },
  created: function(){
      this.getDocumentacao();
  }
}
</script>


<style scoped>


.openDetail{
    cursor: pointer;
    font-size: x-large;
    color: #ffa200a8;
} 

.table td, .table th {
    padding: .25rem .75rem;
}


.col, .col-1, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9, .col-10, .col-11, .col-12, .col-auto, .col-lg, .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg-auto, .col-md, .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12, .col-md-auto, .col-sm, .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm-auto, .col-xl, .col-xl-1, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, .col-xl-9, .col-xl-10, .col-xl-11, .col-xl-12, .col-xl-auto {
    padding: 3px 12px;
}


</style>