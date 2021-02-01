import axios from "axios";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    usuario: null,
    nevoa: {
      ativo: false,
      visivel: false
    }
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
    setNevoa(state, nevoa){
      if(typeof nevoa == 'object'){
        state.nevoa = nevoa;
      } else
      if(typeof nevoa == 'boolean') {
        state.nevoa = {
          ativo: nevoa,
          visivel: false
        }
      }
    }
  },
  actions: {},
  modules: {}
});
