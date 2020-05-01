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
      <v-list-group :prepend-icon="menu.icon" v-model="menu.open">
        <template v-slot:activator>
          <v-list-item-title>
            {{ $vuetify.lang.t("$vuetify.sidebar.files.list") }}
          </v-list-item-title>
        </template>
        <v-list-item
          v-for="(item, i) in files.filter(x => {
            if (search.key) {
              return x.name.match(search.key);
            }
            return true;
          })"
          :key="i"
          @click="selectFile(item)"
        >
          <v-list-item-title v-text="item.name"></v-list-item-title>
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
import MMovieUploadDialog from "@/components/dialog/MMovieUploadDialog.vue";
import Cache from "@/utils/cache.js";
export default {
  name: "MSideBar",
  components: {
    MMovieUploadDialog
  },
  data: () => ({
    name: "MSideBar",
    mini: true,
    menu: {
      icon: "mdi-playlist-play",
      open: false
    },
    search: {
      key: "",
      label: "search"
    },
    files: [],
    current: {
      movie: {
        id: 1
      }
    }
  }),
  watch: {
    "search.key": function(val) {
      // 検索文字列存在時にファイル一覧を開く
      if (val) {
        console.info(this.name + ":" + "watch:search.key:val=" + val);
        this.menu.open = true;
      } else {
        this.menu.open = false;
      }
    },
    mini: function(val) {
      // サイドバー縮小時にファイル一覧を閉じる
      console.info(this.name + ":" + "watch:mini:val=" + val);
      if (val === true) {
        this.menu.open = false;
      }
    }
  },
  methods: {
    importMovie: function() {
      console.info("MSideBar:importMovie");
    },
    selectFile: function(item) {
      console.info("MSideBar:selectFile:", item);
    },
    clearCache: function() {
      console.info("MSideBar:clearCache");
      Cache.destroy();
      this.$router.push({ name: "Home" });
    },
    importCache: function() {
      console.info("MSideBar:importCache");
    },
    exportCache: function() {
      const cache = Cache.get();
      const json = JSON.stringify(cache);
      const blob = new Blob([json], { type: "application/json" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "Cache.json";
      link.click();
      console.info("MSideBar:exportCache", cache);
    }
  },
  mounted: function() {
    for (let i = 0; i < 100; i++) {
      this.files.push({ id: i, name: `mock${i}.mp4` });
      i++;
    }
  }
};
</script>
