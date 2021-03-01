<template>
  <v-dialog v-model="show" v-if="show" scrollable transition="dialog-bottom-transition" >
    <v-card tile>
        <v-toolbar flat dark color="blue" >
            <v-toolbar-title>Análise RNC: {{rnc.id}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="show = false" >
            <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-toolbar>
        <v-toolbar flat dense color="transparent" >
            <v-toolbar-title>{{rnc.registroObra.descricaoTituloSg}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-select
              v-model="penalizar"
              :items="penalizarOptions"
              hide-details
            ></v-select>
            <v-btn @click="Enviar()" class="ml-2 btn btn-primary"  color="blue" >
                <v-icon dark left>
                    mdi-file-send
                </v-icon>
                Enviar
            </v-btn>
        </v-toolbar>
        
        <v-card-text>
          <DetalhesTabsRnc :rnc="rnc" :registro="rnc.registroObra" :tipos="tiposRnc" :crudType="'c'" isLeitura />
        </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";
import DetalhesTabsRnc from '../RNC/detalhesTabsRnc'
import axios from "axios";
import { baseApi, showError } from "@/global";
import tiposRnc from "@/assets/json/rnc/tipos.json";
export default {
  name: "modalAnaliseRnc",
  computed: {
    ...mapState(["usuario"]),
    show: {
        get () {
          return Boolean(this.value && this.rnc);
        },
        set (value) {
          this.$emit('input', value);
        }
    },
  },
  components: {
    DetalhesTabsRnc
  },
  props: {
    value: Boolean,
    loadingRNC: Boolean,
    registroRnc: Object,
  },
  data: function() {
    return {
        penalizar: 0,
        penalizarOptions: [
          { "value": 0, "text": "Não penalizar RNC"},
          { "value": 1, "text": "Penalizar RNC em " + this.registroRnc.penalizacaoPorcentagem }
        ],
        rnc: null,
        motivos: [
            { "value": null, "text": "Selecione um motivo" }
        ],
        tiposRnc
    };
  },
  created: function() {
    this.iniciar();
  },
  methods: {
    async iniciar(){
      this.getRNC();
    },
    getRNC(){
            var id = this.registroRnc.id

            this.$emit('loadingRNC', true);

            var queryString = "";
            var url = `${baseApi}/rnc/${id}${queryString}`;

            axios.get(url).then(res => {
                var rnc = {}

                rnc = res.data;

                this.rnc = rnc;

            }).catch(error => {
                showError(error);
            })
            .finally(() => {
                this.$emit('loadingRNC', false);
            });
        }
  },
  watch: {
  }
};
</script>

<style scoped>
</style>
