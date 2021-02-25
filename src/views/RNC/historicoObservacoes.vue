<template>
<!-- INICIA RNC MODAL FORM -->
<v-dialog v-model="show" >
  <v-layout justify-center>
      <v-flex>
        <v-toolbar color="blue" dark>
            <v-toolbar-title>Histórico de observações</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn class="ma-2" icon @click.stop="show=false" title="Fechar" >
                <v-icon>fa fa-times</v-icon>
            </v-btn>
        </v-toolbar>
        
        <v-card>
          <v-container fluid grid-list-md>
            <v-card-title>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Pesquisa" single-line hide-details></v-text-field>
            </v-card-title>
            <v-divider></v-divider>
            <v-data-table :custom-sort="customSort" class="default_color_background" :headers="headers" :items="listaObservacoes" :search="search" loading-text="Carregando..." no-data-text="Sem dados disponíveis" no-results-text="Não foi encontrado dados para a pesquisa realizada">
            </v-data-table>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
</v-dialog>
</template>

<script>
export default {
  name: "historicoObservacoes",
  props: {
     value: Boolean,
     listaObservacoes: Array
  },
  computed: {
    show: {
      get () {
        return this.value
      },
      set (value) {
         this.$emit('input', value);
      }
    }
  },
  data: function() {
    return {
      headers: [
          {
            text: 'Usuário', value: 'usuarioCriadorRef.login',
          },
          { text: 'Observações', value: 'descricaoObservacao' },
          { text: 'Data Alteração', value: 'dataCriacao' }
        ],
        search: ""
    }
  },
  methods: {
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
  created: function(){
  },
  filters: {
  }
}
</script>


<style scoped>
hr{
    margin-top: 5px;
    margin-bottom: 5px;
}


</style>