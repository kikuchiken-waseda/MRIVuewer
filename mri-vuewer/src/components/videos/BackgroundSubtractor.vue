<template>
  <div class="background-subtractor">
    <video
      v-show="false"
      ref="video"
      :width="width"
      :height="height"
      muted
      :src="dataUrl"
      v-on:timeupdate="onTimeupdate"
      v-on:loadeddata="onLoadeddata"
    />
    <canvas
      ref="canvas"
      :width="width"
      :height="height"
      style="border:1px solid #000000;"
    />
  </div>
</template>

<script>
import ColorUtil from "@/utils/color.js";
export default {
  name: "BackgroundSubtractor",
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
    history: {
      type: Number,
      default: 50
    },
    threshold: {
      type: Number,
      default: 16
    },
    detectShadows: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    cap: null,
    video: null,
    frame: null,
    fgmask: null
  }),
  computed: {
    fgbg: function() {
      const tag = `${this.$options.name}:computed:fgbg`;
      console.info(tag);
      return new cv.BackgroundSubtractorMOG2(
        this.history,
        this.threshold,
        this.detectShadows
      );
    }
  },
  methods: {
    onLoadeddata: function() {
      const tag = `${this.$options.name}:onLoadeddata`;
      this.setCurrentTime(1 / this.fps);
      try {
        const canvas = this.$refs.canvas;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = ColorUtil.getRgb("grey");
        ctx.fillRect(0, 0, this.width, this.height);
        this.cap.read(this.frame);
        cv.imshow(this.$refs.canvas, this.frame);
        console.info(tag);
      } catch (err) {
        console.error(tag, err);
      }
    },
    onTimeupdate: function() {
      const tag = `${this.$options.name}:onTimeupdate`;
      try {
        this.cap.read(this.frame);
        this.fgbg.apply(this.frame, this.fgmask);
        cv.imshow(this.$refs.canvas, this.fgmask);
      } catch (err) {
        console.error(tag, err);
      }
    },
    play: function() {
      this.video.play();
    },
    pause: function() {
      this.video.pause();
    },
    setCurrentTime: function(time) {
      const tag = `${this.$options.name}:setCurrentTime`;
      if (time > 0 && time < this.video.duration) {
        this.video.currentTime = time;
        console.info(tag, this.video.currentTime);
      } else {
        console.error(tag, this.video.currentTime);
      }
    }
  },
  mounted: function() {
    this.video = this.$refs.video;
    this.cap = new cv.VideoCapture(this.video);
    this.frame = new cv.Mat(this.height, this.width, cv.CV_8UC4);
    this.fgmask = new cv.Mat(this.height, this.width, cv.CV_8UC1);
  }
};
</script>
