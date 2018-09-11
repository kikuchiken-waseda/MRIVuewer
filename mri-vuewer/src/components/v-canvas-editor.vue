<template>
  <v-dialog fullscreen hide-overlay
    v-model="dialog"
    transition="dialog-bottom-transition">
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
                  <canvas v-bind:style="canvasStyle"
                    ref="video-canvas" id="video-canvas">
                  </canvas>
                  <canvas v-bind:style="canvasStyle"
                    ref="mark-canvas" id="mark-canvas"
                    @mousemove="isMarked"
                    @mousedown="markDrag"
                    @mouseup="markCange"
                    @click="markAdd">
                  </canvas>
                </div>
                <v-container text-xs-center v-if="!redy">
                  <v-progress-circular
                    :size="100"
                    :width="7"
                    indeterminate color="purple">
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
                  <div class="title">
                    特徴点: {{marks.length}}/{{markSetting.maxSize}}
                  </div>
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
</template>

<script>
export default {
  name: 'CanvasEditor',
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
       const cache = JSON.parse(localStorage.getItem(this.cachename))
       if (cache === null) {
         this.marks = []
       } else {
         this.marks = cache
       }
       setTimeout(() => {
         canvas.getContext('2d').drawImage(
           video, 0, 0, canvas.width, canvas.height
         )
         if (cache.length > 0) {
           for (const index in this.cache) {
             const item = this.marks[index]
             this.renderMark(item.x, item.y, this.markSetting.color)
           }
         }
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
   }
}
</script>
