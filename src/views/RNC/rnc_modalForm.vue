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
                            <button type="button" @click.stop="show=false" class="btn btn-primary form-control" >Salvar</button>
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
                        
                                <v-tab >Detalhes</v-tab>
                                <v-tab >Anexos</v-tab>
                                <v-tab >Irregularidades</v-tab>
                            </v-tabs>
                            <v-tabs-items v-model="tab">
                                <!-- Detalhes -->
                                <v-tab-item>
                                    <v-card flat>
                                        <v-card-text>
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
                                                <div class="col-lg-6" >
                                                    <div class="form-group">
                                                        <label class="bmd-label-floating label-text" for="classificacao">Prazo</label><font color="red"> *</font>
                                                        <b-form-datepicker
                                                            id="prazo"
                                                            name="prazo"
                                                            v-model="prazo"
                                                            v-bind="datePickerLabels"
                                                            locale="pt-BR"
                                                            class="mb-2"
                                                            :date-format-options="{
                                                            year: 'numeric',
                                                            month: 'numeric',
                                                            day: 'numeric'
                                                            }"
                                                        ></b-form-datepicker>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
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
                                                    <b-form-textarea
                                                    id="observacoes"
                                                    v-model="observacoes"
                                                    placeholder="Digite uma observação"
                                                    rows="6"
                                                    ></b-form-textarea>
                                                    <a @click="showObservacoesHistory_modalView=true;" style="float: right;" title="Abrir o histórico de observações">
                                                        <i class="fa fa-history"></i>
                                                        Visualizar histórico</a>
                                                </div>
                                            </div>
                                        </v-card-text>
                                    </v-card>
                                </v-tab-item>


                                <!-- Anexos -->
                                <v-tab-item>
                                    <v-card flat>
                                        <v-card-text>
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
                                        </v-card-text>
                                    </v-card>
                                </v-tab-item>


                                <!-- Irregularidades -->
                                <v-tab-item>
                                    <v-card flat>
                                        <v-card-text>
                                            <b-form-group >
                                                <v-file-input
                                                    counter
                                                    show-size
                                                    truncate-length="50"></v-file-input>
                                            </b-form-group>
                                        </v-card-text>
                                    </v-card>
                                </v-tab-item>
                            </v-tabs-items>
                        </v-card>
                    </div>
                </div>
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
import { baseApi, showError } from "@/global";
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
        if(this.crudType == 'e'){
            title = 'Editar RNC';
        }

        return title;
    }
  },
  data: function() {
    return {
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
        prazo: null,
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
      }
  },
  created: function(){
      this.getDocumentacao();
  }
}
</script>

<style scoped>
.col, .col-1, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9, .col-10, .col-11, .col-12, .col-auto, .col-lg, .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg-auto, .col-md, .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12, .col-md-auto, .col-sm, .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm-auto, .col-xl, .col-xl-1, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, .col-xl-9, .col-xl-10, .col-xl-11, .col-xl-12, .col-xl-auto {
    padding: 3px 12px;
}

.btn-primary{
    color: #fff;
    background-color: #007bff;
    border-color: #007bff;
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
