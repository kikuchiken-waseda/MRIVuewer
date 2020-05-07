import Vue from "vue";
import Vuetify from "vuetify/lib";
import colors from "vuetify/lib/util/colors";
import ja from "@/locales/ja.ts";
import en from "@/locales/en.ts";
import zhHans from "@/locales/zh-Hans.ts";

Vue.use(Vuetify);
export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: colors.blueGrey,
        secondary: colors.blueGrey.darken3,
        accent: colors.deepOrange
      },
      dark: {
        primary: colors.blueGrey.lighten3
      }
    }
  },
  lang: {
    locales: { ja, en, zhHans },
    current: "zhHans"
  }
});
