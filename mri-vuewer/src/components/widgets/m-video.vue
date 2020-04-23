<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <video
        slot="activator"
        muted
        ref="video"
        :src="src"
        v-on="on"
        @durationchange="setDuration"
        @timeupdate="setCurrentTime"
      />
    </template>
    <span>{{ label }}</span>
  </v-tooltip>
</template>

<script>
export default {
  data: () => ({
    video: null,
    duration: null,
    _current_time: null
  }),
  props: {
    src: {
      type: String
    },
    label: {
      type: String,
      required: true
    }
  },
  computed: {
    currentTime: {
      get: function() {
        return this._current_time;
      },
      set: function(val) {
        this.video.currentTime = val;
      }
    }
  },
  methods: {
    setDuration() {
      this.duration = this.video.duration;
      this.$emit("duration-change");
    },
    setCurrentTime() {
      this._current_time = this.video.currentTime;
      this.$emit("timeup-date");
    },
    getCurrentTime() {
      return this._current_time;
    },

    play: function() {
      this.video.play();
    },
    pause: function() {
      this.video.pause();
    },
    playToggle: function() {
      if (this.video.paused == true) {
        this.play();
      } else {
        this.pause();
      }
    }
  },
  mounted: function() {
    this.video = this.$refs.video;
  }
};
</script>

<style scoped>
video {
  width: 100%;
  height: auto;
}
</style>
