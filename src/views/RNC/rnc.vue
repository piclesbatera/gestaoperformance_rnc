<template>
        <div id="vuetify-tab-content">
            <v-card>
                <v-tabs
                    v-model="tab"
                    dark
                    background-color="blue"
                    show-arrows>
                    <v-tabs-slider style="display:none;" color="teal lighten-4"></v-tabs-slider>
                    
                    <v-tab :href="'#tab-dashboard'" >Dashboard</v-tab>
                    
                    <v-menu offset-y v-if="controleRNC.length">
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
                    <v-tab-item v-for="(rnc, index) in controleRNC" :key="index" :value="'tab-'+rnc.id">
                        <v-card flat>
                            <v-card-text>
                                <ControlePage :crudType="rnc.crudType"/>
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
        </div>
</template>

<script>
import ControlePage from "./controlePage";
export default {
   name: "rnc",
   components: { ControlePage },
   data: function() {
    return {
        tab: null,
        controleRNC: [
            {
                id:"criacaoRNC",
                text:'Criação RNC',
                crudType: 'c'
            },
            {
                id:"tratarRNC",
                text:'Tratar RNC',
                crudType: 't'
            },
            {
                id:"validarRNC",
                text:"Validar RNC",
                crudType: 'v'
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
  min-height: 100%;
}

#vuetify-tab-content{
    height: 100%;
    max-width: 100%;
}

#vuetify-tab-content div.v-card.v-sheet div.v-window{
  padding: 10px;
}


</style>