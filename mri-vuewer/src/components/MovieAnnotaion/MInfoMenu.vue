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
          {{
            $vuetify.lang.t(
              "$vuetify.movieAnnotation.info.title"
            )
          }}
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
export default {
  name: "movie-annotaion-m-info-menu",
  components: {
    MInfoList
  },
  data: () => ({
    show: false
  }),
  computed: {
    items: function() {
      const v = this.$store.state.current.videoStream;
      const a = this.$store.state.current.audioStream;
      return {
        videoStream: [
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
        ],
        audioStream: [
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
        ]
      };
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
