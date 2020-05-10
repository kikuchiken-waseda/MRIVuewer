<template>
  <v-menu bottom v-model="show" left>
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on">
        <v-icon>{{ icon }}</v-icon>
      </v-btn>
    </template>
    <v-card class="mx-auto">
      <v-toolbar color="primary" dark dense>
        <v-toolbar-title>
          {{ $vuetify.lang.t("$vuetify.movieAnnotation.info.title") }}
        </v-toolbar-title>
      </v-toolbar>
      <m-info-list
        title="video stream"
        :items="items.videoStream"
        v-if="items.videoStream"
      />
      <m-info-list
        title="audio stream"
        :items="items.audioStream"
        v-if="items.audioStream"
      />
    </v-card>
  </v-menu>
</template>

<script>
import MInfoList from "@/components/util/MInfoList.vue";
import File from "@/models/file.js";
import VideoStream from "@/models/videoStream.js";
import AudioStream from "@/models/audioStream.js";
export default {
  name: "movie-annotaion-m-info-menu",
  components: {
    MInfoList
  },
  data: () => ({
    debug: false,
    show: false
  }),
  methods: {
    log: function(tag, msg) {
      if (this.debug) {
        console.info(tag, msg);
      }
    }
  },
  computed: {
    items: function() {
      const tag = `${this.$options.name}:computed:items`;
      const id = this.$route.params.id;
      const result = {
        audioStream: [],
        videoStream: []
      };
      if (id) {
        const file = File.find(id);
        console.log(tag, file);
        const v = VideoStream.find(file.videoStream_id);
        if (v) {
          result.videoStream = [
            {
              title: this.$vuetify.lang.t(
                "$vuetify.movieAnnotation.info.videoStream.codec.title"
              ),
              val: `${v.codec_name}, ${v.pix_fmt}`
            },
            {
              title: this.$vuetify.lang.t(
                "$vuetify.movieAnnotation.info.videoStream.bitrate.title"
              ),
              val: `${v.bitrate} kb/s`
            },
            {
              title: this.$vuetify.lang.t(
                "$vuetify.movieAnnotation.info.videoStream.fps.title"
              ),
              val: `${v.fps} fps`
            },
            {
              title: this.$vuetify.lang.t(
                "$vuetify.movieAnnotation.info.videoStream.tbr.title"
              ),
              val: `${v.tbr} tbr`,
              help: this.$vuetify.lang.t(
                "$vuetify.movieAnnotation.info.videoStream.tbr.help"
              )
            },
            {
              title: this.$vuetify.lang.t(
                "$vuetify.movieAnnotation.info.videoStream.tbn.title"
              ),
              val: `${v.tbn} tbn`,
              help: this.$vuetify.lang.t(
                "$vuetify.movieAnnotation.info.videoStream.tbn.help"
              )
            },
            {
              title: this.$vuetify.lang.t(
                "$vuetify.movieAnnotation.info.videoStream.tbc.title"
              ),
              val: `${v.tbc} tbc`,
              help: this.$vuetify.lang.t(
                "$vuetify.movieAnnotation.info.videoStream.tbc.help"
              )
            }
          ];
        }
        const a = AudioStream.find(file.audioStream_id);
        this.log(tag + ":audioStream", a);
        if (a) {
          result.audioStream = [
            {
              title: this.$vuetify.lang.t(
                "$vuetify.movieAnnotation.info.audioStream.codec.title"
              ),
              val: a.codec_name
            },
            {
              title: this.$vuetify.lang.t(
                "$vuetify.movieAnnotation.info.audioStream.bitrate.title"
              ),
              val: `${a.bitrate} kb/s`
            },
            {
              title: this.$vuetify.lang.t(
                "$vuetify.movieAnnotation.info.audioStream.channel_layout.title"
              ),
              val: a.channel_layout
            },
            {
              title: this.$vuetify.lang.t(
                "$vuetify.movieAnnotation.info.audioStream.sample_rate.title"
              ),
              val: `${a.sample_rate} Hz`
            }
          ];
        }
      } else {
        this.log(tag, "no id");
      }
      return result;
    }
  },
  props: {
    icon: {
      type: String,
      default: "mdi-help-circle"
    }
  }
};
</script>
