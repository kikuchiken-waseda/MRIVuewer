<template>
  <div class="home">
    <div v-if="!$vuetify.breakpoint.smAndDown">
      <h3 class="display-3">{{ name }} ver.{{ version }}</h3>
      <div class="subheading">
        {{ $vuetify.lang.t("$vuetify.home.disc") }}
      </div>
      <v-divider class="my-3"></v-divider>
    </div>
    <div class="title mb-3">
      {{ $vuetify.lang.t("$vuetify.home.upload.title") }}
    </div>
    <m-movie-upload-dialog>
      <template v-slot:activator="{ on }">
        <v-btn class="mx-0" color="blue-grey" dark large v-on="on">
          {{ $vuetify.lang.t("$vuetify.home.upload.btn") }}
        </v-btn>
      </template>
    </m-movie-upload-dialog>
    <div class="caption py-1">
      <v-icon>mdi-information</v-icon>
      {{ $vuetify.lang.t("$vuetify.home.upload.hint") }}
    </div>
    <v-divider class="my-3"></v-divider>

    <div class="title mb-3">
      {{ $vuetify.lang.t("$vuetify.home.demo.title") }}
    </div>
    <v-btn class="mx-0" color="blue-grey" dark large @click="importSampleMovie">
      {{ $vuetify.lang.t("$vuetify.home.demo.btn") }}
    </v-btn>
    <div class="caption">
      <v-icon>mdi-information</v-icon>
      {{ $vuetify.lang.t("$vuetify.home.demo.hint") }}
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import MMovieUploadDialog from "@/components/dialog/MMovieUploadDialog.vue";
import FileUtil from "@/utils/file.js";
export default {
  name: "Home",
  components: {
    MMovieUploadDialog
  },
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
    importSampleMovie: async function() {
      const tag = `${this.$options.name}:importSampleMovie`;
      const url = "https://kikuchiken-waseda.github.io/MRIVuewer/misc/6.mp4";
      const file = await FileUtil.download(url, "sample.mp4", {
        type: "video/mp4"
      });
      const item = {
        dataUrl: await FileUtil.toBase64(file),
        name: "sample.mp4",
        fps: 13.78310345
      };
      console.info(tag, item);
      this.$store.dispatch("current/setMovie", item);
      this.$router.push({ name: "MovieAnnotation" });
    }
  }
};
</script>
