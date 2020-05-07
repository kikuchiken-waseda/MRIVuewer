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
    <pre>{{ videoStream }}</pre>
    <pre>{{ audioStream }}</pre>
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
        this.$store.dispatch("current/setName", val);
      }
    },
    fps: {
      get: function() {
        return this.$store.state.current.fps;
      },
      set: function(val) {
        this.$store.dispatch("current/setFps", val);
      }
    },
    dataUrl: {
      get: function() {
        return this.$store.state.current.dataUrl;
      },
      set: function(val) {
        this.$store.dispatch("current/setDataUrl", val);
      }
    },
    width: {
      get: function() {
        return this.$store.state.current.size.width;
      },
      set: function(val) {
        this.$store.dispatch("current/setWidth", val);
      }
    },
    height: {
      get: function() {
        return this.$store.state.current.size.height;
      },
      set: function(val) {
        this.$store.dispatch("current/setHeight", val);
      }
    },
    videoStream: {
      get: function() {
        return this.$store.state.current.videoStream;
      }
    },
    audioStream: {
      get: function() {
        return this.$store.state.current.videoStream;
      }
    }
  },
  mounted: function() {
    if (!this.dataUrl) {
      this.$router.push({ name: "Home" });
    }
  }
};
</script>
