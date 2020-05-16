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
      <v-container v-if="debug">
        <pre>{{ video }}</pre>
      </v-container>
    </template>
  </m-base-form-dialog>
</template>

<script>
import File from "@/models/file.js";
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
    debug: false,
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
    log: function(tag, msg) {
      if (this.debug) {
        console.info(tag, msg);
      }
    },
    onValid: function() {
      const tag = `${this.$options.name}:onValid`;
      const frameRate = 1 / this.video.fps;
      let time = 0;
      const frames = [];
      for (let step = 0; time <= this.video.duration; step++) {
        time = step * frameRate;
        frames.push({
          time: time,
          text: `frame_${step}`
        });
      }
      const item = {
        name: this.video.name,
        fileSize: this.video.file.size,
        fileType: this.video.file.type,
        fps: this.video.fps,
        frameRate: frameRate,
        dataUrl: this.video.dataUrl,
        lastModifiedDate: this.video.file.lastModifiedDate,
        duration: this.video.duration,
        audioStream: this.video.audioStream,
        videoStream: this.video.videoStream,
        size: {
          width: this.video.size.width,
          height: this.video.size.height
        }
      };
      item.tiers = [
        {
          name: "Interval",
          tierType: "interval",
          items: [{ time: 0, text: "" }]
        },
        {
          name: "Frame",
          tierType: "point",
          items: frames
        }
      ];
      File.$create({ data: item }).then(() => {
        const file = File.query().last();
        this.log(tag + ":insertedItem", file);
        this.$refs.form.reset();
        this.$router.push({ name: "MovieAnnotation", params: { id: file.id } });
      });
    }
  },
  async mounted() {
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
    await File.$fetch();
  }
};
</script>
