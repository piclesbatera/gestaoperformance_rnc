<template>
    <v-app id="vuetify-menu-content" >
        <v-card>
          <v-tabs
              dark
              background-color="indigo"
              show-arrows>
              <v-tabs-slider color="teal lighten-4"></v-tabs-slider>
      
              <v-tab to="/" style="display:none;">Home</v-tab>
              <v-tab to="/gestaoPerformance">Gestão de Performance</v-tab>
              <v-tab to="/rnc">RNC</v-tab>
          </v-tabs>
        </v-card>
    </v-app>
</template>

<script>
export default {
   name: "menu",
   data: function() {
    return {
    };
  }
};
</script>

<style>
#vuetify-menu-content{
  max-width: 100%;
  background-color: #f7f7f7;
}
#vuetify-menu-content div.v-application--wrap {
  min-height: 100%;
}

</style>