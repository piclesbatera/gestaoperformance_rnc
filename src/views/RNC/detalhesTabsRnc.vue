<template>
    <div style="clear: right;">
        <v-tabs v-model="rncTab" light background-color="#f7f7f7" show-arrows>
            <v-tabs-slider color="#cbc6c6"></v-tabs-slider>
    
            <v-tab :href="'#motivos'">Motivos</v-tab>
            <v-tab :href="'#irregularidades'">Irregularidades</v-tab>
            <v-tab :href="'#prazos'" v-if="visualizarTabPrazo" :disabled="!acessarTabPrazo">Prazos</v-tab>
            <v-tab :href="'#manifestacao'" v-if="visualizarTabManifestacao" :disabled="!acessarTabManifestacao">Contestação</v-tab>
            <v-tab :href="'#evidencias'" v-if="visualizarTabEvidencias">Evidências</v-tab>
        </v-tabs>
        <v-tabs-items v-model="rncTab" touchless>
            <!-- rncs -->
            <v-tab-item :value="'motivos'">
                <v-card flat>
                    <v-card-text>
                        <div class="row">
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label class="bmd-label-floating label-text" for="motivo">Motivo</label><font color="red"> *</font>
                                    <b-form-select v-model="rnc.motivo" v-if="!criado" :disabled="criado" @change="carregaDescricoes()" :options="motivos" ></b-form-select>
                                    <b-form-textarea no-resize v-else :disabled="criado" v-model="rnc.descricaoRef.motivoRef.descricaoMotivo" placeholder="Digite uma observação" rows="3" maxLength="200"></b-form-textarea>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label class="bmd-label-floating label-text" for="tipo">Descrição</label><font color="red"> *</font>
                                    <b-form-select v-model="rnc.descricao" v-if="!criado" :disabled="criado" :options="descricoes" ></b-form-select>
                                    <b-form-textarea no-resize v-else :disabled="criado" v-model="rnc.descricaoRef.descricao" placeholder="Digite uma observação" rows="3" maxLength="200"></b-form-textarea>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-6" >
                                <div class="form-group">
                                    <label class="bmd-label-floating label-text" for="tipo">Tipo</label><font color="red"> *</font>
                                    <b-form-select disabled v-model="rnc.tipo" :options="tipos" ></b-form-select>
                                </div>
                            </div>
                            <div class="col-lg-6" v-if="rncPrazoGrave">
                                <div class="form-group">
                                    <label class="bmd-label-floating label-text" for="tipo">Prazo</label><font color="red"> *</font>
                                    <b-form-datepicker 
                                        :disabled="criado"
                                        :min="dataAtual"  
                                        v-model="rnc.prazoGrave" 
                                        v-bind="datePickerLabels" 
                                        locale="pt-BR" 
                                        class="mb-2"
                                        today-button
                                        reset-button
                                        close-button
                                        :date-format-options="{
                                            year: 'numeric',
                                            month: 'numeric',
                                            day: 'numeric'}">
                                    </b-form-datepicker>
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
                                    <b-form-invalid-feedback :state="rnc.resolvido">
                                        Iniciar uma nova tratativa para essa RNC.
                                    </b-form-invalid-feedback>
                                    <b-form-valid-feedback :state="rnc.resolvido">
                                        Finalizar a RNC como resolvida.
                                    </b-form-valid-feedback>
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
                                <b-form-textarea no-resize :disabled="!permissaoAlterarRnc || (crudType == 'c' && criado)" v-model="rnc.observacao" placeholder="Digite uma observação" rows="3" maxLength="200"></b-form-textarea>
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
                            <div class="row">
                                <div class="col-lg-6" >
                                    <div class="form-group">
                                        <label class="bmd-label-floating label-text">Prazo</label><font color="red" v-if="crudType == 't'"> *</font>
                                        <b-form-datepicker 
                                            :min="prazo.minDate"
                                            :state="prazo.situacao" 
                                            :disabled="alterarPrazo" 
                                            v-model="prazo.prazo" 
                                            @input="apagaInfoPrazo()"
                                            v-bind="datePickerLabels" 
                                            locale="pt-BR" 
                                            class="mb-2"
                                            today-button
                                            reset-button
                                            close-button
                                            :date-format-options="{
                                                year: 'numeric',
                                                month: 'numeric',
                                                day: 'numeric'}">
                                        </b-form-datepicker>
                                        <template v-if="prazo.situacao != null">
                                            <b-form-invalid-feedback :state="prazo.situacao">
                                                Recusado
                                            </b-form-invalid-feedback>
                                            <b-form-valid-feedback :state="prazo.situacao">
                                                Aceito
                                            </b-form-valid-feedback>
                                        </template>
                                    </div>
                                </div>
                                <template v-if="validaBotoesPrazo">
                                    <div class="col-lg-3">
                                        <div class="form-group">
                                            <label class="bmd-label-floating blank-label"></label>
                                            <v-btn class="btn btn-danger form-control" color="red" dark @click="setSituacaoPrazo(false);">
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
                                            <v-btn class="btn btn-primary form-control" color="blue" dark @click="setSituacaoPrazo(true);">
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
                            <v-card>
                                <v-container fluid grid-list-md>
                                    <v-card-title>
                                        Histórico de Prazos
                                        <v-spacer></v-spacer>
                                        <v-text-field v-model="searchHistoricoPrazo" append-icon="mdi-magnify" label="Pesquisa" single-line hide-details></v-text-field>
                                    </v-card-title>
                                    <v-divider></v-divider>
                                    <v-data-table :custom-sort="customSort" sort-by="dataCriacao" class="default_color_background" :headers="headersHistoricoPrazo" :items="listaHistoricoPrazosDataTable" :search="searchHistoricoPrazo" loading-text="Carregando..." no-data-text="Sem dados disponíveis" no-results-text="Não foi encontrado dados para a pesquisa realizada" :items-per-page="5">
                                    </v-data-table>
                                </v-container>
                            </v-card>
                        </div>
                    </v-card-text>
                </v-card>
            </v-tab-item>

            <!-- Manifestacao -->
            <v-tab-item :value="'manifestacao'" v-if="visualizarTabManifestacao">
                <v-card flat>
                    <v-card-text>
                        <label class="bmd-label-floating label-text">Contestação/Justificativa</label><font color="red"> *</font>
                        <b-form-textarea no-resize v-model="rnc.manifestacaoRncRef.descricaoManifestacao" :state="rnc.manifestacaoRncRef.aceito" :disabled="!permissaoAlterarManifestacao" placeholder="Digite sua contestação/justificativa" rows="3" maxLength="200" class="mb-2"></b-form-textarea>
                        <template v-if="rnc.manifestacaoRncRef.aceito != null">
                            <b-form-invalid-feedback :state="rnc.manifestacaoRncRef.aceito">
                                Recusado
                            </b-form-invalid-feedback>
                            <b-form-valid-feedback :state="rnc.manifestacaoRncRef.aceito">
                                Abonado
                            </b-form-valid-feedback>
                        </template>
                        <div class="row" v-if="manifestacaoRncButtons">
                            <div class="col-lg-6">
                                <v-btn class="btn btn-danger form-control" color="red" dark @click="rnc.manifestacaoRncRef.aceito = false;">
                                    Recusar
                                    <v-icon dark right>
                                        mdi-cancel
                                    </v-icon>
                                </v-btn>
                            </div>
                            <div class="col-lg-6">
                                <v-btn class="btn btn-primary form-control" color="blue" dark @click="rnc.manifestacaoRncRef.aceito = true;">
                                    Abonar
                                    <v-icon dark right>
                                        mdi-checkbox-marked-circle
                                    </v-icon>
                                </v-btn>
                            </div>
                        </div>
                        <UploadForm :id="rnc.manifestacaoRncRef.id" :inicializaLinha="permissaoAlterarManifestacao" :novoObjetoString="novoObjetoManifestacao" :permissaoAlterarComponente="permissaoAlterarManifestacao" v-model="rnc.manifestacaoRncRef.listaEvidenciasManifestacaoRnc" :tipoArquivo="'evidenciasManifestacaoRnc'"/>
                    </v-card-text>
                </v-card>
            </v-tab-item>

            <!-- Evidências -->
            <v-tab-item :value="'evidencias'" v-if="visualizarTabEvidencias">
                <v-card flat>
                    <v-card-text>
                        <v-tabs v-model="evidenciasTab" light background-color="#f7f7f7" show-arrows>
                            <v-tabs-slider color="#cbc6c6"></v-tabs-slider>
                            <v-tab v-for="(tratativa, index) in rnc.listaTratativas" :key="index">
                                Tratativa {{tratativa.numeracaoTratativa}}
                                <v-icon v-if="tratativa.leitura && crudType == 't'" color="primary" dark right medium>
                                    mdi-arrow-right-bold-circle-outline
                                </v-icon>
                                <v-icon v-if="tratativa.aceito != null" :color="(tratativa.aceito) ? 'primary' : 'red'" dark right medium>
                                    mdi-checkbox-blank-circle
                                </v-icon>
                            </v-tab>
                        </v-tabs>
                        <v-tabs-items v-model="evidenciasTab" touchless>
                            <v-tab-item eager v-for="(tratativa, index) in rnc.listaTratativas" :key="index">
                                <UploadForm :id="tratativa.id" :permiteExclusao="true" :inicializaLinha="permissaoAlterarEvidencia && (tratativa.leitura == false && tratativa.aceito == null)" :novoObjetoString="novoObjetoEvidencia" :permissaoAlterarComponente="permissaoAlterarEvidencia && (tratativa.leitura == false && tratativa.aceito == null)" v-model="tratativa.listaEvidencias" :tipoArquivo="'evidencias'">
                                    <template v-if="rnc.status == 5 && !tratativa.leitura" v-slot:iconesAdicionais>
                                        <v-btn class="btn btn-primary" v-if="!tratativa.enviar" @click="tratativa.enviar = true" color="blue" dark >
                                            <v-icon dark left>
                                                mdi-send
                                            </v-icon>
                                            Enviar
                                        </v-btn>
                                        <v-btn class="btn btn-danger" v-else @click="tratativa.enviar = false" color="red" dark >
                                            <v-icon dark left>
                                                mdi-send
                                            </v-icon>
                                            Enviar
                                        </v-btn>
                                    </template>
                                </UploadForm>
                            </v-tab-item>
                        </v-tabs-items>
                    </v-card-text>
                </v-card>
            </v-tab-item>

            
        </v-tabs-items>
    </div>
