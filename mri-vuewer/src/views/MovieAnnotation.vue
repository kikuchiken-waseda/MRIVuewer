<template>
  <div class="movie-annotaion">
    <h1>{{ name }}</h1>
    <p>{{ fps }}</p>
    <pre>{{ dataUrl }}</pre>
    <pre>{{ stream }}</pre>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
export default {
  name: "MovieAnnotaion",
  data: () => ({
    res: ""
  }),
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
        this.$store.dispatch("current/setMovieDataUrl", val);
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
