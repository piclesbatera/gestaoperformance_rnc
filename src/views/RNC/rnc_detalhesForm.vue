<template>
    <div>
         <div v-if="loadingDetalhe">
            <span>Carregando...</span>
            <!-- <v-progress-linear color="deep-purple accent-4" indeterminate rounded height="6"></v-progress-linear> -->
            <v-progress-linear indeterminate color="blue" ></v-progress-linear>
        </div>
        <div v-else class="container-fluid">
            <div class="row">
                <div class="col-lg-5">
                    <div class="form-group">
                        <label class="bmd-label-floating label-text" for="areaDemandante">Área Demandante</label><font color="red"> *</font>
                        <b-form-select id="areaDemandante" :disabled="desabilitaDetalhes" v-model="detalhes.areaDemandante" :options="areasDemandantes" ></b-form-select>
                    </div>
                </div>
                <div class="col-lg-5" >
                    <div class="form-group">
                        <label class="bmd-label-floating label-text" for="classificacao">Classificação</label><font color="red"> *</font>
                        <b-form-select id="classificacao" :disabled="desabilitaDetalhes" v-model="detalhes.classificacao" :options="classificacoes" ></b-form-select>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-10">
                    <v-expansion-panels  hover>
                        <div class="w-100 mb-1">
                            <div class="float-right">
                                <v-btn @click="newRNC();" v-if="crudType == 'c'" class="btn btn-primary form-control" color="blue" dark >
                                    <v-icon dark left>
                                        mdi-folder-plus
                                    </v-icon>
                                    Adicionar RNC
                                </v-btn>
                            </div>
                        </div>
                        <v-expansion-panel style="background-color: #f7f7f7;" v-for="(row, index) in detalhes.listaRNCs" :key="index">
                            <v-expansion-panel-header :disable-icon-rotate="row.status != null">
                                <v-row no-gutters>
                                    <v-col cols="4" v-if="row.id">
                                        RNC: {{row.id}}
                                    </v-col>
                                    <v-col cols="8" v-else class="text--secondary" >
                                        <v-row no-gutters style="width: 100%" >
                                            <v-col cols="6">
                                                Motivo: {{ row.motivo }}
                                            </v-col>
                                            <v-col cols="6">
                                                Tipo: {{  row.tipo }}
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-row>

                                <!-- ICONS -->
                                <template v-if="row.status == null" v-slot:actions>
                                    <v-icon color="primary">
                                        $expand
                                    </v-icon>
                                </template>

                                <template v-else-if="row.status" v-slot:actions>
                                    <v-icon color="teal">
                                        mdi-check
                                    </v-icon>
                                </template>

                                <template v-else v-slot:actions>
                                    <v-icon color="error">
                                        mdi-alert-circle
                                    </v-icon>
                                </template>
                                <!-- ICONS -->
                            </v-expansion-panel-header>
                            <v-expansion-panel-content :eager="true">
                                <div class="w-100 mb-1">
                                    <div class="float-right">
                                        <v-btn @click="removeRNC(row);" v-if="crudType == 'c' && !row.id" class="btn btn-primary form-control" style="z-index: 999" color="blue" dark >
                                            <v-icon dark left>
                                                mdi-delete
                                            </v-icon>
                                            Remover RNC
                                        </v-btn>
                                    </div>
                                </div>
                                <Rnc_detalhes_tabsRNCForm :desabilitaDetalhes="desabilitaDetalhes"  :rnc="row" :crudType="crudType" />
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-12">
                    <label class="bmd-label-floating label-text" for="observacoes">Observações</label>
                    <b-form-textarea id="observacoes" no-resize v-model="detalhes.observacoes" placeholder="Digite uma observação" rows="6" maxLength="200"></b-form-textarea>
                    <a @click="showObservacoesHistory_modalView=true;" style="float: right;" title="Abrir o histórico de observações">
                        <i class="fa fa-history"></i>
                        Visualizar histórico</a>
                </div>
            </div>
        </div>
        <ObservacoesHistory_modalView v-if="showObservacoesHistory_modalView" :listaObservacoes="detalhes.listaObservacoes" v-model="showObservacoesHistory_modalView" />
    </div>
</template>

<script>
import ObservacoesHistory_modalView from './observacoesHistory_modalView'
import Rnc_detalhes_tabsRNCForm from './rnc_detalhes_tabsRNCForm'
export default {
    name: "rnc_detalhesForm",
    components: {
        ObservacoesHistory_modalView,
        Rnc_detalhes_tabsRNCForm
    },
    props: {
        value: Object,
        loadingDetalhe: Boolean,
        crudType: String
    },
    computed: {
        detalhes: {
            get () {
                return this.value
            },
            set (value) {
                this.$emit('input', value);
            }
        },
        desabilitaDetalhes: function(){
            return this.crudType != 'c';
        }
    },
  data: function() {
    return {
        showObservacoesHistory_modalView: false,
        areasDemandantes: [
            { "value": null, "text": "Selecione uma área demandante" },
            { "value": '1', "text": "Value 1" },
            { "value": '2', "text": "Value 2" },
            { "value": '3', "text": "Value 3" }
        ],
        classificacoes: [
            { "value": null, "text": "Selecione uma classificação" },
            { "value": '1', "text": "Value 1" },
            { "value": '2', "text": "Value 2" },
            { "value": '3', "text": "Value 3" }
        ]
    }
  },
  methods: {
        newRNC(){
            if(!this.detalhes.listaRNCs){
                this.detalhes.listaRNCs = [];
            }

            var rnc =  {
                        id: null,
                        motivo: null,
                        tipo: null,
                        status: null,
                        listaIrregularidades: [
                        ]
                    };
            this.detalhes.listaRNCs.push(rnc);
        },
        removeRNC(rnc){
            const index = this.detalhes.listaRNCs.indexOf(rnc);
            this.detalhes.listaRNCs.splice(index, 1);
        }
  },
  created: function(){
  }
}
</script>
