<template>
  <v-app>
    <v-navigation-drawer right fixed
      style="z-index: 11;"
      v-model="drawer" app>
      <v-list>
        <!-- ファイルアップロード --> 
        <v-divider></v-divider>
        <v-list-tile ripple
          @click="movieImport">
          <v-list-tile-action>
            <v-icon>
              playlist_add
            </v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              File Upload
            </v-list-tile-title>
            <input
              v-on:change="movieSelected"
              type="file"
              name="movieImport"
              ref="movieImport">
            <output id="list"></output>
          </v-list-tile-content>
        </v-list-tile>
        <!-- リンク --> 
        <v-list-group
          prepend-icon="playlist_add_check"
          value="true">
          <v-list-tile slot="activator">
            <v-list-tile-title>
              Files
            </v-list-tile-title>
          </v-list-tile>
          <v-list-tile ripple
            v-for="item in files"
            :key="item.url"
            v-on:click="selectFile(item)">
            <v-list-tile-action>
              <v-icon color="red"
                v-if="item.url===target.url">
                movie
              </v-icon>
              <v-icon v-else>
                movie
              </v-icon>
            </v-list-tile-action>
            <v-list-tile-content
              v-if="item.name">
              <v-list-tile-title>
                {{item.name}}
              </v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-content v-else>
              <v-list-tile-title>
                {{item.url}}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
        <v-list-tile ripple
          @click="clear">
          <v-list-tile-action>
            <v-icon>
              delete_sweep
            </v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
                キャッシュの削除(すべて)
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar
      color="indigo"
      style="z-index: 10;"
      dark fixed app>
      <v-toolbar-title>
        {{app}} ver.{{version}} 
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-side-icon
        @click="drawer = !drawer">
      </v-toolbar-side-icon>
    </v-toolbar>

    <v-content>
      <FileSelector
        :app=app
        :version=version
        :target=target
        @set="movieImport"
      />
    </v-content>

    <v-footer
      style="z-index: 11;"
      justify-center
      align-center
      text-center
      color="indigo"
      app inset>
      <span class="white--text">
        {{app}} ver.{{version}} &copy;
        {{year}} {{author}}
      </span>
    </v-footer>
  </v-app>
</template>

<script>
import FileSelector from './components/v-file-selector'
const fps = 13.78310345
const files = []

export default {
  name: 'App',
  components: {
    FileSelector
  },
  data () {
    return {
      app: 'MRI Vuewer',
      version: 1.3,
      year: 2018,
      author: 'qh73xe@waseda',
      drawer: false,
      files: files,
      target: { url: null, fps: null },
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
      }
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
}
</script>

<style scoped lang="scss">
  input {
    height: 0px;
    visibility: hidden;
    position: absolute;
  }
</style>
