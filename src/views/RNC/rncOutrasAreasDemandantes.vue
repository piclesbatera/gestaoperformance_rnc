<template>
    <v-menu offset-y bottom left v-model="isOpened" >
        <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" icon :disabled="registro.outrasAreas <= 0" v-if="registro.outrasAreas >= 0">
                <v-icon v-if="!isOpened">mdi-dots-vertical</v-icon>
                <v-icon v-else>mdi-close</v-icon>
            </v-btn>
        </template>

        <v-list v-if="!outrasAreasDemandantes">
            <v-list-item> 
                <v-list-item-title>
                    Carregando...
                    <v-progress-circular indeterminate color="primary" ></v-progress-circular>
                </v-list-item-title>
            </v-list-item>
        </v-list>
        <v-list v-else>
            <v-list-item link v-for="(areaDemandante, i) in outrasAreasDemandantes" :key="i" @click="clickAreaDemandante(registro, areaDemandante.id)" >
                <v-list-item-title v-text="areaDemandante.descricaoAreaDemandante" ></v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script>
import axios from "axios";
import { baseApi, showError } from "@/global";
export default {
   name: "rncOutrasAreasDemandantes",
   components: {  },
    props: {
        registro: Object,
        clickAreaDemandante: { type: Function }
    },
   data: function() {
    return {
        outrasAreasDemandantes: null,
        solicitado: false,
        isOpened: false
    };
  },
  computed: {
        sg: function(){
            var sg = null;
            if(this.registro && this.registro.detail){
                sg = this.registro.detail;
            }
            return sg;
        },
        codigoGrupoFila: function(){
            var codigoGrupoFila = null;
            if(this.sg == 'sgp' && this.registro.codigoGrupoFila){
                codigoGrupoFila = this.registro.codigoGrupoFila;
            }
            return codigoGrupoFila;
        },
        codigoSg: function(){
            var codigoSg = null;
            if(this.registro){
                if(this.sg == 'sgi'){
                    codigoSg = this.registro.ID;
                } else
                if(this.sg == 'sgp'){
                    codigoSg = this.registro.GL;
                }
            }
            return codigoSg;
        }
  },
  methods: {
        recuperaOutrasAreasDemandantes(){
            if(!this.outrasAreasDemandantes && !this.solicitado){
                this.solicitado = true;
                var queryString = (this.codigoGrupoFila) ? `?codigoGrupoFila=${this.codigoGrupoFila}` : '';
                var url = `${baseApi}/rnc/outrasAreasDemandantes/${this.sg}/${this.codigoSg}${queryString}`;
                axios.get(url).then(res => {
                    this.outrasAreasDemandantes = res.data;
                })
                .catch(error => {
                    this.outrasAreasDemandantes = null;
                    this.solicitado = false;
                    showError(error);
                });
            }
    }
  },
  watch: {
      isOpened(isOpened){
          if(isOpened){
              this.recuperaOutrasAreasDemandantes();
          }
      }
  }
};
</script>

<style scoped>


</style>