</template>

<script>
import UploadForm from './uploadForm'
import HistoricoObservacoes from './historicoObservacoes'
import { baseApi, showError } from "@/global";
import axios from "axios";
import datePickerLabels from "@/assets/json/calendario/traducao.json";
import moment from 'moment'
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
        registro: Object,
        isLeitura: Boolean
    },
    computed: {
        listaHistoricoPrazosDataTable: function(){
            return this.rnc.listaHistoricoPrazos.map(e => {
                e['dataCriacaoLocalString'] = (e['dataCriacao']) ? moment(e['dataCriacao']).format('DD/MM/YYYY HH:mm:ss') : "";
                e['prazoLocalString'] = (e['prazo']) ? moment(e['prazo']).format('DD/MM/YYYY') : "";
                e['dataSituacaoLocalString'] = (e['dataSituacao']) ? moment(e['dataSituacao']).format('DD/MM/YYYY HH:mm:ss') : "";

                if(e.situacao == null){
                    e['situacaoString'] = 'Não respondido';
                } else
                if(e.situacao) {
                    e['situacaoString'] = 'Aceito';
                } else{
                    e['situacaoString'] = 'Rejeitado';
                }

                return e;
            });
        },
        alterarPrazo: function(){
            return Boolean(!(this.crudType == 't' && (this.rnc.status == 3 || this.rnc.status == 1) && !this.prazo.situacao));
        },
        rncPrazoGrave: function(){
            return Boolean(this.rnc.tipo ==  3 || this.rnc.tipo == 4);
        },
        criado: function(){
            return Boolean(this.rnc.dataCriacao);
        },
        acessarTabPrazo: function(){
            return Boolean(
                ((this.crudType == 'v' || this.crudType == 'c') && this.rnc.prazo.prazo) || (this.crudType == 't' && (!this.rnc.manifestacaoRncRef.descricaoManifestacao || this.rnc.manifestacaoRncRef.aceito == false))
            );
        },
        acessarTabManifestacao: function(){
            return Boolean(((this.crudType == 'c' || this.crudType == 'v') && this.rnc.manifestacaoRncRef && this.rnc.manifestacaoRncRef.descricaoManifestacao)
            ||
            (this.crudType == 't' && (!this.prazo.prazo && this.listaHistoricoPrazos.length == 0) || (this.rnc.manifestacaoRncRef.aceito == false))   );
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
        permissaoAlterarRnc: function(){
            return (this.rnc.status != 8 && this.rnc.status != 9);
        },
        permissaoAlterarIrregularidade: function(){
            return ((this.permissaoAlterarRnc) && ( (this.crudType == 'c' && !this.isLeitura && this.rnc.status == null) || (this.crudType == 'v' && this.rnc.status == 2)));
        },
        ultimaTratativa: function(){
            var ultimaTratativa = {}; 
            ultimaTratativa = this.rnc.listaTratativas.reduce((anterior, atual) => (anterior.numeracaoTratativa > atual.numeracaoTratativa) ? anterior : atual);
            return ultimaTratativa;
        },
        completeRNCButtons(){
            return (this.crudType == 'v' && (Array.isArray(this.ultimaTratativa.listaEvidencias) && this.ultimaTratativa.listaEvidencias.length) && this.rnc.status == 6);
        },
        manifestacaoRncButtons(){
            return (this.crudType == 'v' && this.rnc.status == 2 && this.rnc.manifestacaoRncRef && this.rnc.manifestacaoRncRef.descricaoManifestacao);
        },
        listaHistoricoPrazos: {
            get(){
                if(this.rnc && this.rnc.listaHistoricoPrazos){
                    return this.rnc.listaHistoricoPrazos;
                } else {
                    return [];
                }
            },
            set(listaHistoricoPrazos) {
                this.rnc.listaHistoricoPrazos = listaHistoricoPrazos;
            }
        },
        visualizarTabPrazo: function(){
            if(this.crudType == 't' || this.crudType == 'v' || (this.crudType == 'c' &&  this.rnc.id)){
                return true;
            }
            return false;
        },
        visualizarTabManifestacao: function(){
            return Boolean(this.rnc.manifestacaoRncRef);
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
            return (this.prazo.situacao && this.prazo.dataSituacao);
        },
        permissaoAlterarEvidencia: function(){
            return ((this.permissaoAlterarRnc) &&  (this.visualizarTabEvidencias) && (this.crudType == 't') && (this.rnc.status == 5));
        },
        permissaoAlterarManifestacao: function(){
            return ((this.permissaoAlterarRnc) &&  (this.visualizarTabManifestacao) && (this.crudType == 't') && (this.rnc.status == 1));
        },
        validaBotoesPrazo: function(){
            return Boolean(this.crudType == 'v' && this.prazo.prazo && !this.prazo.dataSituacao && this.rnc.status == 4);
        }
    },
  data: function() {
    return {
        rncTab: '',
        evidenciasTab: '',
        dataAtual: moment().format('YYYY-MM-DD'),
        prazo: {
                prazo: "",
                situacao: null,
                minDate: moment().format('YYYY-MM-DD'),
                dataCriacao: null,
                dataSituacao: null
            },
        headersHistoricoPrazo: [
          {text: 'Data de Criação', value: 'dataCriacaoLocalString'},
          { text: 'Prazo', value: 'prazoLocalString' },
          { text: 'Situação', value: 'situacaoString' },
          { text: 'Data da Situação', value: 'dataSituacaoLocalString' },
        ],
        searchHistoricoPrazo: "",
        datePickerLabels,
        showHistoricoObservacoes: false,
        descricoes: [
            { "value": null, "text": "Selecione uma descrição" }
        ],
        prazoParaAceitar: false,
        novoObjetoEvidencia: '{ "id": null,  "descricaoAnexo": null, "file": null, "nomeArquivo": null, "loadingArquivo": false }',
        novoObjetoManifestacao: '{ "id": null,  "descricaoAnexo": null, "file": null, "nomeArquivo": null, "loadingArquivo": false }',
        novoObjetoIrregularidade: '{ "id": null,  "descricaoAnexo": null, "file": null, "nomeArquivo": null, "loadingArquivo": false }'
    }
  },
  methods: {
        apagaInfoPrazo(){
            this.prazo.id = null;
            this.prazo.situacao = null;
            this.prazo.dataCriacao = null;
        },
        carregaDescricoes(){
            this.rnc.descricao = null;
            this.getDescricao();
        },
        getDescricao(){
            var comboBox = [{ "value": null, "text": "Selecione uma descrição" }];
            if(this.rnc.motivo){
                var queryString = '?';
                var contrato = this.registro.codigoContrato;
                queryString += '&contrato='+contrato;
                queryString += '&motivo='+this.rnc.motivo;

                axios
                .get(`${baseApi}/rnc/descricoes${queryString}`)
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
        iniciaDescricao(){
            if(this.rnc.descricaoRef && this.rnc.descricaoRef.motivo){
                this.rnc.motivo=this.rnc.descricaoRef.motivo;
            }
            if(this.motivo){
                if(this.rnc.descricaoRef.descricao && this.rnc.descricaoRef.tipo){
                    var  comboBox = [{ "value": this.rnc.descricaoRef.id , "text": this.rnc.descricaoRef.descricao }];
                    this.descricoes = comboBox;
                    this.rnc.tipo = this.rnc.descricaoRef.tipo;
                }
            }
        },
        setSituacaoPrazo(novaSituacao){
            if(novaSituacao != this.prazo.situacao){
                this.prazo.situacao = novaSituacao;
                this.prazo['updated'] = true;
            }
        },
        iniciarPrazo(){
            if(this.rnc){
                if(this.rnc.listaHistoricoPrazos && Array.isArray(this.listaHistoricoPrazos) && this.listaHistoricoPrazos.length){
                    var prazoAtual = this.rnc.listaHistoricoPrazos[this.listaHistoricoPrazos.length - 1];
                    this.prazo.prazo = prazoAtual.prazo;
                    this.prazo.situacao = prazoAtual.situacao;
                    this.prazo.dataSituacao = prazoAtual.dataSituacao;
                    this.prazo.minDate = moment().format('YYYY-MM-DD');
                    this.prazo.dataCriacao = prazoAtual.dataCriacao;
                }
                this.rnc['prazo'] = this.prazo;
            }
        },
        customSort(items, index, isDesc) {
            items.sort((a, b) => {
                if (index[0] === "dataCriacao") {
                if (!isDesc[0]) {
                    return this.convertBrazilDateLocaleStringToISO(a[index]).getTime() - this.convertBrazilDateLocaleStringToISO(b[index]).getTime();
                } else {
                    return this.convertBrazilDateLocaleStringToISO(b[index]).getTime() - this.convertBrazilDateLocaleStringToISO(a[index]).getTime();
                }
                } else if (!(isNaN(a[index[0]]))) {
                if (!isDesc[0]) {
                    return (a[index[0]] - b[index[0]]);
                } else {
                    return (b[index[0]] - a[index[0]]);
                }
                } else {
                    if (!isDesc[0]) {
                        return (a[index[0]] < b[index[0]]) ? -1 : 1;
                    } else {
                        return (b[index[0]] < a[index[0]]) ? -1 : 1;
                    }
                }
            });
            return items;
            },
        convertBrazilDateLocaleStringToISO(brazilDateLocaleString){
            var hours = brazilDateLocaleString.split(" ")[1];
            var date = brazilDateLocaleString.split(" ")[0];

            var isoString = date.split("/")[2] + "-" + date.split("/")[1] + "-" + date.split("/")[0];
            var iso = new Date(isoString + " " + hours);
            return iso;
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
    }
  },
  created: function(){
        this.iniciarPrazo();
        this.iniciaDescricao();
  }
}
</script>
