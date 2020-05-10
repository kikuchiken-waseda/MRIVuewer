<template>
  <m-base-form-dialog
    ref="form"
    title="Movie Upload"
    @valid="onValid"
    :isloading="video.loading"
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
        <m-movie-input v-model="video" />
        <v-text-field
          :label="
            `${$vuetify.lang.t('$vuetify.movieUploadDialog.name.title')}*`
          "
          v-model="video.name"
          :counter="nameMaxSize"
          :rules="nameRules"
          :disabled="video.loading"
          prepend-icon="mdi-movie"
          :hint="$vuetify.lang.t('$vuetify.movieUploadDialog.name.hint')"
          required
        />
        <v-text-field
          :label="`${$vuetify.lang.t('$vuetify.movieUploadDialog.fps.title')}*`"
          v-model="video.fps"
          :rules="fpsRules"
          :disabled="video.loading"
          :hint="$vuetify.lang.t('$vuetify.movieUploadDialog.fps.hint')"
          prepend-icon="mdi-movie-edit"
          required
        />
      </v-container>
    </template>
  </m-base-form-dialog>
</template>

<script>
import MBaseFormDialog from "./MBaseFormDialog.vue";
import MMovieInput from "../form/MMovieInput.vue";
const nameMaxSize = 30;

export default {
  name: "MMovieUploadDialog",
  components: {
    MBaseFormDialog,
    MMovieInput
  },
  data: () => ({
    dialog: false,
    video: {
      loading: false,
      name: null,
      fps: 0
    },
    nameMaxSize: nameMaxSize,
    nameRules: null,
    fpsRules: null
  }),
  methods: {
    onValid: function() {
      const tag = `${this.$options.name}:onValid`;
      const item = this.video;
      item.lastModifiedDate = this.video.file.lastModifiedDate;
      item.fileType = this.video.file.type;
      item.fileSize = this.video.file.size;
      console.info(tag + ":setItem", item);
      this.$store.dispatch("current/setItem", item);
      this.$refs.form.reset();
      if (this.$route.name != "MovieAnnotation") {
        this.$router.push({ name: "MovieAnnotation" });
      }
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
