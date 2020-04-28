import Vue from "vue";
import Vuex from "vuex";
import Current from "./current.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    appName: "MRI Vuewer",
    appVersion: "2.0"
  },
  mutations: {},
  actions: {},
  modules: { Current }
});
