<template>
  <div class="user-icons">
    <!-- <span class="d-none d-sm-block">Olá, {{ user.userProfile.firstName }}</span> -->
    <a title="Alertas"> <i class="fa fa-bell"></i> </a>
    <a title="Usuário"> <i class="fa fa-user"></i> </a>
    <a title="Logout" @click.prevent="logout"> <i class="fa fa-sign-out"></i> </a>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { userKey } from "@/global";
export default {
  name: "UserDropdown",
  computed: mapState(["user"]),
  methods: {
    logout() {
      localStorage.removeItem(userKey);
      this.$store.commit("setUser", null);
      this.$toasted.global.defaultSuccess({
        msg: "Logout efetuado com sucesso!"
      });
      this.$router.push({ name: "Login" });
    }
  }
};
</script>

<style>
.user-icons {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-weight: 100;
  padding: 0px 20px 0px 0px;
  color: #fff;
  position: relative;
}
.user-icons a {
    padding: 0.3rem;
    font-size: 1.5rem;
    cursor: pointer;
}

</style>
