<template>
    <div style="clear: right;">
        <v-tabs v-model="rnc.tab" light background-color="#f7f7f7" show-arrows>
            <v-tabs-slider color="#cbc6c6"></v-tabs-slider>
    
            <v-tab :href="'#motivos'">Motivos</v-tab>
            <v-tab :href="'#irregularidades'">Irregularidades</v-tab>
            <v-tab :href="'#prazos'" v-if="previewTabPrazo">Prazos</v-tab>
            <v-tab :href="'#evidencias'" v-if="previewTabEvidencias">Evidencias</v-tab>
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
                                    <b-form-select :disabled="desabilitaDetalhes" v-model="rnc.motivo" :options="motivos" ></b-form-select>
                                </div>
                            </div>
                            <div class="col-lg-5">
                                <div class="form-group">
                                    <label class="bmd-label-floating label-text" for="tipo">Tipo</label><font color="red"> *</font>
                                    <b-form-select :disabled="desabilitaDetalhes" v-model="rnc.tipo" :options="tipos" ></b-form-select>
                                </div>
                            </div>
                            <template v-if="completeRNCButtons">
                                <div class="col-lg-1">
                                    <div class="form-group">
                                        <label class="bmd-label-floating blank-label"></label>
                                        <v-btn class="btn btn-danger form-control" color="red" dark @click="rnc.status = false;">
                                            <v-icon dark >
                                                mdi-cancel
                                            </v-icon>
                                        </v-btn>
                                    </div>
                                </div>
                                <div class="col-lg-1">
                                    <div class="form-group">
                                        <label class="bmd-label-floating blank-label"></label>
                                        <v-btn class="btn btn-primary form-control" color="blue" dark @click="rnc.status = true;">
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

             <!-- Irregularidades -->
            <v-tab-item :value="'irregularidades'">
                <v-card flat>
                    <v-card-text>
                        <Rnc_uploadDetailForm :id="rnc.id" :initialRow="permissionAlterIrregularidades" :newObjectString="newIrregularidadeObject" :permissionAlterComponent="permissionAlterIrregularidades" v-model="listaIrregularidades" :folder="'irregularidades'" />
                    </v-card-text>
                </v-card>
            </v-tab-item>

            <!-- Prazos -->
            <v-tab-item :value="'prazos'" v-if="previewTabPrazo">
                <v-card flat>
                    <v-card-text>
                        <div class="container-fluid">
                            <div v-for="prazo in listaPrazos" :key="prazo.codigo">
                                <div class="row">
                                    <div class="col-lg-6" >
                                        <div class="form-group">
                                            <label class="bmd-label-floating label-text">Prazo</label><font color="red" v-if="crudType == 't'"> *</font>
                                            <b-form-datepicker :min="prazo.minDate" :max="prazo.maxDate" :state="prazo.state" :disabled="!prazo.new" v-model="prazo.prazo" v-bind="datePickerLabels" locale="pt-BR" class="mb-2"
                                                :date-format-options="{
                                                    year: 'numeric',
                                                    month: 'numeric',
                                                    day: 'numeric'
                                                }"></b-form-datepicker>
                                        </div>
                                    </div>
                                    <template v-if="validationButtonsPrazo(prazo)">
                                        <div class="col-lg-3">
                                            <div class="form-group">
                                                <label class="bmd-label-floating blank-label"></label>
                                                <v-btn class="btn btn-danger form-control" color="red" dark @click="setState(prazo, false);">
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
                                                <v-btn class="btn btn-primary form-control" color="blue" dark @click="setState(prazo, true);">
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
            <v-tab-item :value="'evidencias'" v-if="previewTabEvidencias">
                <v-card flat>
                    <v-card-text>
                        <Rnc_uploadDetailForm :id="rnc.id" :initialRow="permissionAlterEvidencias" :newObjectString="newEvidenciaObject" :permissionAlterComponent="permissionAlterEvidencias" v-model="listaEvidencias" :folder="'evidencias'" />
                    </v-card-text>
                </v-card>
            </v-tab-item>

            
        </v-tabs-items>
    </div>
</template>

