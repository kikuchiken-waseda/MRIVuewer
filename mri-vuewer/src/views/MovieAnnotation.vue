<template>
  <v-container fluid class="pa-0 movie-annotaion">
    <m-tool-bar :ws="ws" v-on:updateFiler="onUpdateFiler" />
    <v-card :color="background">
      <v-container v-if="dataUrl">
        <v-row>
          <v-col class="flex-grow-1 flex-shrink-1">
            <v-card flat :color="background">
              <v-container fluid class="pa-0">
                <v-row class="py-0">
                  <v-col cols="4" class="py-0">
                    <v-card flat :color="background">
                      <v-system-bar dark color="accent">
                        {{ frameOffset }}フレーム前の画像
                      </v-system-bar>
                      <video
                        muted
                        ref="videoPre"
                        :style="videoStyle"
                        :src="dataUrl"
                      />
                    </v-card>
                  </v-col>
                  <v-col cols="4" class="py-0">
                    <v-card flat :color="background">
                      <v-system-bar dark color="accent">
                        現在画像
                      </v-system-bar>
                      <video ref="video" :style="videoStyle" :src="dataUrl" />
                    </v-card>
                  </v-col>
                  <v-col cols="4" class="py-0">
                    <v-card flat :color="background">
                      <v-system-bar dark color="accent">
                        {{ frameOffset }}フレーム前の画像
                      </v-system-bar>
                      <video
                        muted
                        ref="videoPos"
                        :style="videoStyle"
                        :src="dataUrl"
                      />
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
            <v-card>
              <v-card-actions>
                <v-btn icon>
                  <v-icon>mdi-skip-previous</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon>mdi-skip-backward</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn fab dark small color="accent" @click="play">
                  <v-icon> mdi-play </v-icon>
                </v-btn>
                <v-btn fab dark small color="accent" @click="pause">
                  <v-icon> mdi-pause </v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn icon>
                  <v-icon>mdi-skip-next</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon>mdi-skip-forward</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="5" class="flex-grow-1 flex-shrink-1 d-none d-sm-flex">
            <m-tier-list />
          </v-col>
        </v-row>
        <v-card :loading="isLoading">
          <div>
            <div id="wave-spectrogram"></div>
            <div id="wave-timeline"></div>
            <div id="waveform"></div>
            <div id="wave-minimap"></div>
          </div>
        </v-card>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import colors from "vuetify/lib/util/colors";
import MToolBar from "@/components/MovieAnnotaion/MToolBar.vue";
import MTierList from "@/components/MovieAnnotaion/MTierList.vue";
import WaveSurfer from "@/components/wavesurfer/wavesurfer.js";
import SpectrogramPlugin from "@/components/wavesurfer/plugin/spectrogram.js";
import TimelinePlugin from "@/components/wavesurfer/plugin/timeline.js";
import MinimapPlugin from "@/components/wavesurfer/plugin/minimap.js";
import RegionPlugin from "@/components/wavesurfer/plugin/regions.js";

export default {
  name: "MovieAnnotaion",
  components: {
    MToolBar,
    MTierList
  },
  data: () => ({
    ws: null,
    isLoading: false,
    background: "grey lighten-3",
    frameOffset: 1,
    videoStyle: {
      width: "100%",
      height: "auto"
    },
    options: {
      waveColor: colors.grey.base,
      progressColor: colors.grey.darken4,
      loaderColor: colors.grey.darken4,
      cursorColor: colors.teal.base,
      minPxPerSec: 200,
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
    }
  },
  methods: {
    load() {
      if (this.ws) {
        this.isLoading = true;
        if (this.$refs.video) {
          const elm = this.$refs.video;
          this.ws.load(elm);
        } else {
          this.isLoading = false;
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
          `${currentTime + offsetTime} is more than ${this.getDuration()}`
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
    },
    onUpdateFiler(payload) {
      const tag = `${this.$options.name}:onUpdateFiler`;
      console.log(tag, payload);
      this.ws.backend.setFilters(payload);
    }
  },
  mounted: function() {
    const tag = `${this.$options.name}:mounted`;
    console.log(tag);
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
        }),
        TimelinePlugin.create({
          container: "#wave-timeline"
        }),
        MinimapPlugin.create({
          container: "#wave-minimap",
          height: 50
        }),
        RegionPlugin.create({
          regions: []
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
  },
  beforeDestroy: function() {
    const tag = `${this.$options.name}:beforeDestroy`;
    if (this.ws) {
      this.ws.destroy();
    }
    console.log(tag);
  }
};
</script>
