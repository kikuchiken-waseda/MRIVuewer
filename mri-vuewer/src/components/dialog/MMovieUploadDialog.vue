<template>
  <m-base-form-dialog ref="form" title="Movie Upload" @valid="onValid">
    <template v-slot:activator="{ on }">
      <slot name="activator" v-bind:on="on">
        <v-btn color="primary" dark v-on="on">Open Dialog</v-btn>
      </slot>
    </template>
    <template v-slot:form>
      <v-container>
        <v-file-input
          label="Movie*"
          v-model="file"
          hint="mp4 or webm or ogv"
          prepend-icon="mdi-file-video"
          accept="video/*"
          show-size
          required
          @change="onChangeFileInput"
        />
        <v-text-field
          label="Name*"
          v-model="name"
          :counter="nameMaxSize"
          :rules="nameRules"
          prepend-icon="mdi-movie"
          hint="動画識別用の名前です"
          required
        />
        <v-text-field
          label="FPS*"
          v-model="fps"
          :rules="fpsRules"
          hint="動画のFPSを指定してください"
          prepend-icon="mdi-movie-edit"
          required
        />
      </v-container>
    </template>
  </m-base-form-dialog>
</template>

<script>
import MBaseFormDialog from "./MBaseFormDialog.vue";
const nameMaxSize = 30;
const toBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

export default {
  name: "MMovieUploadDialog",
  components: {
    MBaseFormDialog
  },
  data: () => ({
    dialog: false,
    file: null,
    fileText: null,
    name: null,
    nameMaxSize: nameMaxSize,
    nameRules: [
      v => !!v || "Name is required",
      v =>
        (v && v.length <= nameMaxSize) ||
        `Name must be less than ${nameMaxSize} characters`
    ],
    fps: 0,
    fpsRules: [
      v => !!v || "fps is required",
      v => {
        const regex = /^([1-9]\d*|0)(\.\d+)?$/;
        if (v) {
          if (!regex.test(v)) {
            return "Fps is number";
          }
          return true;
        }
        return "fps is required";
      }
    ]
  }),
  methods: {
    onChangeFileInput: function(e) {
      const tag = `${this.$options.name}:onChangeFileInput`;
      if (!this.name && e) {
        this.name = e.name;
        console.log(tag, e);
      }
    },
    onValid: async function() {
      const tag = `${this.$options.name}:onValid`;
      const item = {
        file: await toBase64(this.file),
        name: this.name,
        fps: Number(this.fps)
      };
      console.info(tag, item);
      this.$refs.form.reset();
    }
  }
};
</script>
