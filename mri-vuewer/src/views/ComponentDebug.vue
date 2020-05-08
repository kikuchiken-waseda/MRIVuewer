<template>
  <div class="component-debug">
    <h1>Debug components</h1>
    <v-card class="mx-auto">
      <v-toolbar color="primary" dark>
        <v-toolbar-title>動画関連</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-title v-if="video.name && video.fps">
          {{ video.name }} ({{ video.fps }})
        </v-toolbar-title>
      </v-toolbar>
      <v-container>
        <m-movie-input v-model="video" />
        <v-card class="mx-auto">
          <v-toolbar color="blue-grey" dark>
            <v-toolbar-title>
              Open CV DEMO
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu
              bottom
              left
              v-model="conf.show"
              :close-on-content-click="false"
            >
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on">
                  <v-icon>mdi-cog</v-icon>
                </v-btn>
              </template>
              <v-list subheader>
                <v-subheader>
                  background-subtractor
                </v-subheader>
                <v-list-item>
                  <v-list-item-title>
                    <v-text-field
                      v-model="conf.bs.history"
                      label="history"
                    />
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>
                    <v-text-field
                      v-model="conf.bs.threshold"
                      label="threshold"
                    />
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>
                    <v-switch
                      v-model="conf.bs.detectShadows"
                      label="detectShadows"
                    />
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
          <v-container v-if="video.dataUrl && video.file">
            <v-row>
              <v-card class="ma-1">
                <v-system-bar dark color="primary">
                  <span>origin</span>
                </v-system-bar>
                <video
                  ref="video"
                  :width="video.size.width"
                  :height="video.size.height"
                  :src="video.dataUrl"
                />
              </v-card>
              <v-card class="ma-1">
                <v-system-bar dark color="primary">
                  <span>background-subtractor</span>
                </v-system-bar>
                <background-subtractor
                  ref="backgroundSubtractor"
                  :dataUrl="video.dataUrl"
                  :fps="video.fps"
                  :width="video.size.width"
                  :height="video.size.height"
                  :history="Number(conf.bs.history)"
                  :threshold="Number(conf.bs.threshold)"
                  :detectShadows="conf.bs.detectShadows"
                />
              </v-card>
              <v-card class="ma-1">
                <v-system-bar dark color="primary">
                  <span>optical-flow</span>
                </v-system-bar>
                <optical-flow
                  ref="opticalFlow"
                  :dataUrl="video.dataUrl"
                  :fps="video.fps"
                  :width="video.size.width"
                  :height="video.size.height"
                />
              </v-card>
              <v-card class="ma-1">
                <v-system-bar dark color="primary">
                  <span>mean-shift</span>
                </v-system-bar>
                <mean-shift
                  ref="meanShift"
                  :dataUrl="video.dataUrl"
                  :fps="video.fps"
                  :width="video.size.width"
                  :height="video.size.height"
                />
              </v-card>
            </v-row>
          </v-container>
        </v-card>
      </v-container>
      <v-card-actions>
        <v-btn text @click="prev">
          prev
        </v-btn>
        <v-btn text @click="play">Play</v-btn>
        <v-btn text @click="pause">
          Pause
        </v-btn>
        <v-btn text @click="next">next</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import MMovieInput from "@/components/form/MMovieInput.vue";
import BackgroundSubtractor from "@/components/videos/BackgroundSubtractor.vue";
import OpticalFlow from "@/components/videos/OpticalFlow.vue";
import MeanShift from "@/components/videos/MeanShift.vue";
export default {
  name: "ComponentDebug",
  components: {
    MMovieInput,
    BackgroundSubtractor,
    OpticalFlow,
    MeanShift
  },
  data: () => ({
    video: {
      loading: false,
      name: null,
      dataUrl: null,
      fps: null,
      size: {
        width: null,
        height: null
      }
    },
    conf: {
      show: false,
      bs: {
        history: 50,
        threshold: 16,
        detectShadows: false
      }
    }
  }),
  methods: {
    play: function() {
      const video = this.$refs.video;
      video.play();
      this.$refs.backgroundSubtractor.play();
      this.$refs.meanShift.play();
      this.$refs.opticalFlow.play();
      this.$refs.videoArray.play();
    },
    pause: function() {
      const video = this.$refs.video;
      video.pause();
      this.$refs.backgroundSubtractor.pause();
      this.$refs.meanShift.pause();
      this.$refs.opticalFlow.pause();
      this.$refs.videoArray.pause();
    },
    prev: function() {
      const video = this.$refs.video;
      const frameRate = 1 / this.video.fps;
      const time = Math.max(
        0,
        video.currentTime - frameRate
      );
      video.currentTime = time;
      this.$refs.backgroundSubtractor.setCurrentTime(time);
      this.$refs.meanShift.setCurrentTime(time);
      this.$refs.opticalFlow.setCurrentTime(time);
      this.$refs.videoArray.prev();
    },
    next: function() {
      const video = this.$refs.video;
      const frameRate = 1 / this.video.fps;
      const time = Math.min(
        video.duration,
        video.currentTime + frameRate
      );
      video.currentTime = time;
      this.$refs.backgroundSubtractor.setCurrentTime(time);
      this.$refs.meanShift.setCurrentTime(time);
      this.$refs.opticalFlow.setCurrentTime(time);
      this.$refs.videoArray.next();
    }
  }
};
</script>
