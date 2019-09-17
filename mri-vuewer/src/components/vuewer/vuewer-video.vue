<template>
  <v-layout>
    <v-flex d-flex xs4>
      <m-video
        :src="src"
        ref="pre-video"
        :label="`${skipLength} sec 前の画像`"
      />
    </v-flex>
    <v-flex d-flex xs4>
      <m-video
        :src="src"
        ref="main-video"
        label="現在の画像"
        @duration-change="setDuration"
        @timeup-date="setCurrentTime"
      />
    </v-flex>
    <v-flex d-flex xs4>
      <m-video
        :src="src"
        ref="pos-video"
        :label="`${skipLength} sec 後の画像`"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import MVideo from "@/components/widgets/m-video";
export default {
  components: {
    MVideo
  },
  data: () => ({
    _currentTime: null,
    _duration: null,
    preVideo: { currentTime: null, duration: null },
    mainVideo: { currentTime: null, duration: null },
    posVideo: { currentTime: null, duration: null }
  }),
  props: {
    skipLength: {
      type: Number,
      required: true
    },
    src: {
      type: String
    }
  },
  computed: {
    duration: function() {
      return this._duration;
    },
    currentTime: {
      get: function() {
        return this._currentTime;
      },
      set: function(val) {
        const preTime = val - this.skipLength;
        if (preTime > 0) {
          this.preVideo.currentTime = preTime;
        } else {
          this.preVideo.currentTime = 0;
        }

        this.mainVideo.currentTime = val;

        const posTime = val + this.skipLength;
        if (posTime <= this.posVideo.duration) {
          this.posVideo.currentTime = posTime;
        } else {
          this.posVideo.currentTime = this.posVideo.duration;
        }
      }
    }
  },
  methods: {
    play: function() {
      Promise.all([
        this.preVideo.play(),
        this.mainVideo.play(),
        this.posVideo.play()
      ]).then(() => {});
    },
    playToggle: function() {
      Promise.all([
        this.preVideo.playToggle(),
        this.mainVideo.playToggle(),
        this.posVideo.playToggle()
      ]).then(() => {});
    },
    getDuration: function() {
      return this._duration;
    },
    setDuration: function() {
      this._duration = this.mainVideo.duration;
      this.$emit("duration-change", this._duration);
    },
    getCurrentTime: function() {
      return this._current_time;
    },
    setCurrentTime: function() {
      this._currentTime = this.mainVideo.getCurrentTime();
      this.$emit("timeup-date", this._currentTime);
    }
  },
  mounted: function() {
    this.$nextTick(() => {
      this.preVideo = this.$refs["pre-video"];
      this.preVideo.currentTime = 0;
      this.mainVideo = this.$refs["main-video"];
      this.mainVideo.currentTime = this.skipLength;
      this.posVideo = this.$refs["pos-video"];
      this.posVideo.currentTime = 2 * this.skipLength;
    });
  }
};
</script>
