
/* 動画用コンポーネント */
Vue.component('video-player', {
  data: function () {
    return {
      currentTime: 0,
      currentFrame: 0,
      playBtnMessage: 'PLAY'
    }
  },
  props: [
    'url',
    'fps',
    'by'
  ],
  methods: {
    play: function (event) {
      let video = document.getElementById("nowVideo");
      if (video.paused) {
        this.playBtnMessage = 'STOP';
        video.play();
      } else {
        this.playBtnMessage = 'PLAY';
        video.pause();
        this.currentTime = video.currentTime;
      }
      this.playing = video.paused;
    },
    getCurrentInfo: function (event) {
      let video = document.getElementById("nowVideo");
      let preVideo = document.getElementById("preVideo");
      let posVideo = document.getElementById("posVideo");

      this.currentTime = video.currentTime;
      this.currentFrame = Math.floor(video.currentTime * this.fps);

      let by = parseFloat(this.by);
      if (this.currentTime > by) {
        preVideo.currentTime = video.currentTime - by;
      }
      if (this.currentTime <= video.duration - by) {
        posVideo.currentTime = video.currentTime + by;
      }
      if (this.currentTime === video.duration ) {
        this.playBtnMessage = 'PLAY';
      }
    },
  },
  template: `
    <v-container>
      <v-toolbar>
        <v-toolbar-side-icon></v-toolbar-side-icon>
      </v-toolbar>
      <v-card>
        <v-card-title>
          <video id="preVideo"
            v-bind:src=url
            v-on:click="play">
          </video>
          <video id="nowVideo"
            v-bind:src=url
            v-on:click="play"
            v-on:timeupdate="getCurrentInfo">
          </video>
          <video id="posVideo"
            v-bind:src=url
            v-on:click="play">
          </video>
        </v-card-title>
        <v-card-title>
          <p>時刻: {{currentTime}}</p>
          <p>フレーム数: {{currentFrame}}</p>
        </v-card-title>
        <v-card-actions>
          <v-btn flat color="orange" v-on:click=play>
            {{ playBtnMessage }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  `
 })



/* アプリケーション本体 */
new Vue({
  el: '#app',
  data: () => ({
    drawer: false,
    url: './misc/17.mp4',
    by: 0.1,
    fps: 13.84
  })
})
