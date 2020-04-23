<template>
  <v-snackbar
    multi-line
    bottom
    right
    v-model="snackbar"
    :timeout="10000"
    :color="color"
  >
    {{ text }}
    <v-btn dark text @click="snackbar = false">
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  computed: {
    snackbar: {
      get() {
        return this.$store.state.snackbar.show;
      },
      set(val) {
        this.$store.commit("setSnackbar", val);
      }
    },
    color: {
      get() {
        return this.$store.state.snackbar.color;
      },
      set(val) {
        this.$store.commit("setSnackbarColor", val);
      }
    },
    text: {
      get() {
        return this.$store.state.snackbar.text;
      },
      set(val) {
        this.$store.commit("setSnackbarText", val);
      }
    }
  }
};
</script>

<style scoped></style>
