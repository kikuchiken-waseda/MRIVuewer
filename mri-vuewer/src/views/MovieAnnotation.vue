<template>
  <div class="movie-annotaion">
    <video-array
      ref="videoArray"
      :width="width"
      :height="height"
      :fps="fps"
      :dataUrl="dataUrl"
    />

    <h1>{{ name }}</h1>
    <p>{{ fps }}</p>
    <pre>{{ dataUrl }}</pre>
    <pre>{{ stream }}</pre>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
import VideoArray from "@/components/videos/VideoArray.vue";
export default {
  name: "MovieAnnotaion",
  data: () => ({
    res: ""
  }),
  components: {
    VideoArray
  },
  computed: {
    name: {
      get: function() {
        return this.$store.state.current.name;
      },
      set: function(val) {
        this.$store.dispatch("current/setMovieName", val);
      }
    },
    fps: {
      get: function() {
        return this.$store.state.current.fps;
      },
      set: function(val) {
        this.$store.dispatch("current/setMovieFps", val);
      }
    },
    dataUrl: {
      get: function() {
        return this.$store.state.current.dataUrl;
      },
      set: function(val) {
        this.$store.dispatch(
          "current/setMovieDataUrl",
          val
        );
      }
    },
    width: {
      get: function() {
        console.log(this.$store.state.size);
        return this.$store.state.width;
      },
      set: function(val) {
        this.$store.dispatch("current/setMovieWidth", val);
      }
    },
    height: {
      get: function() {
        return this.$store.state.height;
      },
      set: function(val) {
        this.$store.dispatch("current/setMovieHeight", val);
      }
    },

    stream: {
      get: function() {
        return this.$store.state.current.stream;
      },
      set: function(val) {
        this.$store.dispatch("current/setMovieStream", val);
      }
    }
  }
};
</script>
