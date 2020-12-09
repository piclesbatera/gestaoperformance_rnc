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
                                    <v-tabs v-model="row.tab" light background-color="#f7f7f7" show-arrows>
                                        <v-tabs-slider color="#cbc6c6"></v-tabs-slider>
                                
                                        <v-tab :href="'#motivos'">Motivos</v-tab>
                                        <v-tab :href="'#evidencias'">Evidencias</v-tab>
                                    </v-tabs>
                                    <v-tabs-items v-model="row.tab">
                                        <!-- Motivos -->
                                        <v-tab-item :value="'motivos'">
                                            <v-card flat>
                                                <v-card-text>
                                                    <div class="row">
                                                        <div class="col-lg-5">
                                                            <div class="form-group">
                                                                <label class="bmd-label-floating label-text" for="motivo">Motivo</label><font color="red"> *</font>
                                                                <b-form-select :disabled="true" id="motivo" v-model="row.motivo" :options="motivos" ></b-form-select>
                                                            </div>
                                                        </div>
                                                        <div class="col-lg-5">
                                                            <div class="form-group">
                                                                <label class="bmd-label-floating label-text" for="tipo">Tipo</label><font color="red"> *</font>
                                                                <b-form-select :disabled="true" id="tipo" v-model="row.tipo" :options="tipos" ></b-form-select>
                                                            </div>
                                                        </div>
                                                        <template v-if="crudType == 'v' && row.initStatus == null">
                                                            <div class="col-lg-1">
                                                                <div class="form-group">
                                                                    <label class="bmd-label-floating blank-label"></label>
                                                                    <v-btn class="btn btn-danger form-control" color="red" dark @click="row.status = false;">
                                                                        <v-icon dark >
                                                                            mdi-cancel
                                                                        </v-icon>
                                                                    </v-btn>
                                                                </div>
                                                            </div>
                                                            <div class="col-lg-1">
                                                                <div class="form-group">
                                                                    <label class="bmd-label-floating blank-label"></label>
                                                                    <v-btn class="btn btn-primary form-control" color="blue" dark @click="row.status = true;">
                                                                        <v-icon dark >
                                                                            mdi-checkbox-marked-circle
                                                                        </v-icon>
                                                                    </v-btn>
                                                                </div>
                                                            </div>
                                                        </template>
                                                    </div>
                                                </v-card-text>
                                            </v-card>
                                        </v-tab-item>

                                        <!-- Evidências -->
                                        <v-tab-item :value="'evidencias'">
                                            <v-card flat>
                                                <v-card-text>
                                                    Evidencias
                                                </v-card-text>
                                            </v-card>
                                        </v-tab-item>
                                    </v-tabs-items>
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
export default {
    name: "rnc_detalhes_modalForm",
    components: {
        ObservacoesHistory_modalView
    },
    props: {
        detalhes: Object,
        crudType: String
    },
    computed: {
        desabilitaDetalhes: function(){
            if(this.crudType != 'c'){
                return true;
            }
            return false;
        }
    },
  data: function() {
    return {
        tab: null,
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
