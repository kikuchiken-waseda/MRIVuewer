<template>
  <div class="optical-flow">
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
// import ColorUtil from "@/utils/color.js";
export default {
  name: "OpticalFlow",
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
    }
  },
  data: () => ({
    video: null,
    cap: null,
    frame2: null,
    next: null,
    prvs: null,
    flow: null,
    flowVec: null,
    ang: null,
    mag: null,
    hsv0: null,
    hsv: null,
    hsv2: null,
    hsvVec: null,
    rgb: null
  }),
  computed: {},
  methods: {
    onLoadeddata: function() {
      const tag = `${this.$options.name}:onLoadeddata`;
      this.cap.read(this.frame2);
      cv.imshow(this.$refs.canvas, this.frame2);
      console.log(tag);
    },
    onTimeupdate: function() {
      const tag = `${this.$options.name}:onTimeupdate`;
      try {
        // start processing.
        this.cap.read(this.frame2);
        cv.cvtColor(this.frame2, this.next, cv.COLOR_RGBA2GRAY);
        cv.calcOpticalFlowFarneback(
          this.prvs,
          this.next,
          this.flow,
          0.5,
          3,
          15,
          3,
          5,
          1.2,
          0
        );
        cv.split(this.flow, this.flowVec);
        let u = this.flowVec.get(0);
        let v = this.flowVec.get(1);
        cv.cartToPolar(u, v, this.mag, this.ang);
        u.delete();
        v.delete();
        this.ang.convertTo(this.hsv0, cv.CV_8UC1, 180 / Math.PI / 2);
        cv.normalize(this.mag, this.hsv2, 0, 255, cv.NORM_MINMAX, cv.CV_8UC1);
        cv.merge(this.hsvVec, this.hsv);
        cv.cvtColor(this.hsv, this.rgb, cv.COLOR_HSV2RGB);
        cv.imshow(this.$refs.canvas, this.rgb);
        this.next.copyTo(this.prvs);
      } catch (err) {
        console.error(err);
      }

      console.log(tag);
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

    this.prvs = new cv.Mat();
    this.frame2 = new cv.Mat(this.height, this.width, cv.CV_8UC4);
    this.next = new cv.Mat(this.height, this.width, cv.CV_8UC1);
    this.flow = new cv.Mat(this.height, this.width, cv.CV_32FC2);
    this.flowVec = new cv.MatVector();

    this.mag = new cv.Mat(this.height, this.width, cv.CV_32FC1);
    this.ang = new cv.Mat(this.height, this.width, cv.CV_32FC1);

    // take first frame of the video
    let frame1 = new cv.Mat(this.height, this.width, cv.CV_8UC4);
    this.cap.read(frame1);

    cv.cvtColor(frame1, this.prvs, cv.COLOR_RGBA2GRAY);
    frame1.delete();
    this.hsv = new cv.Mat();
    this.hsv0 = new cv.Mat(this.height, this.width, cv.CV_8UC1);
    let hsv1 = new cv.Mat(
      this.height,
      this.width,
      cv.CV_8UC1,
      new cv.Scalar(255)
    );
    this.hsv2 = new cv.Mat(this.height, this.width, cv.CV_8UC1);
    this.hsvVec = new cv.MatVector();
    this.hsvVec.push_back(this.hsv0);
    this.hsvVec.push_back(hsv1);
    this.hsvVec.push_back(this.hsv2);
    this.rgb = new cv.Mat(this.height, this.width, cv.CV_8UC3);
  }
};
</script>
