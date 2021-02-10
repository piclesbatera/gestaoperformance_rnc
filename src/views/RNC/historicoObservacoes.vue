<template>
<!-- INICIA RNC MODAL FORM -->
<v-dialog v-model="show" content-class="container dialog" >
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
.default_color_background{
  background-color: #f7f7f7;
}

.col, .col-1, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9, .col-10, .col-11, .col-12, .col-auto, .col-lg, .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg-auto, .col-md, .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12, .col-md-auto, .col-sm, .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm-auto, .col-xl, .col-xl-1, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, .col-xl-9, .col-xl-10, .col-xl-11, .col-xl-12, .col-xl-auto {
    padding: 3px 12px;
}
hr{
    margin-top: 5px;
    margin-bottom: 5px;
}


.openDetail{
    cursor: pointer;
    font-size: x-large;
    color: #0d00ffa8;
} 

</style>