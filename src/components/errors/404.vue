<template>
  <v-card
      class="mx-auto"
      min-height="100%"
      :align="center"
    >
      <v-card-title>
        Página não encontrada!
      </v-card-title>
    </v-card>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "404",
  components: {  },
  computed: {
    ...mapState(["usuario"])
  },
  data: function() {
    return {
    };
  },
  created: function() {
  },
  methods: {
  }
};
</script>

<style lang="css">
</style>

<style scoped>

</style>
