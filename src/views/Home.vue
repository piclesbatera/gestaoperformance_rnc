<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/img/logo.png" /> -->
  </div>
</template>

<script>

export default {
  name: "Home",
  created: function() {
    this.$router.push({ path: "/perfil" });
  }
};
</script>
