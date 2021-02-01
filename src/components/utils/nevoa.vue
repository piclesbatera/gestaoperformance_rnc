<template>
    <v-overlay v-if="nevoa.visivel" :value="nevoa.ativo" z-index="999">
        <v-progress-circular
          indeterminate
          size="64"
        ></v-progress-circular>
    </v-overlay>
    <div v-else-if="nevoa.ativo" class="nevoa">

    </div>
</template>

<script>
import { mapState } from "vuex";
export default {
    name: "nevoa",
    components: {
    },
    props: {
    },
    computed: {
        ...mapState(["nevoa"])
    },
  data: function() {
      return {
      }
  },
  methods: {
  },
  created: function(){
  }
}
</script>
