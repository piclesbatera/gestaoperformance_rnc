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
            <v-data-table :custom-sort="customSort" class="default_color_background" :headers="headers" :items="listaObservacoesHistory" :search="search" loading-text="Carregando..." no-data-text="Sem dados disponíveis">
            </v-data-table>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
</v-dialog>
</template>

<script>
import { baseApi, showError } from "@/global";
import axios from "axios";
export default {
  name: "observacoesHistory_modalView",
  props: {
     value: Boolean
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
          text: 'Usuário', value: 'username',
        },
        { text: 'Observações', value: 'comments' },
        { text: 'Data Alteração', value: 'changeDate' }
        ],
        listaObservacoesHistory: [
          {
            username: 'Usuário 1',
            comments: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi leo nisl, mollis eget placerat placerat, semper at libero. Maecenas commodo massa at felis pharetra viverra. Sed aliquam diam ut dolor consectetur bibendum. Vivamus et mauris scelerisque, ultricies velit sit amet, commodo velit. Fusce tristique justo a justo hendrerit vestibulum eget vitae dolor. Maecenas sagittis mollis interdum. Sed gravida dui enim, eget sodales nunc rhoncus in. Integer sed hendrerit urna, in lacinia risus. Ut suscipit elit vitae luctus sodales. Aenean eu magna a nisi commodo pulvinar at id mauris. Donec fermentum eros sit amet mi vestibulum ultricies. Nullam vel est nibh. Mauris facilisis lobortis arcu nec finibus. Praesent lobortis massa tortor, eu congue enim facilisis ut. Mauris et quam at nisl egestas finibus. Pellentesque ultrices pulvinar purus. Pellentesque ligula nunc, commodo in nunc a, sodales ultricies leo. Mauris ullamcorper libero dolor, et eleifend enim sollicitudin et. Phasellus ultrices dapibus nisi ut varius. Nulla eget eleifend nisl. Cras ornare ultrices vulputate. Duis dui mi, efficitur sit amet hendrerit a, suscipit vitae purus. Aliquam id lorem in quam consequat bibendum et vitae leo. Nunc tincidunt mauris nec venenatis aliquam. Curabitur aliquam pretium vehicula. Suspendisse elementum elementum porttitor. Maecenas a imperdiet odio. Vivamus vehicula metus vulputate erat dapibus convallis. Sed pellentesque pharetra malesuada. Sed eu vestibulum massa. In rutrum dolor quam, eget auctor risus blandit tempor. Proin at ante at purus mattis suscipit. Proin tristique nibh sed venenatis varius. Ut leo metus, iaculis sit amet consequat ac, viverra eleifend nisl. In tellus leo, mollis non ultricies nec, suscipit in felis. Praesent sollicitudin, lacus ut semper tempus, quam nulla ornare elit, a consequat metus nibh non quam. Donec eget libero auctor odio vestibulum gravida non at dui. Mauris eu fringilla quam, eu auctor odio. Nam consectetur condimentum scelerisque. Donec condimentum cursus ligula, quis gravida lorem dapibus vel. Suspendisse nisl massa, scelerisque eu pretium sed, finibus sed tellus. Aenean consequat id eros in tempus. Phasellus laoreet suscipit urna nec vestibulum.",
            changeDate: '25/11/2020 14:46:20'
          },
          {
            username: 'Usuário 2',
            comments: 'Sed malesuada eleifend risus, nec elementum quam congue egestas. Pellentesque bibendum justo quis lobortis sagittis. Etiam magna tortor, condimentum id vehicula non, dictum non purus. Maecenas ut dui tellus. Fusce accumsan iaculis nulla.',
            changeDate: '26/11/2020 14:41:20'
          }
        ],
        search: ""
    }
  },
  methods: {
    customSort(items, index, isDesc) {
      items.sort((a, b) => {
        if (index[0] === "Data_Inclusao") {
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
    },
    getObservacoesHistory(){

      var queryString = ``;
      var url = `${baseApi}/rnc/observacoesHistory/${this.id}${queryString}`;
      
      axios.get(url).then(res => {
          var listaObservacoesHistory = res.data;
          listaObservacoesHistory.forEach( 
          (item) => 
          {
            item['changeDate'] = this.dateTimeIsoToStringReadable(item['Data_Inclusao']);
          }
          );
          this.listaObservacoesHistory = res.data;
      }).catch(error => {
          showError(error);
      });
    }
  },
  created: function(){
    // this.getObservacoesHistory();
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