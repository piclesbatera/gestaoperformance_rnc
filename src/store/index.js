import axios from "axios";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    usuario: null,
    nevoaVisivel: false,
    nevoa: false
  },
  mutations: {
    setUsuario(state, usuario) {
      if (usuario) {
        state.usuario = usuario;
        state.isMenuVisivel = true;
        axios.defaults.headers.common["Authorization"] = `bearer ${usuario.token}`;
      } else {
        state.usuario = null;
        delete axios.defaults.headers.common["Authorization"];
        state.isMenuVisivel = false;
      }
    },
    setPerfilUsuario(state, perfilUsuario) {
      if(state.usuario){
        state.usuario['perfilUsuario'] = perfilUsuario;
      }
    },
    setNevoaVisivel(state, nevoaVisivel){
      state.nevoaVisivel = nevoaVisivel;
    },
    setNevoa(state, nevoa){
      state.nevoa = nevoa;
    }
  },
  actions: {},
  modules: {}
});
