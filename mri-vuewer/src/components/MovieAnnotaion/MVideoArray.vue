<template>
  <v-container fluid class="pa-0">
    <v-row class="py-0">
      <v-col cols="4" class="py-0">
        <v-card flat color="background">
          <v-system-bar dark color="accent">
            {{ frameOffset }}フレーム前の画像
          </v-system-bar>
          <video
            v-if="src"
            muted
            ref="videoPre"
            :style="videoStyle"
            :src="src"
          />
        </v-card>
      </v-col>
      <v-col cols="4" class="py-0">
        <v-card flat color="background">
          <v-system-bar dark color="accent">
            現在画像
          </v-system-bar>
          <video
            v-if="src"
            ref="video"
            @loadeddata="onLoadeddata"
            @timeupdate="onTimeupdate"
            :style="videoStyle"
            :src="src"
          />
          <canvas ref="canvas" v-show="false" :style="videoStyle" />
        </v-card>
      </v-col>
      <v-col cols="4" class="py-0">
        <v-card flat color="background">
          <v-system-bar dark color="accent">
            {{ frameOffset }}フレーム後の画像
          </v-system-bar>
          <video
            muted
            v-if="src"
            ref="videoPos"
            :style="videoStyle"
            :src="src"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "MVideoArray",
  props: {
    src: {
      type: String,
      requested: true
    },
    fps: {
      type: Number,
      requested: true
    },
    frameOffset: {
      type: Number,
      default: 1
    }
  },
  data: () => ({
    el: null,
    debug: false,
    background: "grey lighten-3",
    videoStyle: {
      width: "100%",
      height: "auto"
    }
  }),
  computed: {
    frameRate: function() {
      return 1 / this.fps;
    }
  },
  methods: {
    // ユーティリティ関数
    log: function(tag, msg) {
      if (this.debug) {
        console.info(tag, msg);
      }
    },
    syncVideos: function(currentTime) {
      const tag = `${this.$options.name}:syncVideos`;
      this.syncCanvas();
      const offsetTime = this.frameOffset * this.frameRate;
      this.log(tag, `currentTime:${currentTime} offsetTime:${offsetTime}`);
      if (currentTime - offsetTime > 0) {
        const time = currentTime - offsetTime;
        this.log(tag, `video-pre: setCurrentTime: ${time}`);
        this.$refs.videoPre.currentTime = time;
      }
      if (offsetTime + currentTime < this.getDuration()) {
        this.log(tag, "video-pos: setCurrentTime");
        const time = currentTime + offsetTime;
        this.$refs.videoPos.currentTime = time;
      }
    },
    syncCanvas: function() {
      const tag = `${this.$options.name}:syncCanvas`;
      const video = this.$refs.video;
      const canvas = this.$refs.canvas;
      canvas.width = video.clientWidth;
      canvas.height = video.clientWidth;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL();
      this.log(tag, dataUrl);
      this.$emit("syncCanvas", dataUrl);
    },
    getFrame: function() {
      const tag = `${this.$options.name}:getFrame`;
      const video = this.$refs.video;
      const canvas = document.createElement("canvas");
      canvas.width = video.clientWidth;
      canvas.height = video.clientWidth;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL();
      this.log(tag, dataUrl);
      return dataUrl;
    },
    getDuration: function() {
      return this.$refs.video.duration;
    },
    getCurrentTime: function() {
      if (this.$refs.video) {
        return this.$refs.video.currentTime;
      }
    },
    // イベント発火
    onLoadeddata() {
      const tag = `${this.$options.name}:onLoadeddata`;
      const video = this.$refs.video;
      this.log(tag, video);
      this.$emit("loadeddata", video);
    },
    onTimeupdate: function() {
      const tag = `${this.$options.name}:onTimeupdate`;
      const currentTime = this.getCurrentTime();
      this.$emit("timeupdate", currentTime);
      this.syncVideos(currentTime);
      this.log(tag, currentTime);
    }
  }
};
</script>
