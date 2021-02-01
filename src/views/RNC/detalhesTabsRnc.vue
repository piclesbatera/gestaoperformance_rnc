<template>
    <div style="clear: right;">
        <v-tabs v-model="rnc.tab" light background-color="#f7f7f7" show-arrows>
            <v-tabs-slider color="#cbc6c6"></v-tabs-slider>
    
            <v-tab :href="'#motivos'">Motivos</v-tab>
            <v-tab :href="'#irregularidades'">Irregularidades</v-tab>
            <v-tab :href="'#prazos'" v-if="visualizarTabPrazo" :disabled="!acessarTabPrazo">Prazos</v-tab>
            <v-tab :href="'#evidencias'" v-if="visualizarTabEvidencias">Evidencias</v-tab>
        </v-tabs>
        <v-tabs-items v-model="rnc.tab" touchless>
            <!-- rncs -->
            <v-tab-item :value="'motivos'">
                <v-card flat>
                    <v-card-text>
                        <div class="row">
                            <div class="col-lg-5">
                                <div class="form-group">
                                    <label class="bmd-label-floating label-text" for="motivo">Motivo</label><font color="red"> *</font>
                                    <b-form-select v-model="rnc.motivo" :disabled="criado" @change="carregaDescricoes()" :options="motivos" ></b-form-select>
                                </div>
                            </div>
                            <div class="col-lg-5">
                                <div class="form-group">
                                    <label class="bmd-label-floating label-text" for="tipo">Descrição</label><font color="red"> *</font>
                                    <b-form-select v-model="rnc.descricao" :disabled="criado" :options="descricoes" ></b-form-select>
                                </div>
                            </div>
                            <div class="col-lg-2">
                                <label class="bmd-label-floating">Tratar</label>
                                <v-checkbox
                                    v-model="rnc.tratar"
                                    style="margin-top: 0px;"
                                    :disabled="criado || rncGrave"
                                ></v-checkbox>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-5" >
                                <div class="form-group">
                                    <label class="bmd-label-floating label-text" for="tipo">Tipo</label><font color="red"> *</font>
                                    <b-form-select disabled v-model="rnc.tipo" :options="tipos" ></b-form-select>
                                </div>
                            </div>
                        </div>
                        <div class="row" v-if="completeRNCButtons">
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label class="bmd-label-floating blank-label"></label>
                                    <v-btn class="btn btn-danger form-control" color="red" dark @click="rnc.resolvido = false;">
                                        Não resolvida
                                        <v-icon dark right>
                                            mdi-cancel
                                        </v-icon>
                                    </v-btn>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label class="bmd-label-floating blank-label"></label>
                                    <v-btn class="btn btn-primary form-control" color="blue" dark @click="rnc.resolvido = true;">
                                        Resolvida
                                        <v-icon dark right>
                                            mdi-checkbox-marked-circle
                                        </v-icon>
                                    </v-btn>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-12">
                                <label class="bmd-label-floating label-text" for="observacoes">Observações</label><font color="red"> *</font>
                                <b-form-textarea no-resize v-model="rnc.observacao" placeholder="Digite uma observação" rows="3" maxLength="200"></b-form-textarea>
                                <a @click="showHistoricoObservacoes=true;" style="float: right;" title="Abrir o histórico de observações">
                                    <i class="fa fa-history"></i>
                                    Visualizar histórico</a>
                            </div>
                        </div>
                        <HistoricoObservacoes v-if="showHistoricoObservacoes" :listaObservacoes="rnc.listaObservacoes" v-model="showHistoricoObservacoes" />
                    </v-card-text>
                </v-card>
            </v-tab-item>

             <!-- Irregularidades -->
            <v-tab-item :value="'irregularidades'">
                <v-card flat>
                    <v-card-text>
                        <UploadForm :id="rnc.id" :inicializaLinha="permissaoAlterarIrregularidade" :novoObjetoString="novoObjetoIrregularidade" :permissaoAlterarComponente="permissaoAlterarIrregularidade" v-model="listaIrregularidades" :tipoArquivo="'irregularidades'" />
                    </v-card-text>
                </v-card>
            </v-tab-item>

            <!-- Prazos -->
            <v-tab-item :value="'prazos'" v-if="visualizarTabPrazo">
                <v-card flat>
                    <v-card-text>
                        <div class="container-fluid">
                            <div v-for="prazo in listaPrazos" :key="prazo.codigo">
                                <div class="row">
                                    <div class="col-lg-6" >
                                        <div class="form-group">
                                            <label class="bmd-label-floating label-text">Prazo</label><font color="red" v-if="crudType == 't'"> *</font>
                                            <b-form-datepicker :min="prazo.minDate" :max="prazo.maxDate" :state="prazo.situacao" :disabled="!prazo.new" v-model="prazo.prazo" v-bind="datePickerLabels" locale="pt-BR" class="mb-2"
                                                :date-format-options="{
                                                    year: 'numeric',
                                                    month: 'numeric',
                                                    day: 'numeric'
                                                }"></b-form-datepicker>
                                        </div>
                                    </div>
                                    <template v-if="validaBotoesPrazo(prazo)">
                                        <div class="col-lg-3">
                                            <div class="form-group">
                                                <label class="bmd-label-floating blank-label"></label>
                                                <v-btn class="btn btn-danger form-control" color="red" dark @click="setSituacao(prazo, false);">
                                                    Rejeitar
                                                    <v-icon dark right >
                                                        mdi-cancel
                                                    </v-icon>
                                                </v-btn>
                                            </div>
                                        </div>
                                        <div class="col-lg-3">
                                            <div class="form-group">
                                                <label class="bmd-label-floating blank-label"></label>
                                                <v-btn class="btn btn-primary form-control" color="blue" dark @click="setSituacao(prazo, true);">
                                                    Aceitar
                                                    <v-icon dark right >
                                                        mdi-checkbox-marked-circle
                                                    </v-icon>
                                                </v-btn>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                                <v-divider></v-divider>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </v-tab-item>

            <!-- Evidências -->
            <v-tab-item :value="'evidencias'" v-if="visualizarTabEvidencias">
                <v-card flat>
                    <v-card-text>
                        <UploadForm :id="rnc.id" :inicializaLinha="permissaoAlterarEvidencia" :novoObjetoString="novoObjetoEvidencia" :permissaoAlterarComponente="permissaoAlterarEvidencia" v-model="listaEvidencias" :tipoArquivo="'evidencias'" />
                    </v-card-text>
                </v-card>
            </v-tab-item>

            
        </v-tabs-items>
    </div>
