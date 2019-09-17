<template>
  <v-container>
    <v-layout row fill-height wrap>
      <v-flex xs12 sm7 md9 lg7>
        <v-card>
          <vuewer-video
            ref="videos"
            :src="media.url"
            :skip-length="skipLength"
            @duration-change="setDuration"
            @timeup-date="setCurrentTime"
          />
          <v-card-actions>
            <m-tooltip-btn
              class="ma-1"
              v-for="(btn, key) in toolbarBtns.fronts"
              :btn="btn"
              :key="`fb-${key}`"
            />
            <div class="flex-grow-1" />
            <m-tooltip-btn
              class="ma-1"
              v-for="(btn, key) in toolbarBtns.middles"
              :btn="btn"
              :key="`mb-${key}`"
            />
            <span>
              {{ currentTime.toFixed(2) }} / {{ duration.toFixed(2) }}
            </span>
            <div class="flex-grow-1" />
            <m-tooltip-btn
              class="ma-1"
              v-for="(btn, key) in toolbarBtns.backs"
              :btn="btn"
              :key="`bb-${key}`"
            />
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import dropbox from "@/api/dropbox";
import VuewerVideo from "@/components/vuewer/vuewer-video.vue";
import MTooltipBtn from "@/components/widgets/m-tooltip-btn";
export default {
  components: {
    VuewerVideo,
    MTooltipBtn
  },
  data: () => ({
    fps: 13.78310345,
    loading: false,
    media: {
      blob: null,
      url: null
    },
    videos: null,
    duration: 0,
    currentTime: 0,
    toolbarBtns: {
      fronts: [],
      middles: [],
      backs: []
    }
  }),
  methods: {
    setDuration: function(duration) {
      this.duration = duration;
    },
    setCurrentTime: function(currentTime) {
      this.currentTime = currentTime;
    },
    setMedia: function(id) {
      this.loading = true;
      dropbox.file
        .get(id)
        .then(res => {
          this.media.blob = res.fileBlob;
          this.media.url = window.URL.createObjectURL(res.fileBlob);
        })
        .catch(res => {
          console.error(res);
          this.$store.dispatch("show_error", res.error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    setToolbarBtns: function() {
      this.toolbarBtns = {
        fronts: [
          {
            icon: "mdi-skip-backward",
            color: "primary",
            func: this.skipBackward,
            caption: "move to first frame..."
          },
          {
            icon: "mdi-skip-previous",
            color: "primary",
            func: this.skipPrevious,
            caption: "move to previous frame..."
          }
        ],
        middles: [
          {
            icon: "mdi-play-pause",
            color: "primary",
            func: this.playToggle,
            caption: "Play or Pause..."
          },
          {
            icon: "mdi-refresh",
            color: "primary",
            caption: "Redraw Sound..."
          }
        ],
        backs: [
          {
            icon: "mdi-skip-next",
            color: "primary",
            func: this.skipNext,
            caption: "move to next frame..."
          },
          {
            icon: "mdi-skip-forward",
            color: "primary",
            func: this.skipForward,
            caption: "move to last frame..."
          }
        ]
      };
    },
    skipBackward: function() {
      this.videos.currentTime = this.skipLength;
    },
    skipForward: function() {
      this.videos.currentTime = this.duration - this.skipLength;
    },
    skipNext: function() {
      this.videos.currentTime = this.currentTime + this.skipLength;
    },
    skipPrevious: function() {
      this.videos.currentTime = this.currentTime - this.skipLength;
    },
    playToggle: function() {
      if (this.videos) {
        this.videos.playToggle();
      }
    }
  },
  computed: {
    id: function() {
      return this.$route.params.id;
    },
    skipLength: function() {
      const len = 1 / this.fps;
      return parseFloat(len.toFixed(4));
    }
  },
  mounted: function() {
    this.setMedia(this.id);
    this.$nextTick(() => {
      this.setToolbarBtns();
      this.videos = this.$refs.videos;
    });
  }
};
</script>
<style scoped></style>
