import Vue from "vue";
import toasted from "vue-toasted";

Vue.use(toasted, {
  iconPack: "fontawesome",
  duration: 3000
});

Vue.toasted.register(
  "defaultSuccess",
  payload => (!payload.msg ? "operação realizada com sucesso!" : payload.msg),
  {
    type: "success",
    icon: "check"
  }
);

Vue.toasted.register(
  "defaultError",
  payload => (!payload.msg ? "Oops.. Erro inesperado" : payload.msg),
  {
    type: "error",
    icon: "times"
  }
);
