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
                        <b-form-select id="areaDemandante" disabled v-model="detalhes.areaDemandante" :options="areasDemandantes" ></b-form-select>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-10">
                    <v-expansion-panels  hover>
                        <div class="w-100 mb-1">
                            <div class="float-right">
                                <v-btn @click="novaRNC();" v-if="crudType == 'c'" class="btn btn-primary form-control" color="blue" dark >
                                    <v-icon dark left>
                                        mdi-folder-plus
                                    </v-icon>
                                    Adicionar RNC
                                </v-btn>
                            </div>
                        </div>
                        <v-expansion-panel style="background-color: #f7f7f7;" v-for="(row, index) in detalhes.listaRNCs" :key="index">
                            <v-expansion-panel-header :disable-icon-rotate="row.resolvido != null">
                                <v-row no-gutters>
                                    <v-col cols="4" v-if="row.id">
                                        RNC: {{row.id}}
                                    </v-col>
                                    <v-col cols="8" v-else class="text--secondary" >
                                        <v-row no-gutters style="width: 100%" >
                                            <!-- <v-col cols="6">
                                                Motivo: {{ row.motivo }}
                                            </v-col>
                                            <v-col cols="6">
                                                Tipo: {{  row.tipo }}
                                            </v-col> -->
                                        </v-row>
                                    </v-col>
                                </v-row>

                                <!-- ICONS -->
                                <template v-if="row.resolvido == null" v-slot:actions>
                                    <v-icon color="primary">
                                        $expand
                                    </v-icon>
                                </template>

                                <template v-else-if="row.resolvido" v-slot:actions>
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
                                        <v-btn @click="removeRNC(row);" v-if="!row.dataCriacao" class="btn btn-primary form-control" style="z-index: 999" color="blue" dark >
                                            <v-icon dark left>
                                                mdi-delete
                                            </v-icon>
                                            Remover RNC
                                        </v-btn>
                                    </div>
                                </div>
                                <Rnc_detalhes_tabsRNCForm :rnc="row" :crudType="crudType" :motivos="motivos" :classificacoes="classificacoes" />
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
import { baseApi, showError } from "@/global";
import axios from "axios";
import { mapState } from "vuex";
export default {
    name: "rnc_detalhesForm",
    components: {
        ObservacoesHistory_modalView,
        Rnc_detalhes_tabsRNCForm
    },
    props: {
        value: Object,
        crudType: String,
        identificadorAreaDemandanteRnc: Number
    },
    computed: {
        ...mapState(["usuario"]),
        detalhes: {
            get () {
                return this.value
            },
            set (value) {
                this.$emit('input', value);
            }
        }
    },
  data: function() {
    return {
        loadingDetalhe: true,
        showObservacoesHistory_modalView: false,
        areasDemandantes: [
            { "value": null, "text": "Selecione uma área demandante" }
        ],
        motivos: [
            { "value": null, "text": "Selecione um motivo" }
        ],
        classificacoes: [
            { "value": null, "text": "Selecione uma classificação" }
        ]
    }
  },
  methods: {
        novaRNC(){
            var detalhes = this.detalhes;
            if(!detalhes.listaRNCs){
                detalhes.listaRNCs = [];
            }

            var rnc =  {
                        id: null,
                        motivo: null,
                        tipo: null,
                        classificacao: null,
                        resolvido: null,
                        tratavel: false,
                        listaIrregularidades: [
                        ]
                    };
            detalhes.listaRNCs.push(rnc);
            this.detalhes = detalhes;
        },
        removeRNC(rnc){
            const index = this.detalhes.listaRNCs.indexOf(rnc);
            this.detalhes.listaRNCs.splice(index, 1);
        },
        getDetalhesRNC(){
            var queryString = (this.identificadorAreaDemandanteRnc) ? `?id=${this.identificadorAreaDemandanteRnc}` : "";
            var url = `${baseApi}/rnc${queryString}`;

            axios.get(url).then(res => {
                var detalhes = res.data;
              
                if(detalhes && !detalhes.areaDemandante){
                    if(this.usuario.perfilUsuario.usuarioTim.areaDemandante){
                        detalhes.areaDemandante = this.usuario.perfilUsuario.usuarioTim.areaDemandante;
                    }
                }
                // CONVERTER DATA DO HISTORICO DE OBSERVAÇÕES
                if(detalhes && detalhes.listaObservacoes){
                    detalhes.listaObservacoes.forEach( 
                        (item) => 
                        {
                            item['dataCriacao'] = new Date(item['dataCriacao']).toLocaleString();
                        }
                    );
                }

                // ARMAZENAR O STATUS INICIAL DOS RNCs RECUPERADOS E CONVERTE A DATA DE OBSERVAÇÕES
                if(detalhes && detalhes.listaRNCs){
                    detalhes.listaRNCs.forEach( 
                        (rnc) => 
                        {
                            rnc['initStatus'] = rnc.status;
                            rnc.listaObservacoes.forEach( 
                                (observacao) => 
                                {
                                    observacao['dataCriacao'] = new Date(observacao['dataCriacao']).toLocaleString();
                                }
                            );
                        }
                    );
                }

                this.detalhes = detalhes;
                this.novaRNC();

            }).catch(error => {
                showError(error);
            })
            .finally(() => {
                this.loadingDetalhe = false;
            });
        },
        getAreasDemandantes(){
            var comboBox = [{ "value": null, "text": "Selecione uma àrea" }];

            return axios
                .get(`${baseApi}/usuario/areasDemandantes?`)
                .then(res => {
                if(res.data && res.data.areasDemandantes){
                    var areasDemandantes = res.data.areasDemandantes;
                    areasDemandantes.forEach((item) => 
                    { 
                        var areaDemandante = {};
                        areaDemandante['value'] = item.id;
                        areaDemandante['text'] = item.descricaoAreaDemandante;
                        comboBox.push(areaDemandante);
                    });
                }
                })
                .catch(error => {
                    showError(error);
                })
                .finally(() => {
                    this.areasDemandantes = comboBox;
                });

        },
        getMotivos(){
            var comboBox = [{ "value": null, "text": "Selecione um motivo" }];

            return axios
                .get(`${baseApi}/rnc/motivos?`)
                .then(res => {
                if(res.data && res.data.motivosRnc){
                    var motivos = res.data.motivosRnc;
                    motivos.forEach((item) => 
                    { 
                        var motivo = {};
                        motivo['value'] = item.id;
                        motivo['text'] = item.descricaoMotivo;
                        comboBox.push(motivo);
                    });
                }
                })
                .catch(error => {
                    showError(error);
                })
                .finally(() => {
                    this.motivos = comboBox;
                });

        },
        getTipos(){
            var comboBox = [{ "value": null, "text": "Nenhum tipo" }];

            return axios
                .get(`${baseApi}/rnc/tipos?`)
                .then(res => {
                if(res.data && res.data.tiposRnc){
                    var tipos = res.data.tiposRnc;
                    tipos.forEach((item) => 
                    { 
                        var tipo = {};
                        tipo['value'] = item.id;
                        tipo['text'] = item.descricaoTipo;
                        comboBox.push(tipo);
                    });
                }
                })
                .catch(error => {
                    showError(error);
                })
                .finally(() => {
                    this.tipos = comboBox;
                });

        },
        async iniciar(){
            await this.getAreasDemandantes();
            this.getMotivos();
            this.getTipos();
            this.getDetalhesRNC();
        }
  },
  created: function(){
      this.iniciar();
  }
}
</script>
