<template>
    <div v-if="activated" :class="mistClass">

    </div>
</template>

<script>
export default {
    name: "mist",
    components: {
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        activated: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        mistClass: function(){
            return (this.visible) ? "mist-visible" : "mist-invisible";
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
