<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn :color="btn.color" v-on="on" :icon="is_icon_only">
        {{ btn.label }}
        <v-icon v-if="btn.icon">{{ btn.icon }}</v-icon>
      </v-btn>
    </template>
    <span> {{ btn.caption }}</span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    btn: {
      type: Object
    }
  },
  computed: {
    is_icon_only: function() {
      if (this.btn.icon) {
        if (!this.btn.label) {
          return true;
        }
      }
      return false;
    }
  }
};
</script>
