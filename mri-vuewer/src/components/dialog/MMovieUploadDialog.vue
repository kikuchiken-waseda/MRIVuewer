<template>
  <m-base-form-dialog
    ref="form"
    title="Movie Upload"
    @valid="onValid"
    :loading="isRunOnValid"
  >
    <template v-slot:activator="{ on }">
      <slot name="activator" v-bind:on="on">
        <v-btn color="primary" dark v-on="on">
          {{ $vuetify.lang.t("$vuetify.baseFromDialog.save") }}
        </v-btn>
      </slot>
    </template>
    <template v-slot:form>
      <v-container>
        <v-file-input
          :label="
            `${$vuetify.lang.t('$vuetify.movieUploadDialog.file.title')}*`
          "
          v-model="file"
          :hint="$vuetify.lang.t('$vuetify.movieUploadDialog.file.hint')"
          prepend-icon="mdi-file-video"
          accept="video/*"
          show-size
          required
          @change="onChangeFileInput"
        />
        <v-text-field
          :label="
            `${$vuetify.lang.t('$vuetify.movieUploadDialog.name.title')}*`
          "
          v-model="name"
          :counter="nameMaxSize"
          :rules="nameRules"
          prepend-icon="mdi-movie"
          :hint="$vuetify.lang.t('$vuetify.movieUploadDialog.name.hint')"
          required
        />
        <v-text-field
          :label="`${$vuetify.lang.t('$vuetify.movieUploadDialog.fps.title')}*`"
          v-model="fps"
          :rules="fpsRules"
          :hint="$vuetify.lang.t('$vuetify.movieUploadDialog.fps.hint')"
          prepend-icon="mdi-movie-edit"
          required
        />
      </v-container>
    </template>
  </m-base-form-dialog>
</template>

<script>
import FileUtil from "@/utils/file.js";
import VideoUtil from "@/utils/video.js";
import MBaseFormDialog from "./MBaseFormDialog.vue";
const nameMaxSize = 30;

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
    nameRules: null,
    fps: 0,
    fpsRules: null,
    stream: null,
    isRunOnValid: false
  }),
  methods: {
    onChangeFileInput: async function(e) {
      const tag = `${this.$options.name}:onChangeFileInput`;
      if (!this.name && e) {
        this.name = e.name;
        const buff = await e.arrayBuffer();
        VideoUtil.info(buff, stream => {
          this.stream = stream;
          if (stream.video) {
            this.fps = stream.video.fps ? stream.video.fps : this.fps;
          }
        });
        console.log(tag, "name: ", this.name, "fps:", this.fps);
      }
    },
    onValid: async function() {
      this.isRunOnValid = true;
      const tag = `${this.$options.name}:onValid`;
      console.log(tag, this.file);
      const dataUrl = await FileUtil.toBase64(this.file);
      const item = {
        name: this.name,
        dataUrl: dataUrl,
        fps: Number(this.fps),
        stream: this.stream
      };
      console.info(tag, item);
      this.isRunOnValid = false;
      this.$store.dispatch("current/setMovie", item);
      this.$refs.form.reset();
      this.$router.push({ name: "MovieAnnotation" });
    }
  },
  mounted: function() {
    this.fpsRules = [
      v => !!v || this.$vuetify.lang.t("$vuetify.validate.required"),
      v => {
        const regex = /^([1-9]\d*|0)(\.\d+)?$/;
        if (v) {
          if (!regex.test(v)) {
            return this.$vuetify.lang.t("$vuetify.validate.isFloat");
          }
          return true;
        }
        return true;
      }
    ];
    this.nameRules = [
      v => !!v || this.$vuetify.lang.t("$vuetify.validate.required"),
      v =>
        (v && v.length < nameMaxSize) ||
        this.$vuetify.lang.t("$vuetify.validate.lessThen", nameMaxSize)
    ];
  }
};
</script>
