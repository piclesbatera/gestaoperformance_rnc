<template>
    <div>
        <div v-if="loadingAll">
            <span>Carregando...</span>
            <!-- <v-progress-linear color="deep-purple accent-4" indeterminate rounded height="6"></v-progress-linear> -->
            <v-progress-linear indeterminate color="blue" ></v-progress-linear>
        </div>
        <template v-else>
            <v-tabs
                v-model="tab"
                light
                background-color="#f7f7f7"
                grow
                show-arrows>
                <v-tabs-slider color="teal lighten-4"></v-tabs-slider>
        
                <template v-if="listaAreas.length > 1">
                    <v-tab v-for="(area, index) in listaAreas" :key="area.id">{{index+1}}</v-tab>
                </template>
            </v-tabs>
           <v-tabs-items v-model="tab" touchless>
               <v-tab-item v-for="(area) in listaAreas" :key="area.id">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-lg-5">
                                <div class="form-group">
                                    <label class="bmd-label-floating label-text" for="areaDemandante">Área Demandante</label><font color="red"> *</font>
                                    <b-form-select id="areaDemandante" disabled v-model="area.areaDemandante" :options="areasDemandantes" ></b-form-select>
                                </div>
                            </div>
                        </div>
                    </div> 
                    <ListagemRnc :listaRNCs="area.listaRNCs" :crudType="crudType" :isLeitura="true" :registro="registro"/>
               </v-tab-item>
           </v-tabs-items>
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
        crudType: String,
        motivo: Number,
        infosRegistro: Object,
        registro: Object
    },
    computed: {
        ...mapState(["usuario"]),
        loadingAll: function(){
            return this.loadingListaAreas || this.loadingAreasDemandantes; 
        }
    },
  data: function() {
    return {
        tab: 0,
        loadingListaAreas: true,
        loadingAreasDemandantes: true,
        listaAreas: [],
        areasDemandantes: [
            { "value": null, "text": "Selecione uma área demandante" }
        ]
    }
  },
  methods: {
        getListaAreas(){
            var sg = this.infosRegistro['sg'];
            var codigoSg = this.infosRegistro['codigoSg'];
            var codigoGrupoFila = this.infosRegistro['codigoGrupoFila'];
            var motivo = this.motivo;
            var queryString = (codigoGrupoFila) ? `?tipoAcionamento=${codigoGrupoFila}` : "";
            var url = `${baseApi}/rnc/outrasNaturezas/${sg}/${codigoSg}/${motivo}${queryString}`;

            axios.get(url).then(res => {
                var listaAreas = {}
                listaAreas = res.data;

                if(listaAreas){
                    listaAreas.forEach(
                        (detalhes) => {
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
                        }
                    )
                }

                this.listaAreas = listaAreas;

            }).catch(error => {
                showError(error);
            })
            .finally(() => {
                this.loadingListaAreas = false;
            });
        },
        getAreasDemandantes(){
            var comboBox = [{ "value": null, "text": "Selecione uma àrea" }];

            this.loadingAreasDemandantes = true;

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
                    this.loadingAreasDemandantes = false;
                });

        },
        async iniciar(){
            await this.getAreasDemandantes();
            this.getListaAreas();
        }
  },
  created: function(){
      this.iniciar();
  }
}
</script>
