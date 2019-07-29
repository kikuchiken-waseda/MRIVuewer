// 編集用設定
const fps = 13.78310345;
const files = [
  // { url: './misc/6.mp4', 'fps': 13.78310345 },
];

/* 動画マーク用コンポーネント */
const canvasEditor = Vue.component("canvas-editor", {
  data: function() {
    return {
      dialog: false,
      redy: false,
      show_canvas_menu: false,
      is_drag: false,
      background_toggle: true,
      colors: [
        { text: "red", val: "rgba(244,81,30 ,1)" },
        { text: "pink", val: "rgba(233,30,99,1)" },
        { text: "purple", val: "rgba(156,39,176,1)" },
        { text: "deep purple", val: "rgba(103,58,183,1)" },
        { text: "indigo", val: "rgba(63,81,181,1)" },
        { text: "blue", val: "rgba(33,150,243,1)" },
        { text: "light blue", val: "rgba(3,169,244,1)" },
        { text: "cyan", val: "rgba(0,188,212,1)" },
        { text: "teal", val: "rgba(0,150,136,1)" },
        { text: "green", val: "rgba(76,175,80,1)" },
        { text: "light green", val: "rgba(139,195,74,1)" },
        { text: "lime", val: "rgba(205,220,57,1)" },
        { text: "yellow", val: "rgba(255,235,59,1)" },
        { text: "amber", val: "rgba(255,193,7,1)" },
        { text: "orange", val: "rgba(255,87,34,1)" },
        { text: "deep orange", val: "rgba(121, 85, 72, 1)" }
      ],
      canvas_style: {
        cursor: "default",
        position: "absolute",
        border: "solid 3px #000000",
        top: 0,
        left: 0
      },
      mark_setting: {
        color: "rgba(244,81,30 ,1)",
        pointSize: 5,
        maxSize: 68,
        headers: [
          {
            text: "ID",
            align: "left",
            sortable: false,
            value: "id"
          },
          { text: "x", value: "x" },
          { text: "y", value: "y" },
          { text: "color", value: "color" },
          { text: "actions", sortable: false }
        ]
      },
      video: null,
      cachename: null,
      marks: [],
      cursor: {
        x: null,
        y: null
      },
      is_on_mark: false,
      on_mark: {},
      regions: [],
      canvas_size: {}
    };
  },
  props: ["canvas", "basename"],
  watch: {
    background_toggle: function(val) {
      this.initCanvas();
      if (val === false) {
        const canvas = this.$refs["video-canvas"];
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      }
    },
    is_drag: function(val) {
      if (val === true) {
        this.canvas_style.cursor = "move";
      } else {
        this.canvas_style.cursor = "default";
      }
    },
    marks: function(val) {
      localStorage.setItem(this.cachename, JSON.stringify(this.marks));
    }
  },
  computed: {
    normalizedMarks() {
      const data = [];
      for (const item of this.marks) {
        const ww = 256 / item.width;
        const wh = 256 / item.height;
        const x = Math.round(item.x * ww);
        const y = Math.round(item.y * wh);
        let color = this.colors.find(x => {
          return x.val == item.color;
        });
        if (color) {
          data.push({
            id: item.id,
            x: x,
            y: y,
            color: color.text,
            width: 256,
            height: 256
          });
        } else {
          data.push({
            id: item.id,
            x: x,
            y: y,
            color: this.mark_setting.color,
            width: 256,
            height: 256
          });
        }
      }
      return data;
    },
    normalizedCanvasCoordinate() {
      const data = {};
      if (this.cursor.x) {
        const canvas = this.$refs["mark-canvas"];
        const rect = canvas.getBoundingClientRect();
        const w = 256 / canvas.width;
        x = this.cursor.x - rect.left;
        y = this.cursor.y - rect.top;
        data.x = Math.round(x * w);
        data.y = Math.round(y * w);
      }
      return data;
    },
    canvasWidth() {
      const baseWidth = window.innerWidth;
      const bp = this.$vuetify.breakpoint.name;
      console.log(bp);
      if (bp == "xs") {
        return baseWidth * 0.8;
      } else if (bp == "sm") {
        return (baseWidth / 2) * 0.85;
      } else if (bp == "md") {
        return (baseWidth / 2) * 0.85;
      } else if (bp == "lg") {
        return (baseWidth / 2) * 0.9;
      } else if (bp == "xl") {
        return (baseWidth / 2) * 0.9;
      }
    },
    canvasWrapperStyle() {
      const baseWidth = window.innerWidth;
      const bp = this.$vuetify.breakpoint.name;
      console.log(bp);
      const style = {
        position: "relative"
      };
      if (bp == "xs") {
        style["min-height"] = `${baseWidth * 0.8}px`;
      } else if (bp == "sm") {
        style["min-height"] = `${(baseWidth / 2) * 0.85}px`;
      } else if (bp == "md") {
        style["min-height"] = `${(baseWidth / 2) * 0.85}px`;
      } else if (bp == "lg") {
        style["min-height"] = `${(baseWidth / 2) * 0.9}px`;
        style["max-height"] = "90vh";
      } else if (bp == "xl") {
        style["min-height"] = `${(baseWidth / 2) * 0.9}px`;
        style["max-height"] = "90vh";
      }
      return style;
    },
    collisionOffset() {
      const bp = this.$vuetify.breakpoint.name;
      if (bp == "xs") {
        return 3;
      } else if (bp == "sm") {
        return 3;
      } else if (bp == "md") {
        return 3;
      } else if (bp == "lg") {
        return 10;
      } else if (bp == "xl") {
        return 10;
      }
    }
  },
  methods: {
    initCanvas: function() {
      if (this.video) {
        const canvas = this.$refs["video-canvas"];
        const markCanvas = this.$refs["mark-canvas"];
        canvas.width = this.canvasWidth;
        canvas.height = this.canvasWidth;
        markCanvas.width = canvas.width;
        markCanvas.height = canvas.height;
        canvas
          .getContext("2d")
          .drawImage(this.video, 0, 0, canvas.width, canvas.height);
        this.canvas_size.width = canvas.width;
        this.canvas_size.height = canvas.height;
        if (this.marks) {
          if (this.marks.length > 0) {
            for (const item of this.marks) {
              let color = this.mark_setting.color;
              if (item.color) {
                color = item.color;
              }
              this.renderMark(item.x, item.y, item.height, item.width, color);
            }
          }
        }
      }
    },
    edit: function(video) {
      /**
       * 画像領域の初期化を行います
       */
      this.video = video;
      this.dialog = true;
      this.redy = false;
      if (this.canvas.target !== undefined) {
        this.cachename =
          "cache_" + this.basename + this.canvas.target.data.frame;
      }
      const cache = JSON.parse(localStorage.getItem(this.cachename));
      if (cache === null) {
        this.marks = [];
      } else {
        this.marks = cache;
      }
      setTimeout(() => {
        this.initCanvas();
        this.redy = true;
      }, 1000);
    },
    downloadImages(elmnames) {
      const createImage = function(canvas) {
        const image = new Image();
        image.src = canvas.toDataURL();
        return image;
      };
      const filename = `${this.basename}_${this.canvas.target.data.frame}.png`;
      const main_canvas = document.createElement("canvas");
      const main_context = main_canvas.getContext("2d");
      for (elmname of elmnames) {
        const canvas = this.$refs[elmname];
        main_context.drawImage(createImage(canvas), 0, 0);
      }
      img = createImage(main_canvas);
      console.log(img);
      //downloadPng(main_canvas, filename);
    },
    downloadImage(elmname) {
      const canvas = this.$refs[elmname];
      const type = elmname.split("-")[0];
      const filename =
        this.basename +
        "_" +
        this.canvas.target.data.frame +
        "_" +
        type +
        ".png";
      downloadPng(canvas, filename);
    },
    renderMark: function(x, y, height, width, color) {
      /**
       * mark-canvas に point を描画します.
       *
       * この関数が画像領域の描画に注力することに注意してください.
       */
      if (color === undefined) {
        color = this.mark_setting.color;
      }
      const canvas = this.$refs["mark-canvas"];
      const ctx = canvas.getContext("2d");
      const wx = canvas.width / width;
      const wy = canvas.height / height;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(
        x * wx,
        y * wy,
        this.mark_setting.pointSize,
        0,
        Math.PI * 2,
        false
      );
      ctx.fill();
    },
    showCanvasMemu: function(event) {
      event.preventDefault();
      this.show_canvas_menu = false;
      this.cursor = {
        x: event.clientX,
        y: event.clientY
      };
      this.$nextTick(() => {
        this.show_canvas_menu = true;
      });
    },
    isMarked: function(event) {
      /**
       * 画像領域ホバー中に, 既に描画が行われているか否かを判定します.
       *
       * 加えて this.cursor に現在の値を挿入することに注意してください.
       */
      this.is_on_mark = false;
      this.on_mark = {};
      this.canvas_style.cursor = "default";

      if (this.is_drag === false) {
        // キャンバス上の座標軸を取得
        const canvas = this.$refs["mark-canvas"];
        const rect = canvas.getBoundingClientRect();
        this.cursor = {
          x: event.clientX,
          y: event.clientY
        };
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        for (const item of this.marks) {
          // 既存のマークに対する当たり判定
          const wx = canvas.width / item.width;
          const wy = canvas.height / item.height;

          const diffx = Math.abs(x - item.x * wx);
          const diffy = Math.abs(y - item.y * wy);
          if (diffx < this.collisionOffset && diffy < this.collisionOffset) {
            // 現在のカーソルが this.collisionOffset より小さい最初マークが選択されます.
            this.is_on_mark = true;
            this.on_mark = item;
            this.canvas_style.cursor = "move";
            break;
          }
        }
      }
    },
    markDrag: function(event) {
      if (this.on_mark) {
        this.is_drag = true;
        this.markRemove(this.on_mark.id);
      } else {
        this.is_drag = false;
      }
    },
    markCange: function(event) {
      this.is_drag = false;
      this.on_mark = {};
    },
    _markAdd: function(x, y, width, height) {
      if (this.marks.length < this.mark_setting.maxSize) {
        this.renderMark(x, y, height, width, this.mark_setting.color);
        this.marks.push({
          id: generateUuid(),
          x: x,
          y: y,
          width: width,
          height: height,
          color: this.mark_setting.color
        });
        this.is_drag = false;
        if (this.show_canvas_menu) {
          this.on_mark = {};
          this.show_canvas_menu = false;
          this.is_on_mark = false;
        }
      }
    },
    markAdd: function(event) {
      /**
       * 画像領域クリック時に point をレンダーし, その情報を記録します.
       */
      const rect = this.$refs["mark-canvas"].getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      this._markAdd(x, y, rect.height, rect.width);
    },
    markDescription: function(id) {
      this.initCanvas();
      const color = "rgba(241,196,15 ,1)";
      const canvas = this.$refs["mark-canvas"];
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      for (const item of this.marks) {
        if (item.id === id) {
          this.renderMark(item.x, item.y, item.height, item.width, color);
        } else {
          this.renderMark(item.x, item.y, item.heigh, item.width, item.color);
        }
      }
    },
    markDescriptionNomal: function(event) {
      this.initCanvas();
      const canvas = this.$refs["mark-canvas"];
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      for (const item of this.marks) {
        this.renderMark(item.x, item.y, item.height, item.width, item.color);
      }
    },
    markRemove: function(id) {
      this.initCanvas();
      const canvas = this.$refs["mark-canvas"];
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const index in this.marks) {
        item = this.marks[index];
        if (item.id === id) {
          this.marks.splice(index, 1);
        }
      }
      for (const item of this.marks) {
        this.renderMark(item.x, item.y, item.height, item.width, item.color);
      }
      if (this.show_canvas_menu) {
        this.show_canvas_menu = false;
        this.is_on_mark = false;
      }
    },
    markDownload() {
      /**
       * point として記述した内容を CSV に変換し
       * ダウンロードします.
       *
       */
      const canvas = this.$refs["video-canvas"];
      console.log("Mark: Download");
      let csv = "id,basename,time,frame,x,y,color\n";
      this.normalizedMarks.forEach(item => {
        const line =
          [
            item.id,
            this.basename,
            this.canvas.target.data.time,
            this.canvas.target.data.frame,
            item.x,
            item.y,
            item.color
          ].join(",") + "\n";
        csv += line;
      });
      const filename = ["mark.csv"].join("_");
      downloadCsv(csv, filename);
    },
    regionAdd: function(event) {
      console.log("ctrl");
    }
  },
  template: `
      <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-toolbar dark color="primary">
          <v-toolbar-title v-if="canvas.target">
            Time: {{canvas.target.data.time}} sec
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu offset-y :nudge-width="200">
            <v-btn icon dark slot="activator">
              <v-icon>cloud_download</v-icon>
            </v-btn>
            <v-list>
              <v-subheader>Video</v-subheader>
              <v-divider></v-divider>
              <v-list-tile @click="downloadImages(['video-canvas', 'mark-canvas'])">
                <v-list-tile-title>PNG(全体)</v-list-tile-title>
              </v-list-tile>
              <v-list-tile @click="downloadImage('video-canvas')">
                <v-list-tile-title>PNG(背景)</v-list-tile-title>
              </v-list-tile>
              <v-divider></v-divider>
              <v-subheader>Marks</v-subheader>
              <v-divider></v-divider>
              <v-list-tile @click="markDownload">
                <v-list-tile-title>CSV</v-list-tile-title>
              </v-list-tile>
              <v-list-tile @click="downloadImage('mark-canvas')">
                <v-list-tile-title>PNG(マーク)</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
          <v-btn icon dark @click.native="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-menu 
          v-model="show_canvas_menu"
          :position-x="cursor.x"
          :position-y="cursor.y"
          :close-on-content-click="false"
          :nudge-width="200"
          absolute
          offset-y
        >
          <v-card>
            <v-list three-line>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title>
                    座標情報
                  </v-list-tile-title>
                  <v-list-tile-sub-title>
                    <span v-if="is_on_mark">
                      X: {{ normalizedMarks.find(x => x.id==on_mark.id).x }}
                    </span>
                    <span v-else>
                      X: {{ normalizedCanvasCoordinate.x }}
                    </span>
                  </v-list-tile-sub-title>
                  <v-list-tile-sub-title>
                    <span v-if="is_on_mark">
                      Y: {{ normalizedMarks.find(x => x.id==on_mark.id).y }}
                    </span>
                    <span v-else>
                      Y: {{ normalizedCanvasCoordinate.y }}
                    </span>
                  </v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-divider></v-divider>
            <v-list class="pa-0 ma-0">
              <v-list-tile @click="markRemove(on_mark.id)"  v-if="is_on_mark">
                <v-list-tile-content>
                  <v-list-tile-title>remove</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-icon color="red">remove_circle</v-icon>
                </v-list-tile-action>
              </v-list-tile>
              <v-list-tile
                v-else
                @click.stop="_markAdd(normalizedCanvasCoordinate.x, normalizedCanvasCoordinate.y, 256, 256)"
              >
                <v-list-tile-content>
                  <v-list-tile-title>add</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-icon color="blue">add_circle</v-icon>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
            <v-divider></v-divider>
          </v-card>
        </v-menu>

        <v-card>
          <v-container fluid grid-list-md>
            <v-layout row wrap v-resize="initCanvas">
              <v-flex xs12 sm6>
                <v-card>
                  <v-card-title>
                    <div :style="canvasWrapperStyle" v-show="redy">
                      <canvas :style="canvas_style" ref="video-canvas" id="video-canvas" />
                      <canvas
                        id="mark-canvas"
                        ref="mark-canvas"
                        :style="canvas_style"
                        @contextmenu="showCanvasMemu"
                        @mousemove="isMarked"
                        @mousedown="markDrag"
                        @mouseup="markCange"
                        @click="markAdd"
                      />
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
              <v-flex xs12 sm6>
                <v-card>
                  <v-card-title primary-title :style="canvasWrapperStyle" >
                    <v-flex xs12>
                      <h3 class="headline mb-0">Settings</h3>
                      <v-form>
                        <v-select
                          :items="colors"
                          v-model="mark_setting.color"
                          label="Color"
                          item-text="text"
                          item-value="val"
                          single-line>
                        </v-select>
                        <v-text-field
                          v-model="mark_setting.pointSize"
                          label="Point Size"
                          required>
                        </v-text-field>
                        <v-text-field
                          v-model="mark_setting.maxSize"
                          label="Max(n)"
                          required>
                        </v-text-field>
                        <v-switch
                          label="show backgroud"
                          v-model="background_toggle">
                        </v-switch>
                      </v-form>
                    </v-flex>
                  </v-card-title>
                </v-card>
              </v-flex>
              <v-flex xs12>
                <v-card>
                  <v-card-title>
                    <div>
                      <h3 class="headline mb-0">Detail</h3>
                      <div class="title">特徴点: {{marks.length}} / {{mark_setting.maxSize}}</div>
                    </div>
                  </v-card-title>
                  <v-data-table
                    :headers="mark_setting.headers"
                    :items="normalizedMarks"
                    class="elevation-1"
                  >
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
                      <td
                        @mouseenter="markDescription(props.item.id)"
                        @mouseleave="markDescriptionNomal">
                        {{ props.item.x }}
                      </td>
                      <td
                        @mouseenter="markDescription(props.item.id)"
                        @mouseleave="markDescriptionNomal">
                        {{ props.item.y }}
                      </td>
                      <td
                        @mouseenter="markDescription(props.item.id)"
                        @mouseleave="markDescriptionNomal">
                        {{ props.item.color }}
                      </td>
                      <td
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
});

/* 動画用コンポーネント */
Vue.component("video-player", {
  components: {
    canvasEditor: canvasEditor
  },
  data: function() {
    return {
      currentTime: 0,
      currentFrame: 0,
      playBtnIcon: "play_arrow",
      videoCSS: {
        width: "100%",
        height: "auto"
      },
      dropZone: {
        border: "5px solid blue",
        width: "200px",
        height: "100px"
      },
      wavesurferSettings: {
        container: "#wave-form",
        waveColor: "violet",
        progressColor: "purple",
        scrollParent: true,
        minPxPerSec: 100,
        minimap: true,
        normalize: true
      },
      regionSetting: {
        dragSelection: {
          slop: 5
        },
        color: "rgba(255,183,77, 0.3)",
        data: {
          type: "region"
        }
      },
      spectrogramSetting: {
        container: "#wave-spectrogram",
        fftSamples: 512,
        brightness: 1,
        labels: true
      },
      timelineSetting: {
        container: "#wave-timeline"
      },
      minimapSetting: {
        height: 30,
        waveColor: "#ddd",
        progressColor: "#999",
        cursorColor: "#999"
      },
      points: [],
      regions: [],
      marks: [],
      cache: {},
      cacheUploadDialog: false,
      dialog: false,
      menu: false,
      wavesurfer: null // wavesurfer クラス
    };
  },
  props: ["url", "fps", "filename"],
  computed: {
    basename: function() {
      const pathes = this.url.split("/");
      if (pathes[0].match("blob")) {
        const fname = this.filename;
        return fname.split(".")[0];
      } else {
        const fname = pathes[pathes.length - 1];
        return fname.split(".")[0];
      }
    },
    cachename: function() {
      return "cache_" + this.basename;
    },
    canvas: function() {
      const scale = 2.5;
      return {
        target: null,
        scale: scale
      };
    },
    skipLength: function() {
      const len = 1 / this.fps;
      return parseFloat(len.toFixed(4));
    },
    isReady: function() {
      // 音声の読み込みが終了したか否かを判定します.
      if (this.wavesurfer !== null) {
        return this.wavesurfer.isReady;
      } else {
        return false;
      }
    }
  },
  watch: {
    url: function() {
      const url = this.url;
      // 種々初期化
      const cache = JSON.parse(localStorage.getItem(this.cachename));
      if (cache === null) {
        this.cache = {};
        this.regions = [];
        this.points = [];
      } else {
        this.cache = cache;
        this.points = this.cache.points;
        this.regions = this.cache.regions;
      }
      this.wavesurfer.destroy();
      // リロード
      this.load(url);
    },
    points: function(val) {
      this.cache.points = val;
      localStorage.setItem(this.cachename, JSON.stringify(this.cache));
    },
    regions: function(val) {
      this.cache.regions = val;
      localStorage.setItem(this.cachename, JSON.stringify(this.cache));
    }
  },
  mounted() {
    const url = this.url;
    const cache = JSON.parse(localStorage.getItem(this.cachename));
    if (cache !== null) {
      console.log(cache);
      this.cache = cache;
      this.points = this.cache.points;
      this.regions = this.cache.regions;
    }
    this.load(url);
  },
  methods: {
    // 基本操作
    load: function(url) {
      /**
       * url で指定されたファイルの音声波形データを
       * 作成します.
       *
       * wavesurfer のレンダーは直接の DOM 操作が
       * 必要であるため操作は nextTick 内に記述します.
       */
      this.regionSetting.regions = this.regions.concat(this.points);
      this.$nextTick(() => {
        const setting = Object.assign({}, this.wavesurferSettings);
        setting.skipLength = this.skipLength;
        setting.plugins = [
          WaveSurfer.regions.create(this.regionSetting),
          WaveSurfer.minimap.create(this.minimapSetting),
          WaveSurfer.timeline.create(this.timelineSetting),
          WaveSurfer.spectrogram.create(this.spectrogramSetting)
        ];
        this.wavesurfer = WaveSurfer.create(setting);
        this.wavesurfer.load(url);
      });
      this.playBtnIcon = "play_arrow";
    },
    play: function(event) {
      if (event.type === "keyup") {
        event.preventDefault();
      }
      const video = this.$refs.nowVideo;
      if (video.paused) {
        video.play();
        this.wavesurfer.play();
        this.playBtnIcon = "pause";
      } else {
        video.pause();
        this.wavesurfer.pause();
        this.currentTime = video.currentTime;
        this.playBtnIcon = "play_arrow";
      }
      this.playing = video.paused;
    },
    skipForward: function(event) {
      this.wavesurfer.skipForward();
      this.syncVideo(event);
    },
    skipBackward: function(event) {
      this.wavesurfer.skipBackward();
      this.syncVideo(event);
    },
    startTo: function(event) {
      this.wavesurfer.seekAndCenter(0);
      this.syncVideo(event);
    },
    endTo: function(event) {
      this.wavesurfer.seekAndCenter(1);
      this.syncVideo(event);
    },
    moveTo: function(time) {
      const video = this.$refs.nowVideo;
      const duration = this.wavesurfer.getDuration();
      this.wavesurfer.seekAndCenter(time / duration);
      video.currentTime = time;
    },
    // 動画再生時の挙動
    syncVideos: function(event) {
      const video = this.$refs.nowVideo;
      const preVideo = this.$refs.preVideo;
      const posVideo = this.$refs.posVideo;
      this.currentTime = parseFloat(video.currentTime);
      this.currentFrame = Math.floor(video.currentTime * this.fps);
      if (this.currentTime > this.skipLength) {
        preVideo.currentTime = this.currentTime - this.skipLength;
      } else {
        preVideo.currentTime = 0;
      }
      if (this.currentTime + this.skipLength <= video.duration) {
        posVideo.currentTime = this.currentTime + this.skipLength;
      } else {
        posVideo.currentTime = video.duration;
      }
      if (this.currentTime === video.duration) {
        this.playBtnIcon = "play_arrow";
      }
    },
    // 音声波形操作
    syncVideo: function(event) {
      setTimeout(() => {
        const video = this.$refs.nowVideo;
        const currentTime = parseFloat(this.wavesurfer.getCurrentTime());
        video.currentTime = currentTime;
      }, 0.1);
    },
    reRender: function() {
      const url = this.url;
      this.$nextTick(() => {
        // WaveSurfer の初期設定
        this.wavesurfer.destroy();
        this.load(url);
      });
    },
    // canvas 操作
    edit: function(point) {
      const video = this.$refs.nowVideo;
      this.canvas.target = point;
      this.moveTo(point.data.time);
      setTimeout(() => {
        this.$refs["canvas-editor"].edit(video);
      }, 1000);
    },
    // point 操作
    pointAdd: function(event) {
      /**
       * HTML: id="wave-form" 要素を ctrl+click した場合に
       * wave-form の現在値の情報を取得し,
       * this.points に追加します.
       */
      this.$nextTick(() => {
        setTimeout(() => {
          const range = 1 / this.wavesurferSettings.minPxPerSec;
          const currentTime = this.wavesurfer.getCurrentTime();
          const currentFrame = Math.floor(currentTime * this.fps);
          if (currentTime !== 0) {
            const item = {
              start: currentTime - range,
              end: currentTime + range,
              data: {
                time: currentTime,
                frame: currentFrame,
                type: "point"
              },
              attributes: {
                label: null,
                type: "point",
                highlight: false
              },
              color: "rgba(103, 58, 183, 0.5)",
              resize: false,
              id: "point_" + (this.points.length + 1)
            };
            this.points.push(item);
            // wavesurfer に登録
            this.wavesurfer.addRegion(item);
            this.wavesurfer.fireEvent("region-updated", this.wavesurfer);
          }
        }, 0.2);
      });
    },
    pointUpdate: function(event) {
      /**
       * point 移動時に this.points に反映
       *
       * detail:
       *   wave-form にある regions をすべて確認し,
       *   this.points を更新します.
       * event: mouseup
       * target: id=wave-form
       */
      console.info("point: update");
      const range = 1 / this.wavesurferSettings.minPxPerSec;
      const pointList = this.points;
      const registeredIds = [];

      // 現状の id 一覧を取得
      for (const i in pointList) {
        registeredIds.push(pointList[i].id);
      }
      const regions = this.wavesurfer.regions.list;
      for (const key in regions) {
        const region = regions[key];
        if (region.data.type !== undefined && region.data.type === "point") {
          // 開始, 終了時刻は異なる場合は反映
          const index = registeredIds.indexOf(region.id);
          const oldPoint = pointList[index];
          if (oldPoint.start !== region.start || oldPoint.end !== region.end) {
            pointList[index].start = region.start;
            pointList[index].end = region.end;
            pointList[index].data = {
              time: region.start + range,
              frame: Math.floor((region.start + range) * this.fps)
            };
          }
        }
      }
      pointList.sort(function(a, b) {
        if (a.start < b.start) return -1;
        if (a.start > b.start) return 1;
        return 0;
      });
    },
    pointDelete(point) {
      /**
       * point の削除
       *
       */
      console.info("point: delete");
      this.points = this.points.filter(x => x.id !== point.id);
      // wave-form から削除
      const regions = this.wavesurfer.regions.list;
      for (const i in regions) {
        if (point.id === regions[i].id) {
          regions[i].remove();
          break;
        }
      }
    },
    pointDownload() {
      /**
       * point として記述した内容を CSV に変換し
       * ダウンロードします.
       *
       */
      console.log("Point: Download");
      let csv = "time,frame,text\n";
      this.points.forEach(item => {
        const line =
          item.data.time +
          "," +
          item.data.frame +
          "," +
          item.attributes.label +
          "\n";
        csv += line;
      });
      const filename = [this.basename, "point.csv"].join("_");
      downloadCsv(csv, filename);
    },
    // region 操作
    regionPlay: function(region) {
      console.log("REGION: PLAY");
      const video = this.$refs.nowVideo;
      const duration = this.wavesurfer.getDuration();

      // 時刻合わせ
      video.currentTime = region.start;
      this.currentTime = region.start;
      this.wavesurfer.seekAndCenter(region.start / duration);

      // 再生
      video.play();
      for (const i in this.wavesurfer.regions.list) {
        if (this.wavesurfer.regions.list[i].id === region.id) {
          this.wavesurfer.regions.list[i].play();
        }
      }
      // 停止
      const stop = function() {
        const video = document.getElementById("nowVideo");
        video.pause();
      };
      setTimeout(stop, (region.end - region.start) * 1000);
    },
    regionDelete: function(region) {
      console.log("REGION: DELETE");
      // LIST から削除
      this.regions = this.regions.filter(x => x.id !== region.id);
      // wave-form から削除
      const regions = this.wavesurfer.regions.list;
      for (const i in regions) {
        if (region.id === regions[i].id) {
          regions[i].remove();
          break;
        }
      }
    },
    regionUpdate: function(event) {
      /**
       * レギオン作成時にアノテーションリストを更新
       *
       * detail:
       *   wave-form にある regions をすべて確認し,
       *   this.regions を更新します.
       * event: mouseup
       * target: id=wave-form
       */
      console.info("region: update");
      const regionList = this.regions;
      const registeredIds = [];
      for (const i in regionList) {
        // 現状の id 一覧を取得
        registeredIds.push(regionList[i].id);
      }
      const regions = this.wavesurfer.regions.list;
      for (const key in regions) {
        const region = regions[key];
        if (region.data.type !== undefined && region.data.type === "region") {
          if (registeredIds.indexOf(region.id) === -1) {
            // 新規 region が波形レイヤーに存在する場合のみ追加
            const duration = region.end - regions.start;
            const item = {
              start: region.start,
              end: region.end,
              color: region.color,
              data: {
                type: "region",
                duration: duration
              },
              attributes: {
                label: null,
                type: "region",
                highlight: false
              },
              id: region.id
            };
            regionList.push(item);
          } else {
            // 開始, 終了時刻は異なる場合は反映
            const index = registeredIds.indexOf(region.id);
            const oldRegion = regionList[index];
            if (
              oldRegion.start !== region.start ||
              oldRegion.end !== region.end
            ) {
              regionList[index].start = region.start;
              regionList[index].end = region.end;
              regionList[index].data.duration = region.end - region.start;
            }
          }
        }
      }
      regionList.sort(function(a, b) {
        if (a.start < b.start) return -1;
        if (a.start > b.start) return 1;
        return 0;
      });
    },
    regionDownload() {
      /**
       * region として記述した内容を CSV に変換し, ダウンロードします.
       *
       */
      console.log("Region: Download");
      let csv = "strat,end,text\n";
      this.regions.forEach(item => {
        const line =
          item.start + "," + item.end + "," + item.attributes.label + "\n";
        csv += line;
      });
      const filename = [this.basename, "region.csv"].join("_");
      downloadCsv(csv, filename);
    },
    // region, point の共通操作
    labelUpdate: function(item) {
      /**
       * @desc ラベル属性を決定します
       */
      this.$nextTick(() => {
        const regions = this.wavesurfer.regions.list;
        for (const i in regions) {
          if (regions[i].id === item.id) {
            regions[i].update(item);
          }
        }
      });
    },
    waveformUpdate(event) {
      /**
       * @desc 音声波形のラベル情報と, LIST 情報を一致させる.
       */
      this.regionUpdate(event);
      this.pointUpdate(event);
    },
    cacheDownload(event) {
      /**
       * @desc 現在のキャシュを JSON でダウンロード
       */
      const filename = this.basename + ".json";
      downloadJson(this.cache, filename);
    },
    cacheImportOnFocus() {
      this.$refs.fileInput.click();
    },
    cacheImport(event) {
      /**
       * @desc Upload された Json で現状を上書き
       */
      const files = event.target.files;
      const file = files[0];
      const vm = this;
      const fr = new FileReader();
      fr.onload = function(e) {
        const cache = JSON.parse(e.target.result);
        vm.regions = cache.regions;
        vm.points = cache.points;
        console.log(vm.cache);
      };
      fr.readAsText(file);
      this.cacheUploadDialog = false;
    }
  },
  template: `
      <v-container fluid grid-list-md>
        <v-layout row fill-height wrap>
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
          <v-flex xs12 sm7 md9>
            <v-card class="ma-2" contextmenu="player-menu">
              <v-toolbar color="accent" dark>
                <v-toolbar-title>{{basename}}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-title>時刻: {{currentTime}}</v-toolbar-title>
                <v-toolbar-title>フレーム数: {{currentFrame}}</v-toolbar-title>

                <v-menu
                  offset-x
                  v-model="menu"
                  :close-on-content-click="false"
                  :nudge-width="200"
                >
                  <v-btn icon dark slot="activator">
                    <v-icon>settings</v-icon>
                  </v-btn>
                  <v-card>
                    <v-card-text>
                      <v-tooltip bottom>
                        <v-text-field
                          @keyup.enter="reRender"
                          slot="activator"
                          label="fps"
                          v-model="fps"
                          suffix="fps"
                        />
                        <span>動画の FPS を設定します</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <v-text-field slot="activator" label="brightness"
                          @keyup.enter="reRender"
                          v-model="spectrogramSetting.brightness"
                          suffix="times"
                        />
                        <span>
                          スペクトルグラムの明るさを調整します.
                          この値は 0 以上の数字で,
                          1 より大きくすると明るくなり,
                          0 以上 1 未満にすると暗くなります.
                        </span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <v-text-field
                          @keyup.enter="reRender"
                          v-model="wavesurferSettings.minPxPerSec"
                          slot="activator"
                          label="minPx per sec"
                          suffix="per sec"
                        />
                        <span>
                          1 秒を何ピクセルで表現するのかを決定します.
                          この値が大きいほど波形は拡大されます.
                        </span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <v-text-field
                          @keyup.enter="reRender"
                          v-model="spectrogramSetting.fftSamples"
                          slot="activator"
                          label="fft sample"
                          suffix="sample"
                        />
                        <span>
                          FFT サンプリングレートです.
                          現在は動的に変更するとうまく動かないです.
                        </span>
                      </v-tooltip>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn flat @click="menu=false">Cancel</v-btn>
                      <v-btn color="primary" flat @click="reRender(); menu=false">
                        Save
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-menu>

              </v-toolbar>
              <!-- 動画表示 --> 
              <v-container v-show="isReady">
                <v-layout row wrap>
                  <v-flex d-flex xs4>
                    <v-tooltip bottom>
                      <video slot="activator"
                        id="preVideo"
                        ref="preVideo" muted
                        v-bind:src=url
                        v-bind:style="videoCSS"
                        v-on:click="play">
                      </video>
                      <span>{{skipLength}} sec 前の画像</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex d-flex xs4>
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
                  <v-flex d-flex xs4>
                    <v-tooltip bottom>
                      <video slot="activator"
                        id="posVideo"
                        ref="posVideo"
                        muted
                        v-bind:src=url
                        v-bind:style="videoCSS"
                        v-on:click="play">
                      </video>
                      <span>{{skipLength}} sec 後の画像</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
              </v-container>
              <!-- 操作ボタン --> 
              <v-card-actions v-show="isReady">
                <v-tooltip bottom>
                  <v-btn
                    icon
                    class="mx-3"
                    slot="activator"
                    color="accent"
                    @click=startTo
                    :small="$vuetify.breakpoint.smAndDown"
                  >
                    <v-icon>fast_rewind</v-icon>
                  </v-btn>
                  <span>move to start...</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <v-btn
                    icon
                    slot="activator"
                    color="accent"
                    :small="$vuetify.breakpoint.smAndDown"
                    @click=skipBackward
                  >
                    <v-icon>skip_previous</v-icon>
                  </v-btn>
                  <span>move to previous frame...</span>
                </v-tooltip>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                  <v-btn icon slot="activator"
                    class="mx-3"
                    :small="$vuetify.breakpoint.smAndDown"
                    color="accent" @click=play>
                    <v-icon>{{playBtnIcon}}</v-icon>
                  </v-btn>
                  <span>Play or Pause</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <v-btn icon slot="activator"
                    :small="$vuetify.breakpoint.smAndDown"
                    color="accent" @click="reRender">
                    <v-icon>refresh</v-icon>
                  </v-btn>
                  <span>Redraw Sound</span>
                </v-tooltip>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                  <v-btn icon slot="activator"
                    :small="$vuetify.breakpoint.smAndDown"
                    color="accent" @click=skipForward>
                    <v-icon>skip_next</v-icon>
                  </v-btn>
                  <span>move to next frame...</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <v-btn icon slot="activator"
                    class="mx-3"
                    :small="$vuetify.breakpoint.smAndDown"
                    color="accent" @click=endTo>
                    <v-icon>fast_forward</v-icon>
                  </v-btn>
                  <span>move to end...</span>
                </v-tooltip>
              </v-card-actions>
              <!-- 音声表示 --> 
              <v-container style="max-height:30vh;" class="scroll-y"
                v-show="isReady">
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
              <v-card-title align-center v-else>
                <v-container text-xs-center>
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
          <v-flex xs12 sm5 md3>
            <v-card v-if="regions.length !== 0" class="ma-2">
              <v-toolbar color="accent" dark>
                <v-toolbar-title>Region</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="regionDownload">
                  <v-icon>cloud_download</v-icon>
                </v-btn>
              </v-toolbar>
              <v-list three-line subheader
                class="scroll-y" style="max-height:40vh; min-height:40vh;">
                <template v-for="(item, index) in regions">
                  <v-list-tile :key="item.id">
                    <v-list-tile-content>
                      <v-list-tile-sub-title>
                        <v-text-field flat
                          label="contents"
                          v-model="item.attributes.label"
                          @keyup.enter="labelUpdate(item)">
                        </v-text-field>
                      </v-list-tile-sub-title>
                      <v-list-tile-sub-title class="caption text-truncate">
                        START: {{ item.start.toFixed(3) }} sec
                      </v-list-tile-sub-title>
                      <v-list-tile-sub-title class="caption text-truncate">
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
            </v-card>
            <v-card dark class="ma-2" v-else>
              <v-toolbar color="accent" dark>
                <v-toolbar-title>Region</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="regionDownload">
                  <v-icon>cloud_download</v-icon>
                </v-btn>
              </v-toolbar>
              <v-list three-line subheader
                class="scroll-y" style="max-height:40vh; min-height:40vh;">
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-sub-title>No Region</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list> 
            </v-card>
            <v-card class="ma-2" v-if="points.length !== 0">
              <v-toolbar color="accent" dark>
                <v-toolbar-title>Point</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="pointDownload">
                  <v-icon>cloud_download</v-icon>
                </v-btn>
              </v-toolbar>
              <v-list three-line subheader
                class="scroll-y" style="max-height:35vh;min-height:35vh;">
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
                      <v-list-tile-sub-title class="caption text-truncate">
                        Time: {{ item.data.time.toFixed(3) }} sec
                      </v-list-tile-sub-title>
                      <v-list-tile-sub-title class="caption text-truncate">
                        Frame: {{ item.data.frame.toFixed(0) }}
                      </v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <v-btn
                        icon
                        outline
                        color="indigo"
                        @click="edit(item)">
                        <v-icon>edit</v-icon>
                      </v-btn>
                    </v-list-tile-action>
                    <v-list-tile-action>
                      <v-btn
                        outline
                        icon
                        color="indigo"
                        @click="pointDelete(item)">
                        <v-icon>delete_outline</v-icon>
                      </v-btn>
                    </v-list-tile-action>
                  </v-list-tile>
                  <v-divider></v-divider>
                </template>
              </v-list> 
            </v-card>
            <v-card class="ma-2" v-else>
              <v-toolbar color="accent" dark>
                <v-toolbar-title>Point</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="pointDownload">
                  <v-icon>cloud_download</v-icon>
                </v-btn>
              </v-toolbar>
              <v-list three-line subheader dark
                class="scroll-y" style="max-height:40vh;min-height:40vh;">
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-sub-title>No Points</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list> 
            </v-card>
          </v-flex>
        </v-layout>

        <!-- キャシュ読み込みダイアログ --> 
        <v-dialog v-model="cacheUploadDialog"
          persistent max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Import Cache</span>
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
        <canvas-editor
          ref="canvas-editor"
          v-bind:canvas=canvas
          v-bind:basename=basename>
        </canvas-editor>
      </v-container>
    `
});

/* アプリケーション本体 */
new Vue({
  el: "#app",
  vuetify: new Vuetify(),
  data: {
    app: "MRI Vuewer",
    version: 1.52,
    files: files,
    target: {
      url: null,
      fps: null
    },
    snackbar: {
      show: false,
      message: "",
      color: "red darken-4",
      timeout: 6000
    },
    fileInputStyle: {
      height: "0px",
      visibility: "hidden",
      position: "absolute"
    },
    drawer: false
  },
  mounted() {
    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      // Great success! All the File APIs are supported.
    } else {
      this.snackbar.show = true;
      this.snackbar.message =
        "The File APIs are not fully supported in this browser.";
    }
    // load video if there are files
    if (this.files.length > 0) {
      this.target = this.files[0];
    }
  },
  methods: {
    selectFile: function(target) {
      this.target = target;
      this.drawer = false;
    },
    movieImport() {
      this.$refs.movieImport.click();
    },
    sampleImport() {
      const url = "https://kikuchiken-waseda.github.io/MRIVuewer/misc/6.mp4";
      const target = {
        name: "sample.mp4",
        url: url,
        fps: fps
      };
      this.files.push(target);
      this.target = target;
    },
    movieSelected(event) {
      event.preventDefault();
      const file = event.target.files[0];
      if (file.type.match("video")) {
        const url = window.URL.createObjectURL(file);
        const target = {
          name: file.name,
          url: url,
          fps: fps
        };
        this.files.push(target);
        this.target = target;
      } else {
        this.snackbar.show = true;
        this.snackbar.message = "You should upload the video data.";
      }
    },
    clear: function() {
      localStorage.clear();
      this.drawer = false;
    }
  }
});

/* 汎用関数 */
function generateUuid() {
  const chars = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split("");
  for (let i = 0, len = chars.length; i < len; i++) {
    switch (chars[i]) {
      case "x":
        chars[i] = Math.floor(Math.random() * 16).toString(16);
        break;
      case "y":
        chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
        break;
    }
  }
  return chars.join("");
}

function downloadCsv(csv, filename) {
  const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
  const blob = new Blob([bom, csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.target = "_blank";
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function downloadPng(canvas, filename) {
  const type = "image/png";
  const data = canvas.toDataURL(type);
  const bin = window.atob(data.split(",")[1]);
  const bom = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) {
    bom[i] = bin.charCodeAt(i);
  }
  const blob = new Blob([bom.buffer], { type: type });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.target = "_blank";
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function downloadJson(obj, filename) {
  const blob = new Blob([JSON.stringify(obj, null, "  ")], {
    type: "application/json"
  });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.target = "_blank";
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
