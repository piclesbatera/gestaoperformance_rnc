<template>
  <div class="content">
    <Menu />
    <div class="containerPage">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Menu from "./Menu";
export default {
  name: "Content",
  components: { Menu }
};
</script>

<style>
.content { 
  grid-area: content;
  padding: 10px;
  background-color: #f7f7f7;
}
</style>
