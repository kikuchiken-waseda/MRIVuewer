<template>
  <v-toolbar dark color="secondary" dense>
    <v-toolbar-title>
      {{ fileName }}
    </v-toolbar-title>
    <v-spacer />
    <m-info-menu />
    <m-setting-menu :ws="ws" v-on:updateFiler="onUpdateFiler" />
    <v-btn icon>
      <v-icon>mdi-dots-vertical</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
import MInfoMenu from "@/components/MovieAnnotaion/MInfoMenu.vue";
import MSettingMenu from "@/components/MovieAnnotaion/MSettingMenu.vue";
export default {
  name: "movie-annotaion-tool-bar",
  components: {
    MInfoMenu,
    MSettingMenu
  },
  props: {
    ws: Object
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
  },
  methods: {
    onUpdateFiler: function(payload) {
      this.$emit("updateFiler", payload);
    }
  }
};
</script>

<style scoped></style>
