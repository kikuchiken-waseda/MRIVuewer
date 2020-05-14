import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";
import About from "@/views/About.vue";
import Config from "@/views/Config.vue";
import MovieAnnotation from "@/views/MovieAnnotation.vue";
import ImageAnnotation from "@/views/ImageAnnotation.vue";
import ComponentDebug from "@/views/ComponentDebug.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/about",
    name: "About",
    component: About
  },
  {
    path: "/config",
    name: "Config",
    component: Config
  },
  {
    path: "/movies/:id",
    name: "MovieAnnotation",
    component: MovieAnnotation,
    props: true
  },
  {
    path: "/movies/:id",
    name: "ImageAnnotation",
    component: ImageAnnotation,
    props: true
  },
  {
    path: "/debug/",
    name: "ComponentDebug",
    component: ComponentDebug,
    props: true
  },
  {
    path: "*",
    redirect: { path: "/" }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
