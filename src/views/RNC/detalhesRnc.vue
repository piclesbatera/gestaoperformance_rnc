<template>
    <div>
        <div v-if="loadingDetalhe">
            <span>Carregando...</span>
            <!-- <v-progress-linear color="deep-purple accent-4" indeterminate rounded height="6"></v-progress-linear> -->
            <v-progress-linear indeterminate color="blue" ></v-progress-linear>
        </div>
        <template v-else>
           <div class="container-fluid">
                <div class="row">
                    <div class="col-lg-5">
                        <div class="form-group">
                            <label class="bmd-label-floating label-text" for="areaDemandante">Área Demandante</label><font color="red"> *</font>
                            <b-form-select id="areaDemandante" disabled v-model="detalhes.areaDemandante" :options="areasDemandantes" ></b-form-select>
                        </div>
                    </div>
                </div>
            </div> 
            <ListagemRnc :listaRNCs="detalhes.listaRNCs" :crudType="crudType" :isLeitura="isLeitura"/>
        </template>
    </div>
</template>

<script>
import ListagemRnc from './listagemRnc'
import { baseApi, showError } from "@/global";
import axios from "axios";
import { mapState } from "vuex";
export default {
    name: "detalhesRnc",
    components: {
        ListagemRnc
    },
    props: {
        value: Object,
        crudType: String,
        identificadorRegistroSistemaAreaDemandanteRnc: Number,
        isLeitura: Boolean
    },
    computed: {
        ...mapState(["usuario"]),
        detalhes: {
            get () {
                return this.value
                // return this.dataValue
            },
            set (value) {
                // this.dataValue = value;
                this.$emit('input', value);
            }
        }
    },
  data: function() {
    return {
        // dataValue: null,
        loadingDetalhe: true,
        areasDemandantes: [
            { "value": null, "text": "Selecione uma área demandante" }
        ]
    }
  },
  methods: {
        getDetalhesRNC(){
            var queryString = (this.identificadorRegistroSistemaAreaDemandanteRnc) ? `?id=${this.identificadorRegistroSistemaAreaDemandanteRnc}` : "";
            var url = `${baseApi}/rnc${queryString}`;

            axios.get(url).then(res => {
                var detalhes = res.data;
              
                if(detalhes && !detalhes.areaDemandante){
                    if(this.usuario.perfilUsuario.usuarioTim.areaDemandante){
                        detalhes.areaDemandante = this.usuario.perfilUsuario.usuarioTim.areaDemandante;
                    }
                }

                // ARMAZENAR O STATUS INICIAL DOS RNCs RECUPERADOS E CONVERTE A DATA DE OBSERVAÇÕES
                if(detalhes && detalhes.listaRNCs){
                    detalhes.listaRNCs.forEach( 
                        (rnc) => 
                        {
                            rnc['statusInicial'] = rnc.resolvido;
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
                if(!this.detalhes.listaRNCs || this.detalhes.listaRNCs.length == 0){
                    this.$nextTick(function () {
                        this.novaRNC();
                    });
                }
            }).catch(error => {
                showError(error);
            })
            .finally(() => {
                this.loadingDetalhe = false;
            });
        },
        novaRNC(){
            var listaRNCs = this.detalhes.listaRNCs;
            if(!listaRNCs){
                listaRNCs = [];
            }

            // if(!this.detalhes.listaRNCs){
            //     this.$set(this.detalhes, 'listaRNCs', []);
            // }
            var rnc =  {
                        id: null,
                        motivo: null,
                        descricao: null,
                        tipo: null,
                        resolvido: null,
                        tratavel: false,
                        listaIrregularidades: [
                        ]
                    };
            // this.$set(this.detalhes.listaRNCs, this.detalhes.listaRNCs.length, rnc);
            listaRNCs.push(rnc);
            this.detalhes.listaRNCs = listaRNCs;
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
        async iniciar(){
            await this.getAreasDemandantes();
            this.getDetalhesRNC();
        }
  },
  created: function(){
      this.iniciar();
  }
}
</script>
