<template>
  <v-app-bar app color="blue-grey" dark>
    <v-toolbar-title>{{ name }} ver. {{ version }}</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-app-bar>
</template>

<script>
export default {
  name: "MAppBar",
  computed: {
    name: {
      get() {
        return this.$store.state.appName;
      }
    },
    version: {
      get() {
        return this.$store.state.appVersion;
      }
    }
  }
};
</script>
