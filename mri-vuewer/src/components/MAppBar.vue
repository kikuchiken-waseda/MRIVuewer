<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title
      >{{ name }} ver. {{ version }}</v-toolbar-title
    >
    <v-spacer></v-spacer>
    <v-btn icon @click="to({ name: 'Home' })">
      <v-icon>mdi-home</v-icon>
    </v-btn>
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
  },
  methods: {
    to: function(payload) {
      const tag = `${this.$options.name}:to`;
      console.info(tag, payload);
      this.$router.push(payload);
    }
  }
};
</script>
