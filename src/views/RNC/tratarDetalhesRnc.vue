<template>
    <div>
        <div v-if="loadingListaRNCs">
            <span>Carregando...</span>
            <!-- <v-progress-linear color="deep-purple accent-4" indeterminate rounded height="6"></v-progress-linear> -->
            <v-progress-linear indeterminate color="blue" ></v-progress-linear>
        </div>
        <template v-else>
            <ListagemRnc :listaRNCs="detalhes.listaRNCs" :crudType="crudType" :isLeitura="isLeitura" :registro="registro"/>
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
        infosRegistro : Object,
        isLeitura: Boolean,
        registro: Object
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
        loadingListaRNCs: true
    }
  },
  methods: {
        getListaRNCs(){
            var sg = this.infosRegistro['sg'];
            var codigoSg = this.infosRegistro['codigoSg'];
            var codigoGrupoFila = this.infosRegistro['codigoGrupoFila'];
            var queryString = (codigoGrupoFila) ? `?tipoAcionamento=${codigoGrupoFila}` : "";
            var url = `${baseApi}/rnc/rncs/${sg}/${codigoSg}${queryString}`;

            axios.get(url).then(res => {
                var detalhes = {}

                detalhes['listaRNCs'] = res.data;

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

            }).catch(error => {
                showError(error);
            })
            .finally(() => {
                this.loadingListaRNCs = false;
            });
        },
        async iniciar(){
            this.getListaRNCs();
        }
  },
  created: function(){
      this.iniciar();
  }
}
</script>
