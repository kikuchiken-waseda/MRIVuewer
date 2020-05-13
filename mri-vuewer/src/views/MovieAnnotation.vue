<template>
  <v-container v-resize="onResize" fluid class="pa-0 movie-annotaion">
    <m-tool-bar v-if="item" :file-name="item.name" :menu-funcs="menuFuncs">
      <template v-slot:setting>
        <m-setting-menu :menuFuncs="menuFuncs" />
      </template>
    </m-tool-bar>
    <v-card color="background">
      <v-container v-if="item">
        <v-row>
          <v-col class="flex-grow-1 flex-shrink-1">
            <v-card ref="videoCard" flat color="background">
              <m-video-array
                :src="item.dataUrl"
                :frameOffset="frameOffset"
                :fps="item.fps"
                @loadeddata="onLoadeddata"
              />
              <v-card>
                <v-card-actions>
                  <v-btn icon>
                    <v-icon>mdi-skip-previous</v-icon>
                  </v-btn>
                  <v-btn icon>
                    <v-icon>mdi-skip-backward</v-icon>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn fab dark small color="accent" @click="play">
                    <v-icon> mdi-play </v-icon>
                  </v-btn>
                  <v-btn fab dark small color="accent" @click="pause">
                    <v-icon> mdi-pause </v-icon>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn icon>
                    <v-icon>mdi-skip-next</v-icon>
                  </v-btn>
                  <v-btn icon>
                    <v-icon>mdi-skip-forward</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-card>
          </v-col>
          <v-col cols="5" class="flex-grow-1 flex-shrink-1 d-none d-sm-flex">
            <m-tier-list
              v-if="tiers"
              :items="tiers"
              :ws="ws"
              :max-height="videoHeight"
            />
          </v-col>
        </v-row>
        <v-progress-linear
          v-if="isLoading"
          color="accent"
          height="10"
          indeterminate
        />
        <v-card>
          <v-card id="wave-spectrogram" />
          <v-card id="wave-timeline" />
          <v-text-field
            @input="onChangeText"
            @keydown.enter="onEnterText"
            ref="textField"
            v-model="text"
            label="Text"
            hide-details
            solo
            dense
          />
          <v-card id="wave-multiline" />
          <v-card id="waveform" />
          <v-card id="wave-minimap" />
        </v-card>
      </v-container>
    </v-card>
    <v-card v-if="debug">
      <v-container v-if="item">
        <pre>{{ debugItem }}</pre>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import File from "@/models/file.js";
import colors from "vuetify/lib/util/colors";
import MToolBar from "@/components/MovieAnnotaion/MToolBar.vue";
import MSettingMenu from "@/components/MovieAnnotaion/MSettingMenu.vue";
import MTierList from "@/components/MovieAnnotaion/MTierList.vue";
import MVideoArray from "@/components/MovieAnnotaion/MVideoArray.vue";
import WaveSurfer from "@/components/wavesurfer/wavesurfer.js";
import SpectrogramPlugin from "@/components/wavesurfer/plugin/spectrogram.js";
import TimelinePlugin from "@/components/wavesurfer/plugin/timeline.js";
import MinimapPlugin from "@/components/wavesurfer/plugin/minimap.js";
import MultilinePlugin from "@/components/wavesurfer/plugin/multiline.js";

