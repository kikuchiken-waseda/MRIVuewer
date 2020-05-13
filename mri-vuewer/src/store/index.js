import Vue from "vue";
import Vuex from "vuex";
import VuexORM from "@vuex-orm/core";
import VuexORMLocalForage from "vuex-orm-localforage";

import File from "@/models/file.js";
import AudioStream from "@/models/audioStream.js";
import VideoStream from "@/models/videoStream.js";
import VideoSize from "@/models/videoSize.js";

import { current } from "./current.js";

const database = new VuexORM.Database();
database.register(File);
database.register(AudioStream);
database.register(VideoStream);
database.register(VideoSize);

VuexORM.use(VuexORMLocalForage, {
  database,
  localforage: {
    name: process.env.VUE_APP_LOCAlFORAGE_NAME,
    version: process.env.VUE_APP_LOCAlFORAGE_VERSION
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
