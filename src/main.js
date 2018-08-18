// 編集用設定
const fps = 13.78310345
const files = [
  // { url: './misc/sample.mp4', 'fps': 13.78310345 },
  // { url: './misc/sample1.mp4', 'fps': 13.78310345 },
  // { url: './misc/sample2.mp4', 'fps': 13.78310345 }
]

/* 動画マーク用コンポーネント */
const canvasEditor = Vue.component(
  'canvas-editor', {
    data: function () {
      return {
        dialog: false,
        redy: false,
        marks: [],
        regions: [],
        markSetting: {
          color: 'rgba(244,81,30 ,1)',
          pointSize: 5,
          maxSize: 68,
          headers: [
            {
              text: 'ID',
              align: 'left',
              sortable: false,
              value: 'id'
            },
            { text: 'x', value: 'x' },
            { text: 'y', value: 'y' }
          ]
        },
        markon: null,
        isDrag: false,
        backgroundToggle: true,
        colors: [
          { text: 'red', val: 'rgba(244,81,30 ,1)' },
          { text: 'blue', val: 'rgba(41,128,185 ,1)' },
          { text: 'green', val: 'rgba(46,204,113 ,1)' }
        ],
        video: null,
        cachename: null,
        canvasWrapperStyle: {
          position: 'relative',
          'min-height': '83vh'
        },
        canvasStyle: {
          cursor: 'default',
          position: 'absolute',
          border: 'solid 3px #000000',
          top: 0,
          left: 0
        }
      }
    },
    props: [
      'canvas', 'basename'
    ],
    watch: {
      backgroundToggle: function (val) {
        const canvas = this.$refs['video-canvas']
        canvas.width = this.video.offsetWidth * this.canvas.scale
        canvas.height = this.video.offsetHeight * this.canvas.scale
        if (val === false) {
          canvas.getContext('2d').clearRect(
            0, 0, canvas.width, canvas.height
          )
        } else {
          canvas.getContext('2d').drawImage(
            this.video, 0, 0, canvas.width, canvas.height
          )
        }
      },
      isDrag: function (val) {
        if (val === true) {
          this.canvasStyle.cursor = 'move'
        } else {
          this.canvasStyle.cursor = 'default'
        }
      },
      marks: function (val) {
        localStorage.setItem(
          this.cachename, JSON.stringify(this.marks)
        )
      }
    },
    // computed: {
    //   cachename: function () {
    //     if (this.canvas.target !== undefined) {
    //       return 'cache_' + this.basename + this.canvas.target.data.frame
    //     } else {
    //       return null
    //     }
    //   }
    // },
    methods: {
      edit: function (video) {
        /**
         * 画像領域の初期化を行います
         */
        const canvas = this.$refs['video-canvas']
        const markCanvas = this.$refs['mark-canvas']
        canvas.width = video.offsetWidth * this.canvas.scale
        canvas.height = video.offsetHeight * this.canvas.scale
        markCanvas.width = canvas.width
        markCanvas.height = canvas.height
        video.currentTime = this.canvas.target.data.time

        if (this.canvas.target !== undefined) {
          this.cachename = 'cache_' + this.basename + this.canvas.target.data.frame
        }
        const cache = JSON.parse(
          localStorage.getItem(this.cachename)
        )
        if (cache === null) {
          this.marks = []
        } else {
          this.marks = cache
        }
        setTimeout(() => {
          if (cache.length > 0) {
            for (const index in this.cache) {
              const item = this.marks[index]
              this.renderMark(item.x, item.y, this.markSetting.color)
            }
          }
          canvas.getContext('2d').drawImage(
            video, 0, 0, canvas.width, canvas.height
          )
          this.redy = true
        }, 1000)
        this.dialog = true
        this.redy = false
        this.video = video
      },
      downloadImage (elmname) {
        const canvas = this.$refs[elmname]
        const type = elmname.split('-')[0]
        const filename = this.basename + '_' + this.canvas.target.data.frame + '_' + type + '.png'
        downloadPng(canvas, filename)
      },
      renderMark: function (x, y, color) {
        /**
         * mark-canvas に point を描画します.
         *
         * この関数が画像領域の描画に注力することに注意してください.
         */
        const canvas = this.$refs['mark-canvas']
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(
          x, y, this.markSetting.pointSize, 0,
          Math.PI * 2, false
        )
        ctx.fill()
      },
      isMarked: function (event) {
        /**
         * 画像領域ホバー中に, 既に描画が行われているか否かを判定します.
         */
        if (this.isDrag === false) {
          let isMarked = false
          let markon = null
          const rect = this.$refs['mark-canvas'].getBoundingClientRect()
          const x = event.clientX - rect.left
          const y = event.clientY - rect.top
          for (const index in this.marks) {
            const item = this.marks[index]
            const diffx = Math.abs(x - item.x)
            const diffy = Math.abs(y - item.y)
            if (diffx < 3 && diffy < 3) {
              isMarked = true
              markon = item
            }
          }
          if (isMarked === true) {
            this.canvasStyle.cursor = 'move'
            this.markon = markon
          } else {
            this.canvasStyle.cursor = 'default'
            this.isDrag = false
            this.markon = null
          }
        }
      },
      markDrag: function (event) {
        if (this.markon !== null) {
          this.isDrag = true
          this.markRemove(this.markon.id)
        } else {
          this.isDrag = false
        }
      },
      markCange: function (event) {
        this.isDrag = false
        this.markon = null
      },
      markAdd: function (event) {
        /**
         * 画像領域クリック時に point をレンダーし, その情報を記録します.
         */
        const rect = this.$refs['mark-canvas'].getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        if (this.marks.length < this.markSetting.maxSize) {
          this.marks.push({
            id: generateUuid(),
            x: x, y: y
          })
          this.marks.sort(function (a, b) {
            if (a.y > b.y) return 1
            if (a.y < b.y) return -1
            return 0
          })
          this.marks.sort(function (a, b) {
            if (a.x > b.x) return 1
            if (a.x < b.x) return -1
            return 0
          })
          this.renderMark(x, y, this.markSetting.color)
        }
        this.isDrag = false
        this.markon = null
      },
      markDescription: function (id) {
        const color = 'rgba(241,196,15 ,1)'
        const canvas = this.$refs['mark-canvas']
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        for (const index in this.marks) {
          const item = this.marks[index]
          if (item.id === id) {
            this.renderMark(item.x, item.y, color)
          } else {
            this.renderMark(item.x, item.y, this.markSetting.color)
          }
        }
      },
      markDescriptionNomal: function (event) {
        const canvas = this.$refs['mark-canvas']
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        for (const index in this.marks) {
          const item = this.marks[index]
          this.renderMark(item.x, item.y, this.markSetting.color)
        }
      },
      markRemove: function (id) {
        const canvas = this.$refs['mark-canvas']
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        for (const index in this.marks) {
          const item = this.marks[index]
          if (item.id === id) {
            this.marks.splice(index, 1)
          }
        }
        for (const index in this.marks) {
          const item = this.marks[index]
          this.renderMark(item.x, item.y, this.markSetting.color)
        }
      },
      markDownload () {
        /**
         * point として記述した内容を CSV に変換し
         * ダウンロードします.
         *
         */
        const canvas = this.$refs['video-canvas']
        console.log('Mark: Download')
        let csv = 'basename,time,frame,x,y,width,height\n'
        this.marks.forEach(item => {
          const line = [
            this.basename,
            this.canvas.target.data.time,
            this.canvas.target.data.frame,
            item.x, item.y,
            canvas.width,
            canvas.height
          ].join(',') + '\n'
          csv += line
        })
        const filename = [
          // this.basename,
          // this.currentFrame,
          'mark.csv'
        ].join('_')
        downloadCsv(csv, filename)
      },
      regionAdd: function (event) {
        console.log('ctrl')
      }
    },
    template: `
      <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-toolbar dark color="primary">
          <v-toolbar-title v-if="canvas.target">
            Time: {{canvas.target.data.time}} sec
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu offset-y>
            <v-btn icon dark slot="activator">
              <v-icon>cloud_download</v-icon>
            </v-btn>
            <v-list>
              <v-subheader>Video</v-subheader>
              <v-divider></v-divider>
              <v-list-tile @click="downloadImage('video-canvas')">
                <v-list-tile-title>PNG</v-list-tile-title>
              </v-list-tile>
              <v-divider></v-divider>
              <v-subheader>Marks</v-subheader>
              <v-divider></v-divider>
              <v-list-tile @click="markDownload">
                <v-list-tile-title>CSV</v-list-tile-title>
              </v-list-tile>
              <v-list-tile @click="downloadImage('mark-canvas')">
                <v-list-tile-title>PNG</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
          <v-btn icon dark @click.native="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card>
          <v-container fluid grid-list-md>
            <v-layout row wrap>
              <v-flex xs6>
                <v-card>
                  <v-card-title>
                    <div v-bind:style="canvasWrapperStyle" v-show="redy">
                      <canvas v-bind:style="canvasStyle" ref="video-canvas" id="video-canvas"></canvas>
                      <canvas v-bind:style="canvasStyle" ref="mark-canvas" id="mark-canvas"
                        @mousemove="isMarked"
                        @mousedown="markDrag"
                        @mouseup="markCange"
                        @click="markAdd">
                      </canvas>
                    </div>
                    <v-container text-xs-center v-if="!redy">
                      <v-progress-circular :size="100" :width="7" indeterminate color="purple">
                      </v-progress-circular>
                      <p>Now loading...</p>
                    </v-container>
                  </v-card-title>
                </v-card>
              </v-flex>
              <v-flex v-if="dialog">
                <v-card>
                  <v-card-title primary-title>
                    <v-flex xs12>
                      <h3 class="headline mb-0">Settings</h3>
                      <v-form>
                        <v-select
                          :items="colors"
                          v-model="markSetting.color"
                          label="Color"
                          item-text="text"
                          item-value="val"
                          single-line>
                        </v-select>
                        <v-text-field
                          v-model="markSetting.pointSize"
                          label="Point Size"
                          required>
                        </v-text-field>
                        <v-text-field
                          v-model="markSetting.maxSize"
                          label="Max(n)"
                          required>
                        </v-text-field>
                        <v-switch
                          label="show backgroud"
                          v-model="backgroundToggle">
                        </v-switch>
                      </v-form>
                    </v-flex>
                  </v-card-title>
                  <v-card-title>
                    <div>
                      <h3 class="headline mb-0">Detail</h3>
                      <div class="title">特徴点: {{marks.length}}/{{markSetting.maxSize}}</div>
                    </div>
                  </v-card-title>
                  <v-data-table
                    :headers="markSetting.headers"
                    :items="marks"
                    class="elevation-1">
                    <template slot="headerCell" slot-scope="props">
                      <v-tooltip bottom>
                        <span slot="activator">
                          {{ props.header.text }}
                        </span>
                        <span>
                          {{ props.header.text }}
                        </span>
                      </v-tooltip>
                    </template>
                    <template slot="items" slot-scope="props">
                      <td
                        @mouseenter="markDescription(props.item.id)"
                        @mouseleave="markDescriptionNomal">
                        {{ props.item.id }}
                      </td>
                      <td class="text-xs-right"
                        @mouseenter="markDescription(props.item.id)"
                        @mouseleave="markDescriptionNomal">
                        {{ props.item.x }}
                      </td>
                      <td class="text-xs-right"
                        @mouseenter="markDescription(props.item.id)"
                        @mouseleave="markDescriptionNomal">
                        {{ props.item.y }}
                      </td>
                      <td class="text-xs-right"
                        @mouseenter="markDescription(props.item.id)"
                        @mouseleave="markDescriptionNomal">
                        <v-btn color="error" @click="markRemove(props.item.id)">
                          <v-icon>remove_circle</v-icon>
                        </v-btn>
                      </td>
                    </template>
                  </v-data-table>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-dialog>
    `
  }
)