<script>
import Rnc_uploadDetailForm from './rnc_uploadDetailForm'
import {getDateCalculated } from "@/global";
import moment from 'moment'
export default {
    name: "rnc_detalhes_tabsRNCForm",
    components: {
        Rnc_uploadDetailForm
    },
    props: {
        desabilitaDetalhes: Boolean,
        rnc: Object,
        crudType: String
    },
    computed: {
        permissionAlterIrregularidades: function(){
            return ((this.crudType == 'c' || this.crudType == 'v'));
        },
        completeRNCButtons(){
            return (this.crudType == 'v' && this.rnc.initStatus == null && (Array.isArray(this.listaEvidencias) && this.listaEvidencias.length));
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
        previewTabPrazo: function(){
            if(this.crudType == 't' || this.crudType == 'v'){
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
        previewTabEvidencias: function(){
            return ( (this.crudType != 'c') && (Array.isArray(this.listaPrazos) && this.listaPrazos.length) && (this.listaPrazos[this.listaPrazos.length - 1].state == true) && (!this.havingPrazoToAccept));
        },
        permissionAlterEvidencias: function(){
            return (this.previewTabEvidencias && (this.crudType == 't'));
        },
    },
  data: function() {
    return {
        havingPrazoToAccept: false,
        newEvidenciaObject: '{ "id": null,  "descricaoAnexo": null, "file": null, "filename": null, "loadingFile": false, "new": true }',
        newIrregularidadeObject: '{ "id": null,  "descricaoAnexo": null, "file": null, "filename": null, "loadingFile": false, "new": true }',
        motivos: [
            { "value": null, "text": "Selecione um motivo" },
            { "value": '1', "text": "Value 1" },
            { "value": '2', "text": "Value 2" }
        ],
        tipos: [
            { "value": null, "text": "Selecione um tipo" },
            { "value": '1', "text": "Value 1" },
            { "value": '2', "text": "Value 2" }
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
        setState(prazo, newState){
            if(newState != prazo.state){
                if(newState){
                    prazo.prazo = prazo.correctPrazo;
                } else {
                    prazo.prazo = prazo.originalPrazo;
                }
                prazo.state = newState;
                prazo['updated'] = true;
            }
        },
        initHavingPrazoToAccept(){
            if( this.crudType == 'v' && (Array.isArray(this.listaPrazos) && this.listaPrazos[this.listaPrazos.length-1] && this.listaPrazos[this.listaPrazos.length-1].state == null) ){
                this.havingPrazoToAccept = true;
                this.storePrazo(this.listaPrazos[this.listaPrazos.length-1]);
            }
        },
        storePrazo(prazo){
            prazo['originalPrazo'] = prazo.prazo;
            prazo['correctPrazo'] = this.correctPrazo(prazo);
        },
        correctPrazo(prazo){
            var today = moment();
            var dataCriacao = moment(prazo.dataCriacao);
            var diffDays = today.diff(dataCriacao, 'days');
            var correctPrazo = moment(prazo.prazo);
            correctPrazo.add(diffDays, 'days');
            return correctPrazo.format('YYYY-MM-DD')
        },
        validationButtonsPrazo(prazo){
            const index = this.listaPrazos.indexOf(prazo);
            var showValidationButtonsPrazo = 
            (
                (this.havingPrazoToAccept)
                &&
                (index == (this.listaPrazos.length-1))
            );
            return showValidationButtonsPrazo;
        },
        criaPrazos(){
            var minDate = new Date();
            var maxDate = null;
            if(Array.isArray(this.listaPrazos) && this.listaPrazos.length){
                if(this.listaPrazos[this.listaPrazos.length - 1].state == false){
                    maxDate = getDateCalculated(this.listaPrazos[this.listaPrazos.length-1].prazo, -5);
                    var prazoEstendido = {
                        id: null,
                        prazo: "",
                        state: null,
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
                        state: null,
                        maxDate: maxDate,
                        minDate: minDate,
                        createdDate: null,
                        new: true
                    };
                this.listaPrazos.push(prazo);
            }
        },
        initTratarRNC(){
            if(this.crudType == 't'){
                this.criaPrazos();
            }
        },
        initValidarRNC(){
            if(this.crudType == 'v'){
                this.initHavingPrazoToAccept();
            }
        }
  },
  created: function(){
      this.initTratarRNC();
      this.initValidarRNC();
  }
}
</script>
