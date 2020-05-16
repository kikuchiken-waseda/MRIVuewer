<template>
  <div>
    <v-file-input
      :label="`${$vuetify.lang.t('$vuetify.movieUploadDialog.file.title')}*`"
      :hint="$vuetify.lang.t('$vuetify.movieUploadDialog.file.hint')"
      v-model="video.file"
      prepend-icon="mdi-file-video"
      accept="video/*"
      show-size
      @change="onChangeFileInput"
    />
  </div>
</template>

<script>
import VideoUtil from "@/utils/video.js";
import FileUtil from "@/utils/file.js";
export default {
  name: "MMovieInput",
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    debug: false
  }),
  computed: {
    video: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("onChangeFileInput", val);
      }
    }
  },
  methods: {
    log: function(tag, msg) {
      if (this.debug) {
        console.info(tag, msg);
      }
    },
    initItem: function() {
      this.video.dataUrl = null;
      this.video.name = null;
      this.video.fps = null;
      this.video.duration = null;
      this.video.size = {
        width: null,
        height: null
      };
      this.video.videoStream = {
        codec_name: null,
        pix_fmt: null,
        bitrate: null,
        fps: null,
        tbc: null,
        tbn: null,
        tbr: null
      };
      this.video.audioStream = {
        bitrate: null,
        channel_layout: null,
        codec_name: null,
        sample_fmt: null,
        sample_rate: null
      };
    },
    onChangeFileInput: async function(e) {
      const tag = `${this.$options.name}:onChangeFileInput`;
      this.video.loading = true;
      if (e) {
        this.video.name = e.name;
        if (e.arrayBuffer) {
          const buff = await e.arrayBuffer();
          VideoUtil.info(buff, res => {
            this.video.size = res.size;
            if (res.duration) {
              this.log(tag + ":set duration", res.duration);
              this.video.duration = res.duration;
            }
            if (res.videoStream) {
              this.log(tag + ":set video", res.videoStream);
              this.video.fps = res.videoStream.fps
                ? res.videoStream.fps
                : this.video.fps;
              this.video.videoStream = {
                codec_name: res.videoStream.codec_name,
                pix_fmt: res.videoStream.pix_fmt,
                bitrate: res.videoStream.bitrate,
                fps: res.videoStream.fps,
                tbc: res.videoStream.tbc,
                tbn: res.videoStream.tbn,
                tbr: res.videoStream.tbr
              };
            }
            if (res.audioStream) {
              this.log(tag + ":set audio", res.videoStream);
              this.video.audioStream = {
                codec_name: res.audioStream.codec_name,
                sample_rate: res.audioStream.sample_rate,
                channel_layout: res.audioStream.channel_layout,
                sample_fmt: res.audioStream.sample_fmt,
                bitrate: res.audioStream.bitrate
              };
            }
          });
          this.video.dataUrl = await FileUtil.toBase64(this.video.file);
        } else {
          this.initItem();
        }
        this.video.loading = false;
      } else {
        this.initItem();
        console.warn(tag, "no video", this.video);
        this.video.loading = false;
      }
    }
  }
};
</script>

<style scoped></style>
