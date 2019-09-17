<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn :color="btn.color" @click="run" v-on="on" :icon="is_icon_only">
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
      type: Object,
      required: true
    }
  },
  methods: {
    run: function() {
      if (this.func) {
        this.func();
      }
    }
  },
  computed: {
    func: function() {
      return this.btn.func;
    },
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
