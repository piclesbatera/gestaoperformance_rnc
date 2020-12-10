<template>
    <div>
        <div class="container-fluid">
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
            <template v-if="desabilitaDetalhes">
                <div class="row">
                    <div class="col-lg-10">
                        <v-expansion-panels inset hover>
                            <v-expansion-panel style="background-color: #f7f7f7;" v-for="(row, index) in detalhes.listaMotivos" :key="index">
                                <v-expansion-panel-header :disable-icon-rotate="row.status != null">
                                    <v-row no-gutters>
                                        <v-col cols="4">
                                            Motivo: {{row.motivo}}
                                        </v-col>
                                        <!-- <v-col cols="8" class="text--secondary" >
                                            <v-row no-gutters style="width: 100%" >
                                                <v-col cols="6">
                                                    Motivo: {{ 'Motivo 1' }}
                                                </v-col>
                                                <v-col cols="6">
                                                    Tipo: {{  'Tipo 1' }}
                                                </v-col>
                                            </v-row>
                                        </v-col> -->
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
                                <v-expansion-panel-content>
                                    <Rnc_detalhes_tabsMotivoForm  :motivo="row" :crudType="crudType" />
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="row" v-for="(row, index) in detalhes.listaMotivos" :key="index">
                    <div class="col-lg-5">
                        <div class="form-group">
                            <template v-if="index == 0"> <label class="bmd-label-floating label-text" for="motivo">Motivo</label><font color="red"> *</font> </template>
                            <b-form-select id="motivo" v-model="row.motivo" :options="motivos" ></b-form-select>
                        </div>
                    </div>
                    <div class="col-lg-5">
                        <div class="form-group">
                            <template v-if="index == 0"> <label class="bmd-label-floating label-text" for="tipo">Tipo</label><font color="red"> *</font> </template>
                            <b-form-select id="tipo" v-model="row.tipo" :options="tipos" ></b-form-select>
                        </div>
                    </div>
                    <div class="col-md-1">
                        <div>
                            <label v-if="index == 0" class="bmd-label-floating blank-label"></label>
                            <v-btn @click="newMotivo();" v-if="index == 0" class="btn btn-primary form-control" color="blue" dark >
                                <v-icon dark >
                                    mdi-plus
                                </v-icon>
                            </v-btn>
                            <v-btn @click="removeMotivo(row);" v-else class="btn btn-primary form-control" color="blue" dark >
                                <v-icon dark >
                                    mdi-window-minimize
                                </v-icon>
                            </v-btn>
                        </div>
                    </div>
                </div>
            </template>
            <div class="row">
                <div class="col-lg-12">
                    <label class="bmd-label-floating label-text" for="observacoes">Observações</label>
                    <b-form-textarea id="observacoes" :disabled="desabilitaDetalhes" no-resize v-model="detalhes.observacoes" placeholder="Digite uma observação" rows="6" maxLength="200"></b-form-textarea>
                    <a @click="showObservacoesHistory_modalView=true;" style="float: right;" title="Abrir o histórico de observações">
                        <i class="fa fa-history"></i>
                        Visualizar histórico</a>
                </div>
            </div>
        </div>
        <ObservacoesHistory_modalView v-if="showObservacoesHistory_modalView" v-model="showObservacoesHistory_modalView" />
    </div>
</template>

<script>
import ObservacoesHistory_modalView from './observacoesHistory_modalView'
import Rnc_detalhes_tabsMotivoForm from './rnc_detalhes_tabsMotivoForm'
export default {
    name: "rnc_detalhesForm",
    components: {
        ObservacoesHistory_modalView,
        Rnc_detalhes_tabsMotivoForm
    },
    props: {
        value: Object,
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
            if(this.crudType != 'c'){
                return true;
            }
            return false;
        }
    },
  data: function() {
    return {
        showObservacoesHistory_modalView: false,
        areasDemandantes: [
            { "value": null, "text": "Selecione uma área demandante" },
            { "value": '1', "text": "Value 1" },
            { "value": '2', "text": "Value 2" }
        ],
        classificacoes: [
            { "value": null, "text": "Selecione uma classificação" },
            { "value": '1', "text": "Value 1" },
            { "value": '2', "text": "Value 2" }
        ],
        motivos: [
            { "value": null, "text": "Selecione um motivo" },
            { "value": '1', "text": "Value 1" },
            { "value": '2', "text": "Value 2" }
        ],
        tipos: [
            { "value": null, "text": "Selecione um tipo" }
        ],
    }
  },
  methods: {
        newMotivo(){
            if(!this.detalhes.listaMotivos){
                this.detalhes.listaMotivos = [];
            }

            var motivo = {
                motivo: null,
                tipo: null,
            };
            this.detalhes.listaMotivos.push(motivo);
        },
        removeMotivo(motivo){
            const index = this.detalhes.listaMotivos.indexOf(motivo);
            this.detalhes.listaMotivos.splice(index, 1);
        },
        initialMotivos(){
            this.detalhes.listaMotivos.forEach( 
                (item) => 
                {
                    item['initStatus'] = item.status;
                }
            );
        }
  },
  created: function(){
      this.initialMotivos();
  }
}
</script>
