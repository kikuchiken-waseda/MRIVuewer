<template>
  <v-navigation-drawer app dark :mini-variant="mini" permanent expand-on-hover>
    <v-list dense nav class="py-0">
      <v-list-item two-line>
        <v-list-item-action>
          <v-icon>mdi-apps</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>検索</v-list-item-title>
          <v-list-item-subtitle>Subtext</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item ripple @click="movieImport">
        <v-list-item-action>
          <v-icon>mdi-playlist-plus</v-icon>
        </v-list-item-action>
        <v-list-item-title>
          File Upload
        </v-list-item-title>
      </v-list-item>
      <v-list-group prepend-icon="mdi-playlist-check">
        <v-list-item slot="activator">
          <v-list-item-title>Files</v-list-item-title>
          <v-list-item
            ripple
            v-for="item in files"
            :key="item.id"
            @click="selectFile(item)"
          >
            <v-list-item-action>
              <v-icon color="red" v-if="item.id === current.movie.id">
                mdi-movie
              </v-icon>
              <v-icon v-else>mdi-movie</v-icon>
            </v-list-item-action>
            <v-list-item-content v-if="item.name">
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data: () => ({
    mini: false,
    files: [
      { id: 0, name: "mock.mp4.1" },
      { id: 1, name: "mock.mp4.2" }
    ],
    current: {
      movie: {
        id: 1
      }
    }
  }),
  methods: {
    movieImport: function() {
      console.info("MSideBar:movieImport");
    },
    selectFile: function(item) {
      console.info("MSideBar:selectFile:", item);
    }
  }
};
</script>
