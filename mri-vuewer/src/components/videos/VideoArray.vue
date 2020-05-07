<template>
  <v-container class="video-array">
    <video
      muted
      ref="videoPre"
      :class="`ma-${margin}`"
      :src="dataUrl"
    />
    <video
      muted
      ref="video"
      :class="`ma-${margin}`"
      :src="dataUrl"
      v-on:timeupdate="onTimeupdate"
      v-on:loadeddata="onLoadeddata"
    />
    <video
      muted
      ref="videoPos"
      :class="`ma-${margin}`"
      :src="dataUrl"
    />
  </v-container>
</template>

<script>
export default {
  name: "VideoArray",
  props: {
    dataUrl: {
      type: String,
      require: true
    },
    fps: {
      type: Number,
      require: true
    },
    width: {
      type: Number,
      require: true
    },
    height: {
      type: Number,
      require: true
    },
    margin: {
      type: Number,
      default: 1
    },
    frameOffset: {
      type: Number,
      default: 1
    }
  },
  data: () => ({
    video: null
  }),
  watch: {
    isPlaying: function(val) {
      const tag = `${this.$options.name}:watch:isPlaying`;
      if (val) {
        this.play();
      } else {
        this.pause();
      }
      console.log(tag, val);
    }
  },
  computed: {
    frameRate: function() {
      return 1 / this.fps;
    },
    isPlaying: {
      get: function() {
        const val = this.$store.state.current.isPlaying;
        return val;
      },
      set: function(val) {
        this.$store.dispatch("current/setIsPlaying", val);
      }
    }
  },
  methods: {
    // イベント系
    onLoadeddata: function() {
      const tag = `${this.$options.name}:onLoadeddata`;
      this.syncVideos();
      this.$emit("loadeddata", this.getDuration());
      console.info(tag, this.getDuration());
    },
    onTimeupdate: function() {
      const tag = `${this.$options.name}:onTimeupdate`;
      this.$emit("timeupdate", this.getCurrentTime());
      this.syncVideos();
      console.info(tag);
    },
    // 操作系
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
    play: function() {
      const video = this.$refs.video;
      video.play();
    },
    pause: function() {
      const video = this.$refs.video;
      video.pause();
    },
    next: function() {
      const currentTime = this.getCurrentTime();
      const offsetTime = this.frameOffset * this.frameRate;
      const time = Math.min(
        this.getDuration(),
        currentTime + offsetTime
      );
      this.setCurrentTime(time);
    },
    prev: function() {
      const currentTime = this.getCurrentTime();
      const offsetTime = this.frameOffset * this.frameRate;
      const time = Math.max(0, currentTime - offsetTime);
      this.setCurrentTime(time);
    },
    setCurrentTime: function(time) {
      this.$refs.video.currentTime = time;
      this.syncVideos();
    },
    getCurrentTime: function() {
      return this.$refs.video.currentTime;
    },
    getDuration: function() {
      return this.$refs.video.duration;
    }
  },
  mounted: function() {
    // this.video = this.$refs.video;
  }
};
</script>
