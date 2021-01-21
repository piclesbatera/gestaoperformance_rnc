<template>
    <div v-if="ativo" :class="nevoaClass">

    </div>
</template>

<script>
export default {
    name: "nevoa",
    components: {
    },
    props: {
        visivel: {
            type: Boolean,
            default: false
        },
        ativo: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        nevoaClass: function(){
            return (this.visivel) ? "nevoa-visivel" : "nevoa-invisivel";
        }
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
