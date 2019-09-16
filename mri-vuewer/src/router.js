import Vue from "vue";
import Router from "vue-router";
import Home from "./components/Home.vue";
import Vuewer from "./components/Vuewer/Vuewer.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/:id",
      name: "vuewer",
      component: Vuewer
    }
  ]
});
