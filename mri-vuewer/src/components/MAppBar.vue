<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title>{{ name }} ver. {{ version }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click="to({ name: 'Home' })">
      <v-icon>mdi-home</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: "MAppBar",
  data: () => ({
    debug: false
  }),
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
    log: function(tag, msg) {
      if (this.debug) {
        console.info(tag, msg);
      }
    },
    to: function(payload) {
      const tag = `${this.$options.name}:to`;
      this.log(tag, payload);
      this.$router.push(payload);
    }
  }
};
</script>
