<template>
  <v-toolbar dark color="secondary" dense>
    <v-toolbar-title>
      {{ fileName }}
    </v-toolbar-title>
    <v-spacer />
    <m-info-menu />
    <slot name="setting"></slot>
    <v-menu left bottom>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <m-func-list title="メニュー" :items="menuFuncs" />
    </v-menu>
  </v-toolbar>
</template>

<script>
import MInfoMenu from "@/components/MovieAnnotaion/MInfoMenu.vue";
import MFuncList from "@/components/util/MFuncList.vue";
export default {
  name: "movie-annotaion-tool-bar",
  components: {
    MInfoMenu,
    MFuncList
  },
  props: {
    fileName: {
      type: String
    },
    menuFuncs: {
      type: Array
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
