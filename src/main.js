
/* 動画用コンポーネント */
Vue.component(
  'video-player', {
    data: function () {
      return {
        currentTime: 0,
        currentFrame: 0,
        playBtnIcon: 'play_arrow',
        videoCSS: {
          width: '100%',
          height: 'auto'
        },
        wavesurferSettings: {
          container: '#waveform',
          waveColor: 'violet',
          progressColor: 'purple',
          minPxPerSec: 200,
          scrollParent: true,
          minimap: true,
          normalize: true
        },
        regionSettiong: {
          regions: [],
          dragSelection: {
            slop: 5
          },
          color: 'rgba(255,183,77, 0.3)'
        },
        spectrogramSetting: {
          container: '#wave-spectrogram',
          fftSamples: 512,
          labels: true
        },
        timelineSetting: {
          container: '#wave-timeline'
        },
        minimapSetting: {
          height: 30,
          waveColor: '#ddd',
          progressColor: '#999',
          cursorColor: '#999'
        },
        wavesurfer: null // wavesurfer クラス
      }
    },
    props: [
      'url',
      'fps',
      'by'
    ],
    computed: {
      isReady: function () {
        // 音声の読み込みが終了したか否かを判定します.
        if (this.wavesurfer !== null) {
          return this.wavesurfer.isReady
        } else {
          return false
        }
      }
    },
    watch: {
      'url': function () {
        this.regionSettiong.regions = []
        this.$nextTick(() => {
          // WaveSurfer の初期設定
          this.wavesurfer.destroy()
          const setting = Object.assign({}, this.wavesurferSettings)
          setting.plugins = [
            WaveSurfer.regions.create(this.regionSettiong),
            WaveSurfer.minimap.create(this.minimapSetting),
            WaveSurfer.timeline.create(this.timelineSetting),
            WaveSurfer.spectrogram.create(this.spectrogramSetting)
          ]
          this.wavesurfer = WaveSurfer.create(setting)
          this.wavesurfer.load(this.url)
          this.playBtnIcon = 'play_arrow'
        })
      }
    },
    mounted () {
      this.$nextTick(() => {
        // WaveSurfer の初期設定
        const setting = Object.assign({}, this.wavesurferSettings)
        setting.plugins = [
          WaveSurfer.regions.create(this.regionSettiong),
          WaveSurfer.minimap.create(this.minimapSetting),
          WaveSurfer.timeline.create(this.timelineSetting),
          WaveSurfer.spectrogram.create(this.spectrogramSetting)
        ]
        this.wavesurfer = WaveSurfer.create(setting)
        this.wavesurfer.load(this.url)
        this.playBtnIcon = 'play_arrow'
      })
    },
    methods: {
      play: function (event) {
        const video = document.getElementById('nowVideo')
        this.wavesurfer.playPause()
        if (video.paused) {
          video.play()
          this.playBtnIcon = 'pause'
        } else {
          video.pause()
          this.currentTime = video.currentTime
          this.playBtnIcon = 'play_arrow'
        }
        this.playing = video.paused
      },
      // 動画再生時の挙動
      getCurrentInfo: function (event) {
        const by = parseFloat(this.by)
        const video = document.getElementById('nowVideo')
        const preVideo = document.getElementById('preVideo')
        const posVideo = document.getElementById('posVideo')

        // 現在時刻の取得
        this.currentTime = video.currentTime
        this.currentFrame = Math.floor(video.currentTime * this.fps)

        if (this.currentTime > by) {
          preVideo.currentTime = video.currentTime - by
        }
        if (this.currentTime <= video.duration - by) {
          posVideo.currentTime = video.currentTime + by
        }
        if (this.currentTime === video.duration) {
          this.playBtnIcon = 'pause'
        }
      },
      // region 操作
      regionPlay: function (event) {
        let currentTime = null
        currentTime = this.wavesurfer.getCurrentTime()
        for (const key in this.wavesurfer.regions.list) {
          const region = this.wavesurfer.regions.list[key]
          if (currentTime > region.start && currentTime < region.end) {
            console.log(region)
          }
        }
      },
      regionUpdate: function (event) {
        // 表示 regions を更新する
        console.log(event)

        // 現状の  id 一覧を取得
        const regionList = this.regionSettiong.regions
        const registeredIds = []
        for (const i in regionList) {
          registeredIds.push(regionList[i].id)
        }

        const regions = this.wavesurfer.regions.list
        for (const key in regions) {
          const region = regions[key]
          if (registeredIds.indexOf(region.id) === -1) {
            // 新規 region が波形レイヤーに存在する場合のみ追加
            const duration = region.end - regions.start
            const item = {
              start: region.start,
              end: region.end,
              data: {
                duration: duration,
                contents: null
              },
              id: region.id
            }
            regionList.push(item)
          } else {
            // 開始, 終了時刻は異なる場合は反映
            const index = registeredIds.indexOf(region.id)
            const oldRegion = regionList[index]
            if (oldRegion.start !== region.start || oldRegion.end !== region.end) {
              regionList[index].start = region.start
              regionList[index].end = region.end
            }
          }
          regionList.sort(function (a, b) {
            if (a.start < b.start) return -1
            if (a.start > b.start) return 1
            return 0
          })
        }
      },
      syncVideo: function (event) {
        const by = parseFloat(this.by)
        this.currentTime = this.wavesurfer.getCurrentTime()
        this.currentFrame = Math.floor(this.currentTime * this.fps)

        const video = document.getElementById('nowVideo')
        const preVideo = document.getElementById('preVideo')
        const posVideo = document.getElementById('posVideo')
        video.currentTime = this.currentTime
        if (this.currentTime > by) {
          preVideo.currentTime = this.currentTime - by
        }
        if (this.currentTime <= video.duration - by) {
          posVideo.currentTime = this.currentTime + by
        }
      },
      reRender: function () {
        this.$nextTick(() => {
          // WaveSurfer の初期設定
          this.wavesurfer.destroy()
          const setting = Object.assign({}, this.wavesurferSettings)
          setting.plugins = [
            WaveSurfer.regions.create(this.regionSettiong),
            WaveSurfer.spectrogram.create(this.spectrogramSetting)
          ]
          this.wavesurfer = WaveSurfer.create(setting)
          this.wavesurfer.load(this.url)
          this.playBtnIcon = 'play_arrow'
        })
      }
    },
    template: `
      <v-layout row wrap>
        <v-flex xs8>
          <v-container>
            <v-card text-xs-center
              class="scroll-y"
              style="min-height:85vh; max-height:85vh;"
              contextmenu="player-menu">
              <!-- 右クリック時のオリジナルメニュー: 現状 firefox のみ対応 --> 
              <menu type="context" id="player-menu">
                <menuitem label="Play or Pause" v-on:click="play"
                  icon="icons/baseline-play_circle_outline-24px.svg">
                </menuitem>
                <menuitem label="Loop now selected" v-on:click="alert('こんにちは')"
                  icon="icons/baseline-repeat-24px.svg">
                </menuitem>
                <menu label="Move to...">
                  <menuitem label="Skip next (1sec)"
                    icon="icons/baseline-skip_next-24px.svg"
                    onclick="window.open('//twitter.com/intent/tweet?text=' + window.location.href);">
                  </menuitem>
                  <menuitem label="Skip next (1sec)"
                    icon="icons/baseline-skip_previous-24px.svg"
                    onclick="window.open('//facebook.com/sharer/sharer.php?u=' + window.location.href);">
                  </menuitem>
                  <menuitem label="Move strat of video"
                    icon="icons/baseline-fast_rewind-24px.svg"
                    onclick="window.open('//twitter.com/intent/tweet?text=' + window.location.href);">
                  </menuitem>
                  <menuitem label="Move end of video"
                    icon="icons/baseline-fast_forward-24px.svg"
                    onclick="window.open('//facebook.com/sharer/sharer.php?u=' + window.location.href);">
                  </menuitem>
                </menu>
                <menu label="Edio region...">
                  <menuitem label="Add ..."
                    icon="icons/baseline-add_circle_outline-24px.svg"
                    onclick="window.open('//twitter.com/intent/tweet?text=' + window.location.href);">
                  </menuitem>
                  <menuitem label="Remove ..."
                    icon="icons/baseline-remove_circle_outline-24px.svg"
                    onclick="window.open('//facebook.com/sharer/sharer.php?u=' + window.location.href);">
                  </menuitem>
                </menu>
                <menu label="Spectorum settings...">
                  <menuitem label="Zoom in ..."
                    icon="icons/baseline-zoom_in-24px.svg"
                    onclick="window.open('//twitter.com/intent/tweet?text=' + window.location.href);">
                  </menuitem>
                  <menuitem label="Zoom out ..."
                    icon="icons/baseline-zoom_out-24px.svg"
                    onclick="window.open('//facebook.com/sharer/sharer.php?u=' + window.location.href);">
                  </menuitem>
                </menu>
              </menu>

              <v-toolbar color="accent" dark>
                <v-toolbar-title>{{url}}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-title>時刻: {{currentTime}}</v-toolbar-title>
                <v-toolbar-title>フレーム数: {{currentFrame}}</v-toolbar-title>
              </v-toolbar>

              <!-- 動画表示 --> 
              <v-card-title grid-list-md v-if="isReady">
                <v-layout row justify-left align-left>
                  <v-layout row wrap>
                    <v-flex xs2>
                      <video id="preVideo" muted
                        v-bind:src=url
                        v-bind:style="videoCSS"
                        v-on:click="play">
                      </video>
                    </v-flex>
                    <v-flex xs2>
                      <video id="nowVideo" muted
                        v-bind:src=url
                        v-bind:style="videoCSS"
                        v-on:click="play"
                        v-on:timeupdate="getCurrentInfo">
                      </video>
                    </v-flex>
                    <v-flex xs2>
                      <video id="posVideo" muted
                        v-bind:src=url
                        v-bind:style="videoCSS"
                        v-on:click="play">
                      </video>
                    </v-flex>
                    <v-flex xs6>
                      <v-container>
                        <v-text-field label="minPx per sec"
                          v-model="wavesurferSettings.minPxPerSec"
                          suffix="per sec">
                        </v-text-field>
                        <v-text-field label="fft sample"
                          v-model="spectrogramSetting.fftSamples"
                          suffix="sample">
                        </v-text-field>
                      </v-container>
                    </v-flex>
                  </v-layout>
                </v-layout>
              </v-card-title>
              <v-card-title align-center v-else>
                <v-container text-xs-center>
                  <v-progress-circular :size="100" :width="7" indeterminate color="purple">
                  </v-progress-circular>
                  <p>Now loading...</p>
                </v-container>
              </v-card-title>

              <!-- 操作ボタン --> 
              <v-card-actions v-if="isReady">
                <v-btn icon color="accent" v-on:click=play>
                  <v-tooltip bottom>
                    <v-icon slot="activator">{{playBtnIcon}}</v-icon>
                    <span>Play or Pause</span>
                  </v-tooltip>
                </v-btn>
                <v-btn icon color="accent" v-on:click="reRender">
                  <v-tooltip bottom>
                    <v-icon slot="activator">mdi-autorenew</v-icon>
                    <span>Redraw Sound</span>
                  </v-tooltip>
                </v-btn>
              </v-card-actions>

              <!-- 音声表示 --> 
              <v-container>
                <div id="wave-spectrogram"></div>
                <div id="wave-timeline"></div>
                <div id="waveform"
                  v-on:mouseup.exact="regionUpdate"
                  v-on:click="syncVideo"
                  @click.ctrl.exact="regionPlay">
                </div>
              </v-container>
            </v-card>
          </v-container>
        </v-flex>

        <v-flex xs4 v-if="isReady">
          <v-container>
            <v-card
              style="min-height:40vh; max-height:40vh;"
              class="scroll-y">
              <v-toolbar color="accent" dark>
                <v-toolbar-title>Region</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon>
                  <v-icon>view_module</v-icon>
                </v-btn>
              </v-toolbar>
              <v-list three-line subheader v-if="regionSettiong.regions.length !== 0">
                <template v-for="(item, index) in regionSettiong.regions">
                  <v-list-tile :key="item.id">
                    <v-list-tile-content>
                      <v-list-tile-sub-title>
                        <v-text-field
                          label="contents"
                          v-model="item.data.contents"
                          flat solo>
                        </v-text-field>
                      </v-list-tile-sub-title>
                      <v-list-tile-sub-title>
                        START: {{ item.start.toFixed(3) }} sec
                      </v-list-tile-sub-title>
                      <v-list-tile-sub-title>
                        END: {{ item.end.toFixed(3) }} sec
                      </v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <v-list-tile-action-text>
                        {{ (item.end - item.start).toFixed(3) }} sec
                      </v-list-tile-action-text>
                      <v-btn outline small icon color="indigo">
                        <v-icon>play_arrow</v-icon>
                      </v-btn>
                      <v-btn outline small icon color="indigo">
                        <v-icon>delete_outline</v-icon>
                      </v-btn>
                    </v-list-tile-action>
                  </v-list-tile>
                  <v-divider></v-divider>
                </template>
              </v-list> 
              <v-card-title v-else>
                <v-container align-center>
                  <v-alert :value="true" type="warning">
                    No Regions
                  </v-alert>
                </v-container>
              </v-card-title>
            </v-card>
          </v-container>
          <v-container>
            <v-card
              style="min-height:41vh; max-height:41vh;"
              class="scroll-y">
              <v-toolbar color="accent" dark>
                <v-toolbar-title>Point</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon>
                  <v-icon>view_module</v-icon>
                </v-btn>
              </v-toolbar>
              <v-list three-line subheader v-if="regionSettiong.regions.length !== 0">
                <template v-for="(item, index) in regionSettiong.regions">
                  <v-list-tile :key="item.id">
                    <v-list-tile-content>
                      <v-list-tile-sub-title>
                        <v-text-field
                          label="contents"
                          v-model="item.data.contents"
                          flat solo>
                        </v-text-field>
                      </v-list-tile-sub-title>
                      <v-list-tile-sub-title>
                        START: {{ item.start.toFixed(3) }} sec
                      </v-list-tile-sub-title>
                      <v-list-tile-sub-title>
                        END: {{ item.end.toFixed(3) }} sec
                      </v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <v-list-tile-action-text>
                        {{ (item.end - item.start).toFixed(3) }} sec
                      </v-list-tile-action-text>
                      <v-btn outline small icon color="indigo">
                        <v-icon>play_arrow</v-icon>
                      </v-btn>
                      <v-btn outline small icon color="indigo">
                        <v-icon>delete_outline</v-icon>
                      </v-btn>
                    </v-list-tile-action>
                  </v-list-tile>
                  <v-divider></v-divider>
                </template>
              </v-list> 
              <v-card-title v-else>
                <v-container align-center>
                  <v-alert :value="true" type="warning">
                    No Regions
                  </v-alert>
                </v-container>
              </v-card-title>
            </v-card>
          </v-container>

        </v-flex>
      </v-layout>
    `
  }
)

/* アプリケーション本体 */
new Vue({
  el: '#app',
  data: {
    files: [
      {
        url: './misc/10.mp4',
        fps: 13.84,
        by: 0.1
      },
      {
        url: './misc/17.mp4',
        fps: 13.84,
        by: 0.1
      }
    ],
    target: {
      url: null,
      fps: null,
      by: null
    },
    drawer: null
  },
  mounted () {
    this.target = this.files[0]
  },
  methods: {
    selectFile: function (target) {
      this.target = target
    }
  }
})
