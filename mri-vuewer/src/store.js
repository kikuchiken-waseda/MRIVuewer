import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    snackbar: {
      text: "",
      color: "error",
      show: false
    }
  },
  mutations: {
    setSnackbar(state, val) {
      state.snackbar.show = val;
    },
    setSnackbarText(state, val) {
      state.snackbar.text = val.toUpperCase();
    },
    setSnackbarColor(state, val) {
      state.snackbar.color = val;
    }
  },
  actions: {
    show_error(context, text) {
      context.commit("setSnackbarText", text);
      context.commit("setSnackbarColor", "red darken-4");
      context.commit("setSnackbar", true);
    },
    show_warn(context, text) {
      context.commit("setSnackbarText", text);
      context.commit("setSnackbarColor", "amber darken-4");
      context.commit("setSnackbar", true);
    },
    show_info(context, text) {
      context.commit("setSnackbarText", text);
      context.commit("setSnackbarColor", "blue-grey darken-4");
      context.commit("setSnackbar", true);
    },
    show_success(context, text) {
      context.commit("setSnackbarText", text);
      context.commit("setSnackbarColor", "teal darken-4");
      context.commit("setSnackbar", true);
    }
  }
});
