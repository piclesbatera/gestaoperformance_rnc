import axios from "axios";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    mistVisible: false,
    mist: false
  },
  mutations: {
    setUser(state, user) {
      if (user) {
        state.user = user;
        state.isMenuVisible = true;
        axios.defaults.headers.common["Authorization"] = `bearer ${user.token}`;
      } else {
        state.user = null;
        delete axios.defaults.headers.common["Authorization"];
        state.isMenuVisible = false;
      }
    },
    setUserProfile(state, userProfile) {
      if(state.user){
        state.user['userProfile'] = userProfile;
        console.log(state.user.userProfile);
      }
    },
    setMistVisible(state, mistVisible){
      state.mistVisible = mistVisible;
    },
    setMist(state, mist){
      state.mist = mist;
    }
  },
  actions: {},
  modules: {}
});
