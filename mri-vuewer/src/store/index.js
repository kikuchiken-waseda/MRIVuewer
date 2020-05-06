import Vue from "vue";
import Vuex from "vuex";
// import VuexPersistence from "vuex-persist";
import { current } from "./current.js";

// const vuexLocal = new VuexPersistence({
//   storage: window.localStorage
// });

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    appName: "MRI Vuewer",
    appVersion: "2.0"
  },
  mutations: {},
  actions: {},
  modules: { current }
  // plugins: [vuexLocal.plugin]
});
