<template>
    <div>
        <v-tabs v-model="motivo.tab" light background-color="#f7f7f7" show-arrows>
            <v-tabs-slider color="#cbc6c6"></v-tabs-slider>
    
            <v-tab :href="'#motivos'">Motivos</v-tab>
            <v-tab :href="'#prazos'" v-if="previewTabPrazo">Prazos</v-tab>
            <v-tab :href="'#evidencias'" v-if="previewTabEvidencias">Evidencias</v-tab>
        </v-tabs>
        <v-tabs-items v-model="motivo.tab" touchless>
            <!-- Motivos -->
            <v-tab-item :value="'motivos'">
                <v-card flat>
                    <v-card-text>
                        <div class="row">
                            <div class="col-lg-5">
                                <div class="form-group">
                                    <label class="bmd-label-floating label-text" for="motivo">Motivo</label><font color="red"> *</font>
                                    <b-form-select :disabled="true" id="motivo" v-model="motivo.motivo" :options="motivos" ></b-form-select>
                                </div>
                            </div>
                            <div class="col-lg-5">
                                <div class="form-group">
                                    <label class="bmd-label-floating label-text" for="tipo">Tipo</label><font color="red"> *</font>
                                    <b-form-select :disabled="true" id="tipo" v-model="motivo.tipo" :options="tipos" ></b-form-select>
                                </div>
                            </div>
                            <template v-if="completeRNCButtons">
                                <div class="col-lg-1">
                                    <div class="form-group">
                                        <label class="bmd-label-floating blank-label"></label>
                                        <v-btn class="btn btn-danger form-control" color="red" dark @click="motivo.status = false;">
                                            <v-icon dark >
                                                mdi-cancel
                                            </v-icon>
                                        </v-btn>
                                    </div>
                                </div>
                                <div class="col-lg-1">
                                    <div class="form-group">
                                        <label class="bmd-label-floating blank-label"></label>
                                        <v-btn class="btn btn-primary form-control" color="blue" dark @click="motivo.status = true;">
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
            <v-tab-item :value="'evidencias'" v-if="previewTabEvidencias">
                <v-card flat>
                    <v-card-text>
                        <Rnc_uploadDetailForm :id="motivo.id" :initialRow="permissionAlterEvidencias" :newObject="newEvidenciaObject" :permissionAlterComponent="permissionAlterEvidencias" v-model="listaEvidencias" :folder="'evidencias'" />
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
                                            <label class="bmd-label-floating label-text" :for="'dataPrazo_'+prazo.codigo">Prazo</label><font color="red" v-if="crudType == 't'"> *</font>
                                            <b-form-datepicker :min="prazo.minDate" :max="prazo.maxDate" :state="prazo.state" :disabled="crudType == 'v' || prazo.state != null" :id="'dataPrazo_'+prazo.codigo" v-model="prazo.dataPrazo" v-bind="datePickerLabels" locale="pt-BR" class="mb-2"
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
                                                <v-btn class="btn btn-danger form-control" color="red" dark @click="correctPrazo(prazo, false);">
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
                                                <v-btn class="btn btn-primary form-control" color="blue" dark @click="correctPrazo(prazo, true);">
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
            
        </v-tabs-items>
    </div>
</template>

<script>
import Rnc_uploadDetailForm from './rnc_uploadDetailForm'
import {getDateCalculated } from "@/global";
export default {
    name: "rnc_detalhes_tabsMotivoForm",
    components: {
        Rnc_uploadDetailForm
    },
    props: {
        motivo: Object,
        crudType: String
    },
    computed: {
        completeRNCButtons(){
            return (this.crudType == 'v' && this.motivo.initStatus == null && (Array.isArray(this.listaEvidencias) && this.listaEvidencias.length));
        },
        listaPrazos: {
            get(){
                if(this.motivo && this.motivo.listaPrazos){
                    return this.motivo.listaPrazos;
                } else {
                    return [];
                }
            },
            set(listaPrazos) {
                this.motivo.listaPrazos = listaPrazos;
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
                if(this.motivo && this.motivo.listaEvidencias){
                    return this.motivo.listaEvidencias;
                } else {
                    return [];
                }
            },
            set(listaEvidencias){
                this.motivo.listaEvidencias = listaEvidencias;
            }
        },
        previewTabEvidencias: function(){
            return ((Array.isArray(this.listaPrazos) && this.listaPrazos.length) && (this.listaPrazos[this.listaPrazos.length - 1].state == true) && (!this.havingPrazoToAccept));
        },
        permissionAlterEvidencias: function(){
            return (this.previewTabEvidencias && (this.crudType == 't'));
        },
    },
  data: function() {
    return {
        havingPrazoToAccept: false,
        newEvidenciaObject: '{ "id": null,  "descricaoAnexo": "", "file": null, "filename": null, "loadingFile": false }',
        motivos: [
            { "value": null, "text": "Selecione um motivo" },
            { "value": '1', "text": "Value 1" },
            { "value": '2', "text": "Value 2" }
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
      correctPrazo(prazo, newState){
          if(newState != prazo.state){
              if(prazo.state != null){
                  if(newState){
                    //  CALC +
                } else {
                    //   CALC -
                }
              }

              prazo.state = newState;
          }
      },
      initHavingPrazoToAccept(){
            if( this.crudType == 'v' && (this.listaPrazos[this.listaPrazos.length-1] && this.listaPrazos[this.listaPrazos.length-1].state == null) ){
                this.havingPrazoToAccept = true;
            }
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
                    var codigo = (parseInt(this.listaPrazos[this.listaPrazos.length - 1].codigo) + 1).toString();
                    codigo = codigo.padStart(3, "0");
                    maxDate = getDateCalculated(this.listaPrazos[this.listaPrazos.length-1].dataPrazo, -5);
                    var prazoEstendido = {
                        id: null,
                        codigo: codigo,
                        dataPrazo: "",
                        state: null,
                        maxDate: maxDate,
                        minDate: minDate
                    };
                    this.listaPrazos.push(prazoEstendido);
                }
            } else {
                maxDate = new Date();
                maxDate.setDate(maxDate.getDate() + 20);
                var prazo = {
                        id: null,
                        codigo: '001',
                        dataPrazo: "",
                        state: null,
                        maxDate: maxDate,
                        minDate: minDate,
                        createdDate: null
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
