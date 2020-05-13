<template>
  <v-container fluid class="pa-0">
    <v-row class="py-0">
      <v-col cols="4" class="py-0">
        <v-card flat :color="background">
          <v-system-bar dark color="accent">
            {{ frameOffset }}フレーム前の画像
          </v-system-bar>
          <video
            v-if="src"
            muted
            ref="videoPre"
            :style="videoStyle"
            :src="src"
          />
        </v-card>
      </v-col>
      <v-col cols="4" class="py-0">
        <v-card flat :color="background">
          <v-system-bar dark color="accent">
            現在画像
          </v-system-bar>
          <video
            v-if="src"
            ref="video"
            @loadeddata="onLoadeddata"
            :style="videoStyle"
            :src="src"
          />
        </v-card>
      </v-col>
      <v-col cols="4" class="py-0">
        <v-card flat :color="background">
          <v-system-bar dark color="accent">
            {{ frameOffset }}フレーム後の画像
          </v-system-bar>
          <video
            muted
            v-if="src"
            ref="videoPos"
            :style="videoStyle"
            :src="src"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "MVideoArray",
  props: {
    src: {
      type: String,
      requested: true
    },
    frameOffset: {
      type: Number,
      default: 1
    }
  },
  data: () => ({
    el: null,
    debug: true,
    background: "grey lighten-3",
    videoStyle: {
      width: "100%",
      height: "auto"
    }
  }),
  methods: {
    // ユーティリティ関数
    log: function(tag, msg) {
      if (this.debug) {
        console.info(tag, msg);
      }
    },
    // イベント発火
    onLoadeddata() {
      const tag = `${this.$options.name}:onLoadeddata`;
      this.el = this.$refs.video;
      this.log(tag, this.el);
      this.$emit("loadeddata", this.el);
    }
  }
};
</script>
