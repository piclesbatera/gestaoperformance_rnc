<template>
    <div>
        <div v-if="loadingAll">
            <span>Carregando...</span>
            <!-- <v-progress-linear color="deep-purple accent-4" indeterminate rounded height="6"></v-progress-linear> -->
            <v-progress-linear indeterminate color="blue" ></v-progress-linear>
        </div>
        <template v-else>
            <v-tabs
                v-if="listaAreas.length > 1"
                style="position: sticky;"
                v-model="tab"
                light
                background-color="#f7f7f7"
                grow
                show-arrows>
                <v-tabs-slider color="teal lighten-4"></v-tabs-slider>
        
                <template>
                    <v-tab v-for="area in listaAreas" :key="area.id">{{area.areaDemandanteRef.descricaoAreaDemandante}}</v-tab>
                </template>
            </v-tabs>
           <v-tabs-items v-model="tab" touchless>
               <v-tab-item v-for="(area) in listaAreas" :key="area.id" eager="true">
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
            return this.loadingListaAreas; 
        }
    },
  data: function() {
    return {
        tab: 0,
        loadingListaAreas: true,
        listaAreas: []
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
        async iniciar(){
            this.getListaAreas();
        }
  },
  created: function(){
      this.iniciar();
  }
}
</script>
