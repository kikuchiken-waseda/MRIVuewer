<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <slot name="activator" v-bind:on="on">
        <v-btn v-on="on">Open Dialog</v-btn>
      </slot>
    </template>
    <v-card>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-card-title v-if="title">
          <span class="headline">{{ title }}</span>
        </v-card-title>
        <v-card-text>
          <slot name="form"> </slot>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="reset">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="validate">
            Save
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "MBaseFormDialog",
  props: {
    title: {
      type: String
    }
  },
  data: () => ({
    valid: true,
    dialog: false
  }),
  methods: {
    validate() {
      const tag = `${this.$options.name}:validate`;
      this.valid = this.$refs.form.validate();
      if (this.valid) {
        console.info(tag, this.valid);
        this.$emit("valid");
        this.dialog = false;
      } else {
        console.warn(tag, this.valid);
      }
    },
    reset() {
      const tag = `${this.$options.name}:reset`;
      console.info(tag);
      this.$refs.form.reset();
      this.dialog = false;
    },
    resetValidation() {
      const tag = `${this.$options.name}:resetValidation`;
      console.info(tag);
      this.$refs.form.resetValidation();
    }
  }
};
</script>
