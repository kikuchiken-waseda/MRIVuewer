<template>
  <v-navigation-drawer
    app
    dark
    expand-on-hover
    :mini-variant.sync="mini"
    permanent
  >
    <v-list dense nav>
      <v-list-item v-if="!mini">
        <v-text-field
          :label="search.label"
          v-model="search.key"
          single-line
          solo
          dense
          rounded
        />
      </v-list-item>
      <v-list-item v-else>
        <v-list-item-action>
          <v-icon>mdi-menu-open</v-icon>
        </v-list-item-action>
      </v-list-item>
      <v-list-item v-if="!mini">
        <v-list-item-subtitle>
          {{ $vuetify.lang.t("$vuetify.sidebar.files.title") }}
        </v-list-item-subtitle>
      </v-list-item>
      <!-- 新規ファイルの作成 -->
      <m-movie-upload-dialog>
        <template v-slot:activator="{ on }">
          <v-list-item ripple v-on="on">
            <v-list-item-action>
              <v-icon>mdi-playlist-plus</v-icon>
            </v-list-item-action>
            <v-list-item-title>
              {{ $vuetify.lang.t("$vuetify.sidebar.files.add") }}
            </v-list-item-title>
          </v-list-item>
        </template>
      </m-movie-upload-dialog>

      <!-- 登録済みファイル一覧 -->
      <v-list-group
        v-if="files.length > 0"
        :prepend-icon="menu.icon"
        v-model="menu.open"
      >
        <template v-slot:activator>
          <v-list-item-title>
            {{ $vuetify.lang.t("$vuetify.sidebar.files.list") }}
          </v-list-item-title>
        </template>
        <v-list-item
          v-for="item in files"
          :key="item.id"
          @click="selectFile(item)"
        >
          <v-list-item-title>
            {{ item.name }}
            <v-spacer />
            ({{ item.fps }} fps)
          </v-list-item-title>
          <v-list-item-action>
            <v-icon>mdi-file-video</v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list-group>
      <v-divider></v-divider>
      <v-list-item ripple @click="clearCache">
        <v-list-item-action>
          <v-icon>mdi-database-remove</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>
            {{ $vuetify.lang.t("$vuetify.sidebar.cache.destroy") }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item ripple @click="importCache">
        <v-list-item-action>
          <v-icon>mdi-database-import</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>
            {{ $vuetify.lang.t("$vuetify.sidebar.cache.import") }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item ripple @click="exportCache">
        <v-list-item-action>
          <v-icon>mdi-database-export</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>
            {{ $vuetify.lang.t("$vuetify.sidebar.cache.export") }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import File from "@/models/file.js";
import MMovieUploadDialog from "@/components/dialog/MMovieUploadDialog.vue";
import Cache from "@/utils/cache.js";
export default {
  name: "MSideBar",
  components: {
    MMovieUploadDialog
  },
  data: () => ({
    name: "MSideBar",
    debug: true,
    mini: true,
    menu: {
      icon: "mdi-playlist-play",
      open: false
    },
    search: {
      key: "",
      label: "search"
    }
  }),
  watch: {
    "search.key": function(val) {
      // 検索文字列存在時にファイル一覧を開く
      const tag = `${this.$options.name}:watch:search.key`;
      if (val) {
        this.log(tag, val);
        this.menu.open = true;
      } else {
        this.menu.open = false;
      }
    },
    mini: function(val) {
      // サイドバー縮小時にファイル一覧を閉じる
      const tag = `${this.$options.name}:watch:mini`;
      this.log(tag, val);
      if (val === true) {
        this.menu.open = false;
      }
    }
  },
  methods: {
    log: function(tag, msg) {
      if (this.debug) {
        console.info(tag, msg);
      }
    },
    selectFile: function(item) {
      const tag = `${this.$options.name}:selectFile`;
      this.log(tag, item.id);
      this.$router.push({ name: "MovieAnnotation", params: { id: item.id } });
    },
    clearCache: async function() {
      const tag = `${this.$options.name}`;
      await Cache.destroy();
      this.log(tag, "clearCache");
      if (this.$route.name != "Home") {
        this.$router.push({ name: "Home" });
      }
    },
    importCache: function() {
      const tag = `${this.$options.name}`;
      this.log(tag, "importCache");
    },
    exportCache: function() {
      const tag = `${this.$options.name}:exportCache`;
      const cache = Cache.get();
      const json = JSON.stringify(cache);
      const blob = new Blob([json], {
        type: "application/json"
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "Cache.json";
      link.click();
      this.log(tag, cache);
    }
  },
  computed: {
    files: function() {
      const tag = `${this.$options.name}:conputed:files:get`;
      let files;
      if (this.search.key) {
        // ファイル検索
        const key = this.search.key;
        files = File.query()
          .where(file => {
            if (~file.name.indexOf(key)) {
              return true;
            }
            if (~key.indexOf("fps")) {
              const fps = Number(key.split("fps")[0].trim());
              return file.fps > fps;
            }
            return false;
          })
          .get();
      } else {
        files = File.query().all();
      }
      this.log(tag, files);
      return files;
    }
  },
  async mounted() {
    await File.$fetch();
  }
};
</script>
