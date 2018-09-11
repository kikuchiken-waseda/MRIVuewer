<template>
  <v-container
    fluid
    fill-height
    v-if="target.url">
    <VideoPlayer/>
  </v-container>
  <v-responsive v-else>
    <v-container fill-height>
      <v-layout align-center>
        <v-flex>
          <h3 class="display-3">
            Welcome to {{app}} ver.
            {{version}}
          </h3>
          <span class="subheading">
            このアプリケーションでは
            動画ファイルの
            アノテーションを行うことが
            できます.
            現在はこのアプリケーションに
            動画ファイルが
            設定されていないので,
            下のボタンから任意の
            動画ファイルを
            アップロードしてください.
          </span>
          <v-divider class="my-3">
          </v-divider>
          <div class="title mb-3">
            動画アップロード
          </div>
          <v-btn large
            class="mx-0"
            color="primary"
            @click="$emit('set')">
            Open your movie
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-responsive>
</template>

<script>
import VideoPlayer from './v-video-player'
export default {
  name: 'FileSelector',
  components: {
    VideoPlayer
  },
  props: {
    app: String,
    version: Number,
    target: Object
  }
}
</script>
