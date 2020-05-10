import Vue from "vue";
import Vuex from "vuex";
// import VuexPersistence from "vuex-persist";
import VuexORM from "@vuex-orm/core";
// import createPersistedState from "vuex-persistedstate";

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

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    appName: "MRI Vuewer",
    appVersion: "2.0"
  },
  mutations: {},
  actions: {},
  modules: { current },
  plugins: [
    VuexORM.install(database)
    //createPersistedState()
  ]
});
