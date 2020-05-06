<template>
  <div class="mean-shift">
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
  name: "MeanShift",
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
    frame: null,
    hsv: null,
    hsvVec: null,
    roiHist: null,
    dst: null,
    trackBox: null,
    termCrit: null
  }),
  methods: {
    onLoadeddata: function() {
      const tag = `${this.$options.name}:onLoadeddata`;
      this.cap.read(this.frame);
      cv.imshow(this.$refs.canvas, this.frame);
      console.info(tag, this.video.currentTime);
    },
    onTimeupdate: function() {
      const tag = `${this.$options.name}:onTimeupdate`;
      try {
        // start processing.
        this.cap.read(this.frame);
        cv.cvtColor(
          this.frame,
          this.hsv,
          cv.COLOR_RGBA2RGB
        );
        cv.cvtColor(this.hsv, this.hsv, cv.COLOR_RGB2HSV);
        cv.calcBackProject(
          this.hsvVec,
          [0],
          this.roiHist,
          this.dst,
          [0, 180],
          1
        );
        // apply camshift to get the new location
        [this.trackBox, this.trackWindow] = cv.CamShift(
          this.dst,
          this.trackWindow,
          this.termCrit
        );
        // Draw it on image
        let pts = cv.rotatedRectPoints(this.trackBox);
        cv.line(
          this.frame,
          pts[0],
          pts[1],
          [255, 0, 0, 255],
          3
        );
        cv.line(
          this.frame,
          pts[1],
          pts[2],
          [255, 0, 0, 255],
          3
        );
        cv.line(
          this.frame,
          pts[2],
          pts[3],
          [255, 0, 0, 255],
          3
        );
        cv.line(
          this.frame,
          pts[3],
          pts[0],
          [255, 0, 0, 255],
          3
        );
        cv.imshow(this.$refs.canvas, this.frame);
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
      if (time > 0 && time < this.video.duration) {
        this.video.currentTime = time;
      }
    }
  },
  mounted: function() {
    this.video = this.$refs.video;
    this.cap = new cv.VideoCapture(this.video);
    this.frame = new cv.Mat(
      this.height,
      this.width,
      cv.CV_8UC4
    );
    this.trackWindow = new cv.Rect(150, 60, 63, 125);
    let roi = this.frame.roi(this.trackWindow);
    let hsvRoi = new cv.Mat();
    cv.cvtColor(roi, hsvRoi, cv.COLOR_RGBA2RGB);
    cv.cvtColor(hsvRoi, hsvRoi, cv.COLOR_RGB2HSV);
    let mask = new cv.Mat();
    let lowScalar = new cv.Scalar(30, 30, 0);
    let highScalar = new cv.Scalar(180, 180, 180);
    let low = new cv.Mat(
      hsvRoi.rows,
      hsvRoi.cols,
      hsvRoi.type(),
      lowScalar
    );
    let high = new cv.Mat(
      hsvRoi.rows,
      hsvRoi.cols,
      hsvRoi.type(),
      highScalar
    );
    cv.inRange(hsvRoi, low, high, mask);
    this.roiHist = new cv.Mat();
    let hsvRoiVec = new cv.MatVector();
    hsvRoiVec.push_back(hsvRoi);
    cv.calcHist(
      hsvRoiVec,
      [0],
      mask,
      this.roiHist,
      [180],
      [0, 180]
    );
    cv.normalize(
      this.roiHist,
      this.roiHist,
      0,
      255,
      cv.NORM_MINMAX
    );

    // delete useless mats.
    roi.delete();
    hsvRoi.delete();
    mask.delete();
    low.delete();
    high.delete();
    hsvRoiVec.delete();

    // Setup the termination criteria, either 10 iteration or move by atleast 1 pt
    this.termCrit = new cv.TermCriteria(
      cv.TERM_CRITERIA_EPS | cv.TERM_CRITERIA_COUNT,
      10,
      1
    );

    this.hsv = new cv.Mat(
      this.height,
      this.width,
      cv.CV_8UC3
    );
    this.hsvVec = new cv.MatVector();
    this.hsvVec.push_back(this.hsv);
    this.dst = new cv.Mat();
    this.trackBox = null;
  }
};
</script>
