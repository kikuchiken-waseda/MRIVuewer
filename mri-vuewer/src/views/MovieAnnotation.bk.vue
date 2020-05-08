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
    <v-card v-if="dataUrl">
      <video
        muted
        ref="videoPre"
        class="mr-1"
        :src="dataUrl"
      />
      <video class="mr-1" ref="video" :src="dataUrl" />
      <video
        muted
        ref="videoPos"
        class="ml-1"
        :src="dataUrl"
      />
    </v-card>
    <v-card-actions>
      <v-btn icon>
        <v-icon>mdi-skip-previous</v-icon>
        <v-icon>mdi-skip-backward</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon @click="play">
          mdi-play
        </v-icon>
        <v-icon @click="pause">
          mdi-pause
        </v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-skip-next</v-icon>
        <v-icon>mdi-skip-forward</v-icon>
      </v-btn>
    </v-card-actions>
    <v-card v-if="dataUrl">
      <v-progress-linear
        v-if="isLoading"
        color="deep-purple accent-4"
        indeterminate
        rounded
        height="6"
      />
      <div v-show="!isLoading">
        <div id="wave-spectrogram"></div>
        <div id="waveform"></div>
      </div>
    </v-card>
  </v-card>
</template>

<script>
import MInfoMenu from "@/components/MovieAnnotaion/MInfoMenu.vue";
import WaveSurfer from "@/components/wavesurfer/wavesurfer.js";
import SpectrogramPlugin from "@/components/wavesurfer/plugin/spectrogram.js";

export default {
  name: "MovieAnnotaion",
  components: {
    MInfoMenu
  },
  data: () => ({
    isLoading: false,
    frameOffset: 1,
    options: {
      waveColor: "violet",
      progressColor: "purple",
      loaderColor: "purple",
      cursorColor: "navy",
      minPxPerSec: 100,
      scrollParent: true,
      normalize: true
    }
  }),
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
    frameRate: function() {
      return 1 / this.fps;
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
    load() {
      if (this.ws) {
        if (this.$refs.video) {
          this.isLoading = true;
          this.ws.load(this.$refs.video);
        }
      }
    },
    play: function() {
      this.syncVideos();
      this.$refs.videoPre.play();
      this.$refs.videoPos.play();
      this.ws.play();
    },
    pause: function() {
      this.$refs.videoPre.pause();
      this.$refs.videoPos.pause();
      this.ws.pause();
      this.syncVideos();
    },
    getCurrentTime: function() {
      return this.ws.getCurrentTime();
    },
    getDuration: function() {
      return this.ws.getDuration();
    },
    syncVideos: function() {
      const tag = `${this.$options.name}:syncVideos`;
      const currentTime = this.getCurrentTime();
      const offsetTime = this.frameOffset * this.frameRate;
      console.info(tag, currentTime);
      if (currentTime - offsetTime > 0) {
        const time = currentTime - offsetTime;
        this.$refs.videoPre.currentTime = time;
      } else {
        this.$refs.videoPre.currentTime = 0;
        console.warn(
          tag + "video-pre: setCurrentTime",
          `${currentTime - offsetTime} is less than 0`
        );
      }
      if (offsetTime + currentTime < this.getDuration()) {
        console.info(tag, "video-pos: setCurrentTime");
        const time = currentTime + offsetTime;
        this.$refs.videoPos.currentTime = time;
      } else {
        this.$refs.videoPos.currentTime = this.getDuration();
        console.warn(
          tag + "video-pos: setCurrentTime",
          `${currentTime +
            offsetTime} is more than ${this.getDuration()}`
        );
      }
    },
    onLoading(val) {
      const tag = `${this.$options.name}:onLoading`;
      console.log(tag, val);
      this.progress = val;
    },
    onRedy() {
      const tag = `${this.$options.name}:onRedy`;
      this.isLoading = false;
      console.log(tag);
    },
    onDestroy(val) {
      const tag = `${this.$options.name}:onDestroy`;
      console.log(tag, val);
    },
    onError(val) {
      const tag = `${this.$options.name}:onError`;
      console.log(tag, val);
    }
  },
  mounted: function() {
    if (!this.dataUrl) {
      this.$router.push({ name: "Home" });
    } else {
      const options = this.options;
      options.container = "#waveform";
      options.backend = "MediaElement";
      options.plugins = [
        SpectrogramPlugin.create({
          container: "#wave-spectrogram",
          labels: true
        })
      ];
      this.ws = WaveSurfer.create(options);
      this.ws.on("interaction", this.syncVideos);
      this.ws.on("loading", this.onLoading);
      this.ws.on("waveform-ready", this.onRedy);
      this.ws.on("destroy", this.onDestroy);
      this.ws.on("error", this.onError);
      this.load();
    }
  }
};
</script>
