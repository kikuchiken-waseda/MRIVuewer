<template>
  <v-container class="m-wave-surfer">
    <v-progress-linear
      v-if="isLoading"
      color="deep-purple accent-4"
      indeterminate
      rounded
      height="6"
    />
    <div id="wave-spectrogram"></div>
    <div id="waveform"></div>
  </v-container>
</template>

<script>
import WaveSurfer from "./wavesurfer.js";
import SpectrogramPlugin from "./plugin/spectrogram.js";
export default {
  name: "MWaveSurfer",
  data: () => ({
    ws: null,
    isLoading: false
  }),
  props: {
    options: {
      type: Object,
      default: () => ({
        waveColor: "violet",
        progressColor: "purple",
        loaderColor: "purple",
        cursorColor: "navy",
        minPxPerSec: 100,
        scrollParent: true,
        normalize: true
      })
    },
    fps: {
      type: Number,
      require: true
    },
    dataUrl: {
      type: String,
      require: true
    }
  },
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
    // 操作系
    load() {
      if (this.ws) {
        this.isLoading = true;
        this.ws.load(this.dataUrl);
      }
    },
    play: function(start, end) {
      this.ws.play(start, end);
    },
    pause: function() {
      this.ws.pause();
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
    getCurrentTime: function() {
      return this.ws.getCurrentTime();
    },
    getDuration: function() {
      return this.ws.getDuration();
    },
    // イベント系
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
    const options = this.options;
    options.container = "#waveform";
    options.plugins = [
      SpectrogramPlugin.create({
        container: "#wave-spectrogram",
        labels: true
      })
    ];
    this.ws = WaveSurfer.create(options);
    this.ws.on("loading", this.onLoading);
    this.ws.on("ready", this.onRedy);
    this.ws.on("destroy", this.onDestroy);
    this.ws.on("error", this.onError);
    this.load();
  }
};
</script>
