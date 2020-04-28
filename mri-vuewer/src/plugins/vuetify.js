import Vue from "vue";
import Vuetify from "vuetify/lib";
import ja from "@/locales/ja.ts";
import en from "@/locales/en.ts";
import zhHans from "@/locales/zh-Hans.ts";

Vue.use(Vuetify);
export default new Vuetify({
  lang: {
    locales: { ja, en, zhHans },
    current: "zhHans"
  }
});
