<template>
  <v-toolbar dark color="secondary" dense>
    <v-app-bar-nav-icon></v-app-bar-nav-icon>
    <v-toolbar-title>
      {{ fileName }}
    </v-toolbar-title>
    <v-spacer />
    <m-info-menu />
    <v-btn icon>
      <v-icon>mdi-cog</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon>mdi-dots-vertical</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
import MInfoMenu from "@/components/MovieAnnotaion/MInfoMenu.vue";
export default {
  name: "movie-annotaion-tool-bar",
  components: {
    MInfoMenu
  },
  computed: {
    fileName: {
      get: function() {
        return this.$store.state.current.name;
      },
      set: function(val) {
        this.$store.dispatch("current/setName", val);
      }
    }
  }
};
</script>

<style scoped></style>