</template>

<script>
import UploadForm from './uploadForm'
import HistoricoObservacoes from './historicoObservacoes'
import {getDateCalculated } from "@/global";
import moment from 'moment';
import { baseApi, showError } from "@/global";
import axios from "axios";
import datePickerLabels from "@/assets/json/calendario/traducao.json";
export default {
    name: "detalhesTabsRnc",
    components: {
        HistoricoObservacoes,
        UploadForm
    },
    props: {
        rnc: Object,
        crudType: String,
        motivos: Array,
        tipos: Array,
        isLeitura: Boolean
    },
    computed: {
        rncGrave: function(){
            return this.rnc.tipo == 3;
        },
        criado: function(){
            return Boolean(this.rnc.dataCriacao);
        },
        acessarTabPrazo: function(){
            return Boolean(this.rnc.tratar);
        },
        descricao: function(){
            return this.rnc.descricao;
        },
        motivo: function(){
            return this.rnc.motivo;
        },
        tipo: function(){
            return this.rnc.tipo;
        },
        permissionAlterRNC: function(){
            return (this.rnc.resolvido == null);
        },
        permissaoAlterarIrregularidade: function(){
            return ((this.permissionAlterRNC) && ( (this.crudType == 'c' && !this.isLeitura) || this.crudType == 'v'));
        },
        completeRNCButtons(){
            return (this.crudType == 'v' && this.rnc.statusInicial == null && (Array.isArray(this.listaEvidencias) && this.listaEvidencias.length));
        },
        listaPrazos: {
            get(){
                if(this.rnc && this.rnc.listaPrazos){
                    return this.rnc.listaPrazos;
                } else {
                    return [];
                }
            },
            set(listaPrazos) {
                this.rnc.listaPrazos = listaPrazos;
            }
        },
        visualizarTabPrazo: function(){
            if(this.crudType == 't' || this.crudType == 'v' || (this.crudType == 'c' &&  this.rnc.id)){
                return true;
            }
            return false;
        },
        listaEvidencias: {
            get(){
                if(this.rnc && this.rnc.listaEvidencias){
                    return this.rnc.listaEvidencias;
                } else {
                    return [];
                }
            },
            set(listaEvidencias){
                this.rnc.listaEvidencias = listaEvidencias;
            }
        },
        listaIrregularidades: {
            get(){
                if(this.rnc && this.rnc.listaIrregularidades){
                    return this.rnc.listaIrregularidades;
                } else {
                    return [];
                }
            },
            set(listaIrregularidades){
                this.rnc.listaIrregularidades = listaIrregularidades;
            }
        },
        visualizarTabEvidencias: function(){
            return ( (Array.isArray(this.listaPrazos) && this.listaPrazos.length) && (this.listaPrazos[this.listaPrazos.length - 1].situacao == true) && (!this.prazoParaAceitar));
        },
        permissaoAlterarEvidencia: function(){
            return ((this.permissionAlterRNC) &&  (this.visualizarTabEvidencias) && (this.crudType == 't'));
        },
    },
  data: function() {
    return {
        datePickerLabels,
        showHistoricoObservacoes: false,
        descricoes: [
            { "value": null, "text": "Selecione uma descrição" }
        ],
        prazoParaAceitar: false,
        novoObjetoEvidencia: '{ "id": null,  "descricaoAnexo": null, "file": null, "nomeArquivo": null, "loadingArquivo": false, "new": true }',
        novoObjetoIrregularidade: '{ "id": null,  "descricaoAnexo": null, "file": null, "nomeArquivo": null, "loadingArquivo": false, "new": true }'
    }
  },
  methods: {
        carregaDescricoes(){
            this.rnc.descricao = null;
            this.getDescricao();
        },
        getDescricao(){
            var comboBox = [{ "value": null, "text": "Selecione uma descrição" }];
            if(this.rnc.motivo){
                axios
                .get(`${baseApi}/rnc/descricoes?motivo=${this.rnc.motivo}`)
                .then(res => {
                if(res.data && res.data.descricoesRnc){
                    var descricoes = res.data.descricoesRnc;
                    descricoes.forEach((item) => 
                    { 
                        var descricao = {};
                        descricao['value'] = item.id;
                        descricao['text'] = item.descricao;
                        descricao['tipo'] = item.tipo;
                        comboBox.push(descricao);
                    });
                }
                })
                .catch(error => {
                    showError(error);
                })
                .finally(() => {
                    this.descricoes = comboBox;
                    var descricao = this.descricoes.find(t => t.value == this.descricao);
                    if(descricao && descricao.tipo){
                        this.rnc.tipo = descricao.tipo;
                    }
                });
            } else {
                this.descricoes = comboBox;
            }
        },
        setSituacao(prazo, novaSituacao){
            if(novaSituacao != prazo.situacao){
                if(novaSituacao){
                    prazo.prazo = prazo.prazoCorreto;
                } else {
                    prazo.prazo = prazo.originalPrazo;
                }
                prazo.situacao = novaSituacao;
                prazo['updated'] = true;
            }
        },
        iniciarPrazosParaAceitar(){
            if( this.crudType == 'v' && (Array.isArray(this.listaPrazos) && this.listaPrazos[this.listaPrazos.length-1] && this.listaPrazos[this.listaPrazos.length-1].situacao == null) ){
                this.prazoParaAceitar = true;
                this.armazenarPrazo(this.listaPrazos[this.listaPrazos.length-1]);
            }
        },
        armazenarPrazo(prazo){
            prazo['originalPrazo'] = prazo.prazo;
            prazo['prazoCorreto'] = this.prazoCorreto(prazo);
        },
        prazoCorreto(prazo){
            var today = moment();
            var dataCriacao = moment(prazo.dataCriacao);
            var diffDays = today.diff(dataCriacao, 'days');
            var prazoCorreto = moment(prazo.prazo);
            prazoCorreto.add(diffDays, 'days');
            return prazoCorreto.format('YYYY-MM-DD')
        },
        validaBotoesPrazo(prazo){
            const index = this.listaPrazos.indexOf(prazo);
            var showValidationButtonsPrazo = 
            (
                (this.prazoParaAceitar)
                &&
                (index == (this.listaPrazos.length-1))
            );
            return showValidationButtonsPrazo;
        },
        criaPrazos(){
            var minDate = new Date();
            var maxDate = null;
            if(Array.isArray(this.listaPrazos) && this.listaPrazos.length){
                if(this.listaPrazos[this.listaPrazos.length - 1].situacao == false){
                    maxDate = getDateCalculated(this.listaPrazos[this.listaPrazos.length-1].prazo, -1);
                    var prazoEstendido = {
                        id: null,
                        prazo: "",
                        situacao: null,
                        maxDate: maxDate,
                        minDate: minDate,
                        createdDate: null,
                        new: true
                    };
                    this.listaPrazos.push(prazoEstendido);
                }
            } else {
                maxDate = new Date();
                maxDate.setDate(maxDate.getDate() + 20);
                var prazo = {
                        id: null,
                        prazo: "",
                        situacao: null,
                        maxDate: maxDate,
                        minDate: minDate,
                        createdDate: null,
                        new: true
                    };
                this.listaPrazos.push(prazo);
            }
        },
        iniciarTratarRNC(){
            if(this.crudType == 't'){
                this.criaPrazos();
            }
        },
        iniciarValidarRNC(){
            if(this.crudType == 'v'){
                this.iniciarPrazosParaAceitar();
            }
        }
  },
  watch: {
    descricao: function(novoValor){
        if(novoValor){
        var descricao = this.descricoes.find(t => t.value == novoValor);
        if(descricao && descricao.tipo){
            this.rnc.tipo = descricao.tipo;
        } else {
            this.rnc.tipo = null;
        }
        } else {
            this.rnc.tipo = null;
        }
    },
    tipo: function(novoValor){
        if(novoValor && novoValor == 3){
            this.rnc.tratar = true;
        } else {
            this.rnc.tratar = false;
        }
    }
  },
  created: function(){
      this.iniciarTratarRNC();
      this.iniciarValidarRNC();
      if(this.motivo){
          this.getDescricao();
      }
  }
}
</script>