/* 動画用コンポーネント */
Vue.component(
  'video-player', {
    components: {
      'canvasEditor': canvasEditor
    },
    data: function () {
      return {
        currentTime: 0,
        currentFrame: 0,
        playBtnIcon: 'play_arrow',
        videoCSS: {
          width: '100%',
          height: 'auto'
        },
        dropZone: {
          border: '5px solid blue',
          width: '200px',
          height: '100px'
        },
        wavesurferSettings: {
          container: '#wave-form',
          waveColor: 'violet',
          progressColor: 'purple',
          minPxPerSec: 200,
          scrollParent: true,
          minimap: true,
          normalize: true
        },
        regionSetting: {
          dragSelection: {
            slop: 5
          },
          color: 'rgba(255,183,77, 0.3)',
          data: {
            type: 'region'
          }
        },
        spectrogramSetting: {
          container: '#wave-spectrogram',
          fftSamples: 512,
          brightness: 1,
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
        points: [],
        regions: [],
        marks: [],
        cache: {},
        cacheUploadDialog: false,
        dialog: false,
        wavesurfer: null // wavesurfer クラス
      }
    },
    props: [
      'url', 'fps', 'filename'
    ],
    computed: {
      basename: function () {
        const pathes = this.url.split('/')
        if (pathes[0].match('blob')) {
          const fname = this.filename
          return fname.split('.')[0]
        } else {
          const fname = pathes[pathes.length - 1]
          return fname.split('.')[0]
        }
      },
      cachename: function () {
        return 'cache_' + this.basename
      },
      canvas: function () {
        const scale = 2.5
        return {
          target: null,
          scale: scale
        }
      },
      skipLength: function () {
        const len = 1 / this.fps
        return parseFloat(len.toFixed(4))
      },
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
        const url = this.url
        // 種々初期化
        const cache = JSON.parse(
          localStorage.getItem(this.cachename)
        )
        if (cache === null) {
          this.cache = {}
          this.regions = []
          this.points = []
        } else {
          this.cache = cache
          this.points = this.cache.points
          this.regions = this.cache.regions
        }
        this.wavesurfer.destroy()
        // リロード
        this.load(url)
      },
      'points': function (val) {
        this.cache.points = val
        localStorage.setItem(
          this.cachename, JSON.stringify(this.cache)
        )
      },
      'regions': function (val) {
        this.cache.regions = val
        localStorage.setItem(
          this.cachename, JSON.stringify(this.cache)
        )
      }
    },
    mounted () {
      const url = this.url
      const cache = JSON.parse(
        localStorage.getItem(this.cachename)
      )
      if (cache !== null) {
        console.log(cache)
        this.cache = cache
        this.points = this.cache.points
        this.regions = this.cache.regions
      }
      this.load(url)
    },
    methods: {
      // 基本操作
      load: function (url) {
        /**
         * url で指定されたファイルの音声波形データを
         * 作成します.
         *
         * wavesurfer のレンダーは直接の DOM 操作が
         * 必要であるため操作は nextTick 内に記述します.
         */
        this.regionSetting.regions = this.regions.concat(
          this.points
        )
        this.$nextTick(() => {
          const setting = Object.assign(
            {}, this.wavesurferSettings
          )
          setting.skipLength = this.skipLength
          setting.plugins = [
            WaveSurfer.regions.create(this.regionSetting),
            WaveSurfer.minimap.create(this.minimapSetting),
            WaveSurfer.timeline.create(this.timelineSetting),
            WaveSurfer.spectrogram.create(
              this.spectrogramSetting
            )
          ]
          this.wavesurfer = WaveSurfer.create(setting)
          this.wavesurfer.load(url)
        })
        this.playBtnIcon = 'play_arrow'
      },
      play: function (event) {
        if (event.type === 'keyup') {
          event.preventDefault()
        }
        const video = this.$refs.nowVideo
        if (video.paused) {
          video.play()
          this.wavesurfer.play()
          this.playBtnIcon = 'pause'
        } else {
          video.pause()
          this.wavesurfer.pause()
          this.currentTime = video.currentTime
          this.playBtnIcon = 'play_arrow'
        }
        this.playing = video.paused
      },
      skipForward: function (event) {
        this.wavesurfer.skipForward()
        this.syncVideo(event)
      },
      skipBackward: function (event) {
        this.wavesurfer.skipBackward()
        this.syncVideo(event)
      },
      startTo: function (event) {
        this.wavesurfer.seekAndCenter(0)
        this.syncVideo(event)
      },
      endTo: function (event) {
        this.wavesurfer.seekAndCenter(1)
        this.syncVideo(event)
      },
      moveTo: function (time) {
        const video = this.$refs.nowVideo
        const duration = this.wavesurfer.getDuration()
        this.wavesurfer.seekAndCenter(time / duration)
        video.currentTime = time
      },
      // 動画再生時の挙動
      syncVideos: function (event) {
        const video = this.$refs.nowVideo
        const preVideo = this.$refs.preVideo
        const posVideo = this.$refs.posVideo
        this.currentTime = parseFloat(video.currentTime)
        this.currentFrame = Math.floor(
          video.currentTime * this.fps
        )
        if (this.currentTime > this.skipLength) {
          preVideo.currentTime = this.currentTime - this.skipLength
        } else {
          preVideo.currentTime = 0
        }
        if (this.currentTime + this.skipLength <= video.duration) {
          posVideo.currentTime = this.currentTime + this.skipLength
        } else {
          posVideo.currentTime = video.duration
        }
        if (this.currentTime === video.duration) {
          this.playBtnIcon = 'play_arrow'
        }
      },
      // 音声波形操作
      syncVideo: function (event) {
        setTimeout(() => {
          const video = this.$refs.nowVideo
          const currentTime = parseFloat(
            this.wavesurfer.getCurrentTime()
          )
          video.currentTime = currentTime
        }, 0.1)
      },
      reRender: function () {
        const url = this.url
        this.$nextTick(() => {
          // WaveSurfer の初期設定
          this.wavesurfer.destroy()
          this.load(url)
        })
      },
      // canvas 操作
      edit: function (point) {
        const video = this.$refs.nowVideo
        this.canvas.target = point
        this.$refs['canvas-editor'].edit(video)
        this.moveTo(point.data.time)
      },
      // point 操作
      pointAdd: function (event) {
        /**
         * HTML: id="wave-form" 要素を ctrl+click した場合に
         * wave-form の現在値の情報を取得し,
         * this.points に追加します.
         */
        this.$nextTick(() => {
          setTimeout(() => {
            const range = 1 / this.wavesurferSettings.minPxPerSec
            const currentTime = this.wavesurfer.getCurrentTime()
            const currentFrame = Math.floor(
              currentTime * this.fps
            )
            if (currentTime !== 0) {
              const item = {
                start: currentTime - range,
                end: currentTime + range,
                data: {
                  time: currentTime,
                  frame: currentFrame,
                  type: 'point'
                },
                attributes: {
                  label: null,
                  type: 'point',
                  highlight: false
                },
                color: 'rgba(103, 58, 183, 0.5)',
                resize: false,
                id: 'point_' + (this.points.length + 1)
              }
              this.points.push(item)
              // wavesurfer に登録
              this.wavesurfer.addRegion(item)
              this.wavesurfer.fireEvent(
                'region-updated', this.wavesurfer
              )
            }
          }, 0.2)
        })
      },
      pointUpdate: function (event) {
        /**
         * point 移動時に this.points に反映
         *
         * detail:
         *   wave-form にある regions をすべて確認し,
         *   this.points を更新します.
         * event: mouseup
         * target: id=wave-form
         */
        console.info('point: update')
        const range = 1 / this.wavesurferSettings.minPxPerSec
        const pointList = this.points
        const registeredIds = []

        // 現状の id 一覧を取得
        for (const i in pointList) {
          registeredIds.push(pointList[i].id)
        }
        const regions = this.wavesurfer.regions.list
        for (const key in regions) {
          const region = regions[key]
          if (
            region.data.type !== undefined &&
            region.data.type === 'point'
          ) {
            // 開始, 終了時刻は異なる場合は反映
            const index = registeredIds.indexOf(region.id)
            const oldPoint = pointList[index]
            if (
              oldPoint.start !== region.start ||
              oldPoint.end !== region.end
            ) {
              pointList[index].start = region.start
              pointList[index].end = region.end
              pointList[index].data = {
                time: region.start + range,
                frame: Math.floor(
                  (region.start + range) * this.fps
                )
              }
            }
          }
        }
        pointList.sort(function (a, b) {
          if (a.start < b.start) return -1
          if (a.start > b.start) return 1
          return 0
        })
      },
      pointDelete (point) {
        /**
         * point の削除
         *
         */
        console.info('point: delete')
        this.points = this.points.filter(
          x => x.id !== point.id
        )
        // wave-form から削除
        const regions = this.wavesurfer.regions.list
        for (const i in regions) {
          if (point.id === regions[i].id) {
            regions[i].remove()
            break
          }
        }
      },
      pointDownload () {
        /**
         * point として記述した内容を CSV に変換し
         * ダウンロードします.
         *
         */
        console.log('Point: Download')
        let csv = 'time,frame,text\n'
        this.points.forEach(item => {
          const line = item.data.time + ',' + item.data.frame + ',' + item.attributes.label + '\n'
          csv += line
        })
        const filename = [this.basename, 'point.csv'].join(
          '_'
        )
        downloadCsv(csv, filename)
      },
      // region 操作
      regionPlay: function (region) {
        console.log('REGION: PLAY')
        const video = this.$refs.nowVideo
        const duration = this.wavesurfer.getDuration()

        // 時刻合わせ
        video.currentTime = region.start
        this.currentTime = region.start
        this.wavesurfer.seekAndCenter(region.start / duration)

        // 再生
        video.play()
        for (const i in this.wavesurfer.regions.list) {
          if (
            this.wavesurfer.regions.list[i].id === region.id
          ) {
            this.wavesurfer.regions.list[i].play()
          }
        }
        // 停止
        const stop = function () {
          const video = document.getElementById('nowVideo')
          video.pause()
        }
        setTimeout(stop, (region.end - region.start) * 1000)
      },
      regionDelete: function (region) {
        console.log('REGION: DELETE')
        // LIST から削除
        this.regions = this.regions.filter(
          x => x.id !== region.id
        )
        // wave-form から削除
        const regions = this.wavesurfer.regions.list
        for (const i in regions) {
          if (region.id === regions[i].id) {
            regions[i].remove()
            break
          }
        }
      },
      regionUpdate: function (event) {
        /**
         * レギオン作成時にアノテーションリストを更新
         *
         * detail:
         *   wave-form にある regions をすべて確認し,
         *   this.regions を更新します.
         * event: mouseup
         * target: id=wave-form
         */
        console.info('region: update')
        const regionList = this.regions
        const registeredIds = []
        for (const i in regionList) {
          // 現状の id 一覧を取得
          registeredIds.push(regionList[i].id)
        }
        const regions = this.wavesurfer.regions.list
        for (const key in regions) {
          const region = regions[key]
          if (region.data.type !== undefined && region.data.type === 'region') {
            if (registeredIds.indexOf(region.id) === -1) {
              // 新規 region が波形レイヤーに存在する場合のみ追加
              const duration = region.end - regions.start
              const item = {
                start: region.start,
                end: region.end,
                color: region.color,
                data: {
                  type: 'region',
                  duration: duration
                },
                attributes: {
                  label: null,
                  type: 'region',
                  highlight: false
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
                regionList[index].data.duration = region.end - region.start
              }
            }
          }
        }
        regionList.sort(function (a, b) {
          if (a.start < b.start) return -1
          if (a.start > b.start) return 1
          return 0
        })
      },
      regionDownload () {
        /**
         * region として記述した内容を CSV に変換し, ダウンロードします.
         *
         */
        console.log('Region: Download')
        let csv = 'strat,end,text\n'
        this.regions.forEach(item => {
          const line = item.start + ',' + item.end + ',' + item.attributes.label + '\n'
          csv += line
        })
        const filename = [this.basename, 'region.csv'].join('_')
        downloadCsv(csv, filename)
      },
      // region, point の共通操作
      labelUpdate: function (item) {
        /**
         * @desc ラベル属性を決定します
         */
        this.$nextTick(() => {
          const regions = this.wavesurfer.regions.list
          for (const i in regions) {
            if (regions[i].id === item.id) {
              regions[i].update(item)
            }
          }
        })
      },
      waveformUpdate (event) {
        /**
         * @desc 音声波形のラベル情報と, LIST 情報を一致させる.
         */
        this.regionUpdate(event)
        this.pointUpdate(event)
      },
      cacheDownload (event) {
        /**
         * @desc 現在のキャシュを JSON でダウンロード
         */
        const filename = this.basename + '.json'
        downloadJson(this.cache, filename)
      },
      cacheImportOnFocus () {
        this.$refs.fileInput.click()
      },
      cacheImport (event) {
        /**
         * @desc Upload された Json で現状を上書き
         */
        const files = event.target.files
        const file = files[0]
        const vm = this
        const fr = new FileReader()
        fr.onload = function (e) {
          const cache = JSON.parse(e.target.result)
          vm.regions = cache.regions
          vm.points = cache.points
          console.log(vm.cache)
        }
        fr.readAsText(file)
        this.cacheUploadDialog = false
      }
    },
    template: `
      <v-container>
        <!-- 右クリック時のオリジナルメニュー --> 
        <menu type="context" id="player-menu">
          <menuitem label="Play or Pause"
            v-on:click="play"
            icon="icons/baseline-play_circle_outline-24px.svg">
          </menuitem>
          <menuitem label="Export cache"
            v-on:click="cacheDownload">
          </menuitem>
          <menuitem label="Import cache"
            v-on:click="cacheUploadDialog = true">
          </menuitem>
          <menu label="Move to...">
            <menuitem label="Skip next (1 frame)"
              icon="icons/baseline-skip_next-24px.svg"
              @click="skipForward">
            </menuitem>
            <menuitem label="Skip back (1 frame)"
              icon="icons/baseline-skip_previous-24px.svg"
              @click="skipBackward">
            </menuitem>
            <menuitem label="Move strat of video"
              icon="icons/baseline-fast_rewind-24px.svg"
              @click="startTo">
            </menuitem>
            <menuitem label="Move end of video"
              icon="icons/baseline-fast_forward-24px.svg"
              @click="endTo">
            </menuitem>
          </menu>
        </menu>

        <!-- キャシュ読み込みダイアログ --> 
        <v-dialog v-model="cacheUploadDialog"
          persistent max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">
                Import Cache
              </span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex>
                    <v-text-field
                      prepend-icon="attach_file"
                      single-line
                      @click.native="cacheImportOnFocus"
                      ref="fileTextField">
                    </v-text-field>
                    <input type="file"
                      :multiple="false"
                      ref="fileInput"
                      style="display:none;"
                      @change="cacheImport">
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
          </v-card>
        </v-dialog>

        <!-- プレイヤー本体 -->
        <v-layout row fill-height wrap>
          <v-flex d-flex>
            <v-card class="ma-2" text-xs-center contextmenu="player-menu">
              <v-toolbar color="accent" dark>
                <v-toolbar-title>{{basename}}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-title>
                  時刻: {{currentTime}}
                </v-toolbar-title>
                <v-toolbar-title>
                  フレーム数: {{currentFrame}}
                </v-toolbar-title>
              </v-toolbar>
              <!-- 動画表示 --> 
              <v-card-title grid-list-md v-if="isReady">
                <v-layout row justify-left align-left>
                  <v-layout row wrap>
                    <v-flex d-flex xs3>
                      <v-tooltip bottom>
                        <video slot="activator"
                          id="preVideo"
                          ref="preVideo" muted
                          v-bind:src=url
                          v-bind:style="videoCSS"
                          v-on:click="play">
                        </video>
                        <span>
                          {{skipLength}} sec 前の画像
                        </span>
                      </v-tooltip>
                    </v-flex>
                    <v-flex d-flex xs3>
                      <v-tooltip bottom>
                        <video slot="activator"
                          id="nowVideo"
                          ref="nowVideo"
                          muted
                          v-bind:src=url
                          v-bind:style="videoCSS"
                          v-on:click="play"
                          v-on:timeupdate="syncVideos">
                        </video>
                        <span>現在の画像</span>
                      </v-tooltip>
                    </v-flex>
                    <v-flex d-flex xs3>
                      <v-tooltip bottom>
                        <video slot="activator" id="posVideo" ref="posVideo" muted
                          v-bind:src=url
                          v-bind:style="videoCSS"
                          v-on:click="play">
                        </video>
                        <span>{{skipLength}} sec 後の画像</span>
                      </v-tooltip>
                    </v-flex>
                    <v-flex d-flex xs3>
                      <v-container>
                        <v-tooltip bottom>
                          <v-text-field slot="activator" label="fps"
                            v-model="fps"
                            suffix="fps">
                          </v-text-field>
                          <span>
                            動画の FPS を設定します
                          </span>
                        </v-tooltip>
                        <v-tooltip bottom>
                          <v-text-field slot="activator" label="brightness"
                            v-model="spectrogramSetting.brightness"
                            @keyup.enter="reRender"
                            suffix="times">
                          </v-text-field>
                          <span>
                            スペクトルグラムの明るさを調整します.
                            この値は 0 以上の数字で, 1 より大きくすると明るくなり,
                            0 以上 1 未満にすると暗くなります.
                          </span>
                        </v-tooltip>
                        <v-tooltip bottom>
                          <v-text-field slot="activator" label="minPx per sec"
                            @keyup.enter="reRender"
                            v-model="wavesurferSettings.minPxPerSec"
                            suffix="per sec">
                          </v-text-field>
                          <span>
                            1 秒を何ピクセルで表現するのかを決定します.
                            この値が大きいほど波形は拡大されます.
                          </span>
                        </v-tooltip>
                        <v-tooltip bottom>
                          <v-text-field  slot="activator" label="fft sample"
                            v-model="spectrogramSetting.fftSamples"
                            @keyup.enter="reRender"
                            suffix="sample">
                          </v-text-field>
                          <span>
                            FFT サンプリングレートです.
                            現在は動的に変更するとうまく動かないです.
                          </span>
                        </v-tooltip>
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
                <v-tooltip bottom>
                  <v-btn icon slot="activator"
                    color="accent" @click=startTo>
                    <v-icon>fast_rewind</v-icon>
                  </v-btn>
                  <span>move to start...</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <v-btn icon slot="activator"
                    color="accent" @click=skipBackward>
                    <v-icon>skip_previous</v-icon>
                  </v-btn>
                  <span>move to previous frame...</span>
                </v-tooltip>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                  <v-btn icon slot="activator"
                    color="accent" @click=play>
                    <v-icon>{{playBtnIcon}}</v-icon>
                  </v-btn>
                  <span>Play or Pause</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <v-btn icon slot="activator"
                    color="accent" @click="reRender">
                    <v-icon>refresh</v-icon>
                  </v-btn>
                  <span>Redraw Sound</span>
                </v-tooltip>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                  <v-btn icon slot="activator"
                    color="accent" @click=skipForward>
                    <v-icon>skip_next</v-icon>
                  </v-btn>
                  <span>move to next frame...</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <v-btn icon slot="activator"
                    color="accent" @click=endTo>
                    <v-icon>fast_forward</v-icon>
                  </v-btn>
                  <span>move to end...</span>
                </v-tooltip>
              </v-card-actions>
              <!-- 音声表示 --> 
              <v-card flat style="max-height:30vh;" class="scroll-y">
                <v-container>
                  <div id="wave-spectrogram"></div>
                  <div id="wave-timeline"></div>
                  <div id="wave-form"
                    @mouseup.exact="waveformUpdate"
                    @click="syncVideo"
                    @click.ctrl.exact="pointAdd"
                    @click.alt.exact="pointAdd"
                    @keyup.enter="pointAdd">
                  </div>
                </v-container>
              </v-card>
              <v-card-actions v-if="isReady">
                <v-btn flat color="orange"
                  v-on:click="cacheDownload">
                  Export Cache
                </v-btn>
                <v-btn flat color="orange"
                  v-on:click="cacheUploadDialog = true">
                  Import Cache
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
          <v-flex d-flex v-if="isReady">
            <v-layout justify-space-arround column fill-height>
              <v-flex d-flex >
                <v-card class="ma-2">
                  <v-toolbar color="accent" dark>
                    <v-toolbar-title>Region</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="regionDownload">
                      <v-icon>cloud_download</v-icon>
                    </v-btn>
                  </v-toolbar>
                  <v-card flat style="max-height:35vh; min-height:35vh;" class="scroll-y">
                    <v-list three-line subheader
                      v-if="regions.length !== 0">
                      <template v-for="(item, index) in regions">
                        <v-list-tile :key="item.id">
                          <v-list-tile-content>
                            <v-list-tile-sub-title>
                              <v-text-field
                                label="contents"
                                v-model="item.attributes.label"
                                @keyup.enter="labelUpdate(item)"
                                flat>
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
                            <v-btn outline icon color="indigo"
                              @click="regionPlay(item)">
                              <v-icon>play_arrow</v-icon>
                            </v-btn>
                          </v-list-tile-action>
                          <v-list-tile-action>
                            <v-btn outline icon
                              color="indigo"
                              @click="regionDelete(item)">
                              <v-icon>delete_outline</v-icon>
                            </v-btn>
                          </v-list-tile-action>
                        </v-list-tile>
                        <v-divider></v-divider>
                      </template>
                    </v-list> 
                    <v-list three-line subheader dark v-else>
                      <v-list-tile>
                        <v-list-tile-content>
                          <v-list-tile-sub-title>
                            No Region
                          </v-list-tile-sub-title>
                          <v-list-tile-sub-title></v-list-tile-sub-title>
                          <v-list-tile-sub-title></v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-list-tile-action></v-list-tile-action>
                        <v-list-tile-action></v-list-tile-action>
                      </v-list-tile>
                    </v-list> 
                  </v-card>
                </v-card>
              </v-flex>
              <v-flex d-flex>
                <v-card class="ma-2">
                  <v-toolbar color="accent" dark>
                    <v-toolbar-title>Point</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="pointDownload">
                      <v-icon>cloud_download</v-icon>
                    </v-btn>
                  </v-toolbar>
                  <v-card class="scroll-y" flat style="max-height:35vh;min-height:35vh;">
                    <v-list three-line subheader
                      v-if="points.length !== 0">
                      <template v-for="(item, index) in points">
                        <v-list-tile :key="item.id">
                          <v-list-tile-content>
                            <v-list-tile-sub-title>
                              <v-text-field
                                label="contents"
                                v-model="item.attributes.label"
                                @keyup.enter="labelUpdate(item)"
                                flat>
                              </v-text-field>
                            </v-list-tile-sub-title>
                            <v-list-tile-sub-title>
                              Time: {{ item.data.time.toFixed(3) }} sec
                            </v-list-tile-sub-title>
                            <v-list-tile-sub-title>
                              Frame: {{ item.data.frame.toFixed(0) }}
                            </v-list-tile-sub-title>
                          </v-list-tile-content>
                          <v-list-tile-action>
                            <v-btn outline icon color="indigo" @click="edit(item)">
                              <v-icon>edit</v-icon>
                            </v-btn>
                          </v-list-tile-action>
                          <v-list-tile-action>
                            <v-btn outline icon color="indigo" @click="pointDelete(item)">
                              <v-icon>delete_outline</v-icon>
                            </v-btn>
                          </v-list-tile-action>
                        </v-list-tile>
                        <v-divider></v-divider>
                      </template>
                    </v-list> 
                    <v-list v-else three-line subheader dark>
                      <v-list-tile>
                        <v-list-tile-content>
                          <v-list-tile-sub-title>
                            No Points
                          </v-list-tile-sub-title>
                          <v-list-tile-sub-title></v-list-tile-sub-title>
                          <v-list-tile-sub-title></v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-list-tile-action></v-list-tile-action>
                        <v-list-tile-action></v-list-tile-action>
                      </v-list-tile>
                    </v-list> 
                  </v-card>
                </v-card>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>

        <canvas-editor
          ref="canvas-editor"
          v-bind:canvas=canvas
          v-bind:basename=basename>
        </canvas-editor>
      </v-container>
    `
  }
)

/* アプリケーション本体 */
new Vue({
  el: '#app',
  data: {
    app: 'MRI Vuewer',
    version: 1.2,
    files: files,
    target: {
      url: null, fps: null
    },
    snackbar: {
      show: false,
      message: '',
      color: 'red darken-4',
      timeout: 6000
    },
    fileInputStyle: {
      height: '0px',
      visibility: 'hidden',
      position: 'absolute'
    },
    drawer: false
  },
  mounted () {
    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      // Great success! All the File APIs are supported.
    } else {
      this.snackbar.show = true
      this.snackbar.message = 'The File APIs are not fully supported in this browser.'
    }
    // load video if there are files
    if (this.files.length > 0) {
      this.target = this.files[0]
    }
  },
  methods: {
    selectFile: function (target) {
      this.target = target
      this.drawer = false
    },
    movieImport () {
      this.$refs.movieImport.click()
    },
    movieSelected (event) {
      event.preventDefault()
      const file = event.target.files[0]
      if (file.type.match('video')) {
        const url = window.URL.createObjectURL(file)
        const target = {
          name: file.name,
          url: url,
          fps: fps
        }
        this.files.push(target)
        this.target = target
      } else {
        this.snackbar.show = true
        this.snackbar.message = 'You should upload the video data.'
      }
    },
    clear: function () {
      localStorage.clear()
      this.drawer = false
    }
  }
})

/* 汎用関数 */
function generateUuid () {
  const chars = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.split('')
  for (let i = 0, len = chars.length; i < len; i++) {
    switch (chars[i]) {
      case 'x':
        chars[i] = Math.floor(Math.random() * 16).toString(16)
        break
      case 'y':
        chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16)
        break
    }
  }
  return chars.join('')
}

function downloadCsv (csv, filename) {
  const bom = new Uint8Array([0xEF, 0xBB, 0xBF])
  const blob = new Blob([bom, csv], { type: 'text/csv' })
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.target = '_blank'
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function downloadPng (canvas, filename) {
  const type = 'image/png'
  const data = canvas.toDataURL(type)
  const bin = window.atob(data.split(',')[1])
  const bom = new Uint8Array(bin.length)
  for (var i = 0; i < bin.length; i++) {
    bom[i] = bin.charCodeAt(i)
  }
  const blob = new Blob([bom.buffer], { type: type })
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.target = '_blank'
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function downloadJson (obj, filename) {
  const blob = new Blob(
    [JSON.stringify(obj, null, '  ')],
    { type: 'application/json' }
  )
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.target = '_blank'
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