export default {
  name: "MovieAnnotaion",
  components: {
    MToolBar,
    MTierList,
    MSettingMenu,
    MVideoArray
  },
  data: () => ({
    // 設定
    frameOffset: 1,
    options: {
      waveColor: colors.grey.base,
      progressColor: colors.grey.darken4,
      loaderColor: colors.grey.darken4,
      cursorColor: colors.teal.base,
      minPxPerSec: 100,
      height: 70,
      scrollParent: true,
      normalize: true
    },
    // 状態
    debug: false,
    ws: null,
    isVideoLoaded: false,
    isLoading: true,
    videoHeight: 0,
    menuFuncs: [],
    text: "",
    currentTier: null,
    currentIdx: null,
    tiers: [
      {
        name: "Interval",
        tierType: "interval",
        items: []
      },
      {
        name: "Point",
        tierType: "point",
        items: []
      }
    ]
  }),
  computed: {
    item: {
      get: function() {
        return File.find(this.$route.params.id);
      },
      set: function(payload) {
        File.update({
          where: this.$route.params.id,
          data: payload
        });
      }
    },
    debugItem: function() {
      const data = {};
      data.item = this.item;
      data.this = this.tiers;
      return data;
    }
  },
  methods: {
    // ユーティリティ関数
    log: function(tag, msg) {
      if (this.debug) {
        console.info(tag, msg);
      }
    },
    // 状態設定
    load(payload) {
      const tag = `${this.$options.name}:load`;
      if (payload) {
        if (this.ws) {
          this.log(tag, payload);
          if (!this.isVideoLoaded) {
            this.ws.load(payload);
            this.isVideoLoaded = true;
          }
        } else {
          this.log(tag, "no ws");
        }
      } else {
        this.log(tag, "no video");
      }
    },
    initWs() {
      const tag = `${this.$options.name}:initWs`;
      if (this.ws) {
        this.log(tag, "destroy:ws");
        this.ws.destroy();
        this.ws = null;
      }
      this.log(tag, "init:ws");
      const options = this.options;
      options.container = "#waveform";
      options.backend = "MediaElement";
      options.plugins = [
        SpectrogramPlugin.create({
          container: "#wave-spectrogram",
          labels: true
        }),
        TimelinePlugin.create({
          container: "#wave-timeline"
        }),
        MinimapPlugin.create({
          container: "#wave-minimap",
          height: 20
        })
      ];
      this.ws = WaveSurfer.create(options);
      for (const i in this.tiers) {
        const tier = MultilinePlugin.create({
          container: "#wave-multiline",
          name: this.tiers[i].name,
          tierType: this.tiers[i].tierType,
          items: this.tiers[i].items
        });
        this.ws.addPlugin(tier).initPlugin("multiline");
      }
      this.ws.on("ready", this.onRedy);
      this.ws.on("destroy", this.onDestroy);
      this.ws.on("error", this.onError);
      this.ws.on("multiline-update-current", this.onUpdateMultiline);
    },
    setVideoHeight() {
      const tag = `${this.$options.name}:setVideoHeight`;
      this.$nextTick(() => {
        const el = this.$refs.videoCard ? this.$refs.videoCard.$el : null;
        if (el) {
          this.videoHeight = el.clientHeight;
        }
        this.log(tag, this.videoHeight);
      });
    },
    addTier(name, type) {
      this.tiers.push({
        name: name,
        tierType: type,
        items: []
      });
      const tier = MultilinePlugin.create({
        name: this.tiers[this.tiers.length - 1].name,
        container: "#wave-multiline",
        tierType: this.tiers[this.tiers.length - 1].tierType,
        items: this.tiers[this.tiers.length - 1].items
      });
      this.ws.addPlugin(tier).initPlugin("multiline");
    },
    // メディア操作
    play: function() {
      this.ws.play();
    },
    pause: function() {
      this.ws.pause();
    },
    // 時間管理
    getCurrentTime: function() {
      return this.ws.getCurrentTime();
    },
    getDuration: function() {
      return this.ws.getDuration();
    },
    // イベント管理
    onLoadeddata: function(payload) {
      const tag = `${this.$options.name}:onLoadeddata`;
      if (payload) {
        this.log(tag, payload);
        this.load(payload);
      }
    },
    onChangeText: function(val) {
      if (this.currentTier) {
        this.currentTier.putText(this.currentIdx, val);
      }
    },
    onEnterText: function(e) {
      if (this.currentTier) {
        this.currentTier.putText(this.currentIdx, e.target.value);
      }
    },
    onRedy() {
      // 動画の読み込みが終了したタイミング
      const tag = `${this.$options.name}:onRedy`;
      const vm = this;
      this.setVideoHeight();
      this.menuFuncs = [
        {
          title: "Add Interval Tier",
          callback: () => {
            const num = vm.ws.getTierNum();
            vm.addTier(`tier-${num + 1}`, "interval");
          }
        },
        {
          title: "Add Point Tier",
          callback: () => {
            const num = vm.ws.getTierNum();
            vm.addTier(`tier-${num + 1}`, "point");
          }
        }
      ];
      this.log(tag);
      this.isLoading = false;
    },
    onDestroy(val) {
      const tag = `${this.$options.name}:onDestroy`;
      this.log(tag, val);
    },
    onError(val) {
      const tag = `${this.$options.name}:onError`;
      this.log(tag, val);
    },
    onUpdateFiler(payload) {
      const tag = `${this.$options.name}:onUpdateFiler`;
      this.log(tag, payload);
      this.ws.backend.setFilters(payload);
    },
    onUpdateMultiline(payload) {
      if (payload.item) {
        this.text = payload.item.text;
        this.currentTier = this.ws.multiline.tiers[payload.name];
        this.currentIdx = payload.id;
        this.$refs.textField.focus();
      }
    },
    onResize() {
      this.setVideoHeight();
    }
  },
  mounted() {
    const tag = `${this.$options.name}:mounted`;
    this.log(tag);
    if (!this.item) {
      this.$router.push({ name: "Home" });
    } else {
      this.initWs();
    }
  }
};
</script>
