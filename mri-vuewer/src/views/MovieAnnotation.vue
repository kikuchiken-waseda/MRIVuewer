<template>
  <v-card class="movie-annotaion">
    <v-toolbar dark color="secondary" dense>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-toolbar-title>
        {{ name }}
      </v-toolbar-title>
      <v-spacer />
      <m-info-menu :value="videoInfo" />
      <v-btn icon>
        <v-icon>mdi-cog</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-toolbar>
    <video-array
      ref="videoArray"
      :width="width"
      :height="height"
      :fps="fps"
      :dataUrl="dataUrl"
      v-on:timeupdate="onTimeupdate"
      v-on:loadeddata="onLoadeddata"
    />
  </v-card>
</template>

<script>
import VideoArray from "@/components/videos/VideoArray.vue";
import MInfoMenu from "@/components/MovieAnnotaion/MInfoMenu.vue";
export default {
  name: "MovieAnnotaion",
  components: {
    MInfoMenu,
    VideoArray
  },
  data: () => ({}),
  computed: {
    name: {
      get: function() {
        return this.$store.state.current.name;
      },
      set: function(val) {
        this.$store.dispatch("current/setName", val);
      }
    },
    fps: {
      get: function() {
        return this.$store.state.current.fps;
      },
      set: function(val) {
        this.$store.dispatch("current/setFps", val);
      }
    },
    dataUrl: {
      get: function() {
        return this.$store.state.current.dataUrl;
      },
      set: function(val) {
        this.$store.dispatch("current/setDataUrl", val);
      }
    },
    width: {
      get: function() {
        return this.$store.state.current.size.width;
      },
      set: function(val) {
        this.$store.dispatch("current/setWidth", val);
      }
    },
    height: {
      get: function() {
        return this.$store.state.current.size.height;
      },
      set: function(val) {
        this.$store.dispatch("current/setHeight", val);
      }
    },
    videoStream: {
      get: function() {
        return this.$store.state.current.videoStream;
      }
    },
    audioStream: {
      get: function() {
        return this.$store.state.current.audioStream;
      }
    },
    videoInfo: function() {
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
  methods: {
    onLoadeddata: function(duration) {
      const tag = `${this.$options.name}:onLoadeddata`;
      console.info(tag, duration);
    },
    onTimeupdate: function(currentTime) {
      const tag = `${this.$options.name}:onTimeupdate`;
      console.info(tag, currentTime);
    }
  },
  mounted: function() {
    if (!this.dataUrl) {
      this.$router.push({ name: "Home" });
    }
  }
};
</script>
