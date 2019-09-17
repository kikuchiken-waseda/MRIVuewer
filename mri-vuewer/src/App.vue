<template>
  <v-app>
    <v-app-bar app color="blue-grey darken-2" dark>
      <v-toolbar-title class="headline text-uppercase">
        <span>MRI</span>
        <span class="font-weight-light">Vuewer</span>
        <span class="font-weight-light">ver.{{ version }}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        text
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
        <span class="mr-2">Latest Release</span>
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view />
    </v-content>
    <m-snackbar />
  </v-app>
</template>

<script>
import MSnackbar from "@/components/widgets/m-snackbar.vue";
export default {
  name: "App",
  components: {
    MSnackbar
  },
  data: () => ({
    version: "2.0"
  })
};
</script>
