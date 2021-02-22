<template>
  <v-dialog v-model="dialog" hide-overlay transition="dialog-bottom-transition" >
    <v-card tile>
      <v-toolbar flat dark color="blue" >
        <v-toolbar-title>Criar RNC</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn dark text @click="dialog = false" >
          Save
        </v-btn>
        <v-btn icon dark @click="dialog = false" >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      
      <v-card-text>
        
      </v-card-text>

    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "gestaoperformance",
  props: {
  },
  computed: {
  },
  data: function() {
    return {
      dialog: true
    }
  },
  methods: {
  },
  created: function(){
  },
  filters: {
  }
}
</script>
