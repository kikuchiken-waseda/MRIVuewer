<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title>{{ name }} ver. {{ version }}</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-app-bar>
</template>

<script>
export default {
  name: "MAppBar",
  props: {
    name: {
      type: String,
      default: "MRI Vuewer"
    },
    version: {
      type: String,
      default: "2.0"
    }
  }
};
</script>
