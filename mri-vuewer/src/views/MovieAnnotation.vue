<template>
  <v-container fluid class="pa-0 movie-annotaion">
    <m-tool-bar v-if="item" :ws="ws" v-on:updateFiler="onUpdateFiler" />
    <v-card :color="background">
      <v-container v-if="item">
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
                        v-if="item.dataUrl"
                        muted
                        ref="videoPre"
                        :style="videoStyle"
                        :src="item.dataUrl"
                      />
                    </v-card>
                  </v-col>
                  <v-col cols="4" class="py-0">
                    <v-card flat :color="background">
                      <v-system-bar dark color="accent">
                        現在画像
                      </v-system-bar>
                      <video
                        v-if="item.dataUrl"
                        ref="video"
                        :style="videoStyle"
                        :src="item.dataUrl"
                      />
                    </v-card>
                  </v-col>
                  <v-col cols="4" class="py-0">
                    <v-card flat :color="background">
                      <v-system-bar dark color="accent">
                        {{ frameOffset }}フレーム後の画像
                      </v-system-bar>
                      <video
                        muted
                        v-if="item.dataUrl"
                        ref="videoPos"
                        :style="videoStyle"
                        :src="item.dataUrl"
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
    <v-card v-if="debug">
      <v-container v-if="item">
        <pre>{{ item }}</pre>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import File from "@/models/file.js";
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
    debug: false,
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
    item: {
      get: function() {
        return File.find(this.$route.params.id);
      },
      set: function(payload) {
        File.update({
          where: this.$route.params.id,
          data: payload
        });
      }
    },
    frameRate: function() {
      return 1 / this.item.fps;
    }
  },
  watch: {
    "item.dataUrl": function() {
      this.$nextTick(() => {
        // this.initWs();
        this.load();
      });
    }
  },
  methods: {
    log: function(tag, msg) {
      if (this.debug) {
        console.info(tag, msg);
      }
    },
    load() {
      const tag = `${this.$options.name}:load`;
      this.isLoading = true;
      const elm = this.$refs.video;
      if (this.$refs.video) {
        if (this.ws) {
          this.ws.load(elm);
        } else {
          this.log(tag, "no ws");
        }
      } else {
        this.log(tag, "no video");
      }
      this.isLoading = false;
    },
    initWs() {
      const tag = `${this.$options.name}:initWs`;
      if (this.ws) {
        this.log(tag, "destroy:ws");
        this.ws.destroy();
        this.ws = null;
      }
      this.log(tag, "init:ws");
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
      this.log(tag, currentTime);
      if (currentTime - offsetTime > 0) {
        const time = currentTime - offsetTime;
        this.$refs.videoPre.currentTime = time;
      } else {
        this.$refs.videoPre.currentTime = 0;
        this.log(
          tag + "video-pre: setCurrentTime",
          `${currentTime - offsetTime} is less than 0`
        );
      }
      if (offsetTime + currentTime < this.getDuration()) {
        this.log(tag, "video-pos: setCurrentTime");
        const time = currentTime + offsetTime;
        this.$refs.videoPos.currentTime = time;
      } else {
        this.$refs.videoPos.currentTime = this.getDuration();
        this.log(
          tag + "video-pos: setCurrentTime",
          `${currentTime + offsetTime} is more than ${this.getDuration()}`
        );
      }
    },
    onLoading(val) {
      const tag = `${this.$options.name}:onLoading`;
      this.log(tag, val);
      this.progress = val;
    },
    onRedy() {
      const tag = `${this.$options.name}:onRedy`;
      this.isLoading = false;
      this.log(tag);
    },
    onDestroy(val) {
      const tag = `${this.$options.name}:onDestroy`;
      this.log(tag, val);
    },
    onError(val) {
      const tag = `${this.$options.name}:onError`;
      this.log(tag, val);
    },
    onUpdateFiler(payload) {
      const tag = `${this.$options.name}:onUpdateFiler`;
      this.log(tag, payload);
      this.ws.backend.setFilters(payload);
    }
  },
  mounted: function() {
    const tag = `${this.$options.name}:mounted`;
    this.log(tag);
    if (!this.item) {
      this.$router.push({ name: "Home" });
    } else {
      this.initWs();
      this.load();
    }
  }
};
</script>
