<template>
  <div class="home">
    <div v-if="!$vuetify.breakpoint.smAndDown">
      <h3 class="display-3">{{ name }} ver.{{ version }}</h3>
      <div class="subheading">
        MP4 動画アノテーションツール
      </div>
      <v-divider class="my-3"></v-divider>
    </div>
    <div class="title mb-3">動画読み込み</div>
    <v-btn class="mx-0" color="blue-grey" dark large @click="movieImport">
      Open your movie
    </v-btn>
    <div class="caption py-1">
      <v-icon>mdi-information</v-icon>
      任意の動画ファイルをアノテーション用に取り込みます.
    </div>
    <v-divider class="my-3"></v-divider>

    <div class="title mb-3">サンプル</div>
    <v-btn class="mx-0" color="blue-grey" dark large @click="importSampleMovie">
      Go to sample movie
    </v-btn>
    <div class="caption">
      <v-icon>mdi-information</v-icon>
      サンプル動画を使いアノテーション機能を試します.
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
export default {
  name: "Home",
  computed: {
    name: {
      get() {
        return this.$store.state.appName;
      }
    },
    version: {
      get() {
        return this.$store.state.appVersion;
      }
    }
  },
  methods: {
    importMovie: function() {
      console.info("Home:importMovie");
    },
    importSampleMovie: function() {
      console.info("Home:importSampleMovie");
    }
  }
};
</script>
