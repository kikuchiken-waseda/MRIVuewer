import Vue from "vue";
import Vuex from "vuex";
import VuexORM from "@vuex-orm/core";
import VuexORMLocalForage from "vuex-orm-localforage";

import File from "@/models/file.js";
import AudioStream from "@/models/audioStream.js";
import VideoStream from "@/models/videoStream.js";
import VideoSize from "@/models/videoSize.js";
import Point from "@/models/point.js";
import Tier from "@/models/tier.js";

import { current } from "./current.js";

const database = new VuexORM.Database();
database.register(Point);
database.register(Tier);
database.register(AudioStream);
database.register(VideoStream);
database.register(VideoSize);
database.register(File);

VuexORM.use(VuexORMLocalForage, {
  database,
  localforage: {
    name: process.env.VUE_APP_LOCAlFORAGE_NAME
  }
});
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    appName: "MRI Vuewer",
    appVersion: "2.0"
  },
  mutations: {},
  actions: {},
  modules: { current },
  plugins: [VuexORM.install(database)]
});
