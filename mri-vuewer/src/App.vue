<template>
  <v-app>
    <m-app-bar />
    <v-content>
      <m-side-bar />
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import MAppBar from "@/components/MAppBar.vue";
import MSideBar from "@/components/MSideBar.vue";
export default {
  name: "App",
  components: { MAppBar, MSideBar },
  data: () => ({
    //
  }),
  mounted: function() {
    const lang = navigator.language;
    if (lang == "ja") {
      this.$vuetify.lang.current = "ja";
    } else if (~lang.indexOf("zh")) {
      this.$vuetify.lang.current = "zhHans";
    } else {
      this.$vuetify.lang.current = "en";
    }
    console.log();
  }
};
</script>
