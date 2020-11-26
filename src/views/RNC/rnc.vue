<template>
        <v-app id="vuetify-tab-content">
            <v-card>
                <v-tabs
                    v-model="tab"
                    dark
                    background-color="blue"
                    show-arrows>
                    <v-tabs-slider style="display:none;" color="teal lighten-4"></v-tabs-slider>
                    
                    <v-tab :href="'#tab-dashboard'" >Dashboard</v-tab>
                    
                    <v-menu v-if="controleRNC.length">
                            <template v-slot:activator="{ on, attrs }">
                                <a
                                class="v-tab"
                                v-bind="attrs"
                                v-on="on">
                                    Controle RNC
                                    <v-icon right>
                                        mdi-menu-down
                                    </v-icon>
                                </a>
                            </template>
                
                            <v-list class="grey lighten-3">
                                <v-tab 
                                    v-for="item in controleRNC"
                                    :key="item.id"
                                    :href="'#tab-' + item.id">
                                    <v-list-item>
                                        {{ item.text }}
                                    </v-list-item>
                                </v-tab>
                            </v-list>
                    </v-menu>
                    
                    <v-tab :href="'#tab-empreiteiraRNC'" >Empreitera RNC</v-tab>
                    <v-tab :href="'#tab-relatorios'" >Relatórios</v-tab>

                    

                </v-tabs>
                <v-tabs-items v-model="tab">
                    <!-- DASHBOARD -->
                    <v-tab-item :value="'tab-dashboard'">
                        <v-card flat>
                            <v-card-text>Dashboard</v-card-text>
                        </v-card>
                    </v-tab-item>


                    <!-- CONTROLE RNC -->
                    <v-tab-item :value="'tab-criacaoRNC'">
                        <v-card flat>
                            <v-card-text>
                                <CriarRNC/>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item :value="'tab-editarRNC'">
                        <v-card flat>
                            <v-card-text>
                                <EditarRNC/>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>


                    <!-- EMPREITERA RNC -->
                    <v-tab-item :value="'tab-empreiteiraRNC'">
                        <v-card flat>
                            <v-card-text>Empreitera RNC</v-card-text>
                        </v-card>
                    </v-tab-item>
                    <!-- RELATÓRIOS -->
                    <v-tab-item :value="'tab-relatorios'">
                        <v-card flat>
                            <v-card-text>Relatórios</v-card-text>
                        </v-card>
                    </v-tab-item>
                </v-tabs-items>
            </v-card>
        </v-app>
</template>

<script>
import CriarRNC from "./criarRNC";
import EditarRNC from "./editarRNC";
export default {
   name: "rnc",
   components: { CriarRNC, EditarRNC },
   data: function() {
    return {
        tab: null,
        controleRNC: [
            {
                id:"criacaoRNC",
                text:'Criação RNC'
            },
            {
                id:"editarRNC",
                text:'Editar RNC'
            }
        ]
    };
  },
  methods: {
  }
};
</script>

<style scoped>

#vuetify-tab-content div.v-card.v-sheet{
  background-color: #f7f7f7;
  min-height: 100%;
}

#vuetify-tab-content{
    min-height: 100%;
    max-width: 100%;
    background-color: #f7f7f7;
}

#vuetify-tab-content div.v-card.v-sheet div.v-window{
  background-color: #f7f7f7;
  padding: 10px;
}


</style>

<style>

#vuetify-tab-content div.v-application--wrap {
  min-height: 100%;
}

</style>