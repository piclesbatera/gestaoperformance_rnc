<template>
  <footer class="footer">
    <span>Sistema desenvolvido por <strong>Beijaflore</strong>.</span>
  </footer>
</template>

<script>
export default {
  name: "Footer"
};
</script>

<style scoped>
.footer {
  grid-area: footer;
  background: #ddd;
  color: #333;

  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 15px;
}
</style>
