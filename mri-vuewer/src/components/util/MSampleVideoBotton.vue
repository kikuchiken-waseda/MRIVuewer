<template>
  <v-btn
    color="primary"
    dark
    large
    @click="importSampleMovie"
    :loading="video.loading"
  >
    {{ $vuetify.lang.t("$vuetify.home.demo.btn") }}
  </v-btn>
</template>

<script>
import FileUtil from "@/utils/file.js";
import VideoUtil from "@/utils/video.js";
export default {
  data: () => ({
    video: {
      loading: false
    }
  }),
  methods: {
    importSampleMovie: async function() {
      const tag = `${this.$options.name}:importSampleMovie`;
      console.info(tag);
      this.video.name = "sample.mp4";
      this.video.loading = true;
      this.video.fileSize = 1571328;
      this.video.fileType = "video/mp4";
      const url =
        "https://kikuchiken-waseda.github.io/MRIVuewer/misc/6.mp4";
      this.name = "6.mp4";
      const file = await FileUtil.download(
        url,
        "sample.mp4",
        {
          type: "video/mp4"
        }
      );
      this.video.dataUrl = await FileUtil.toBase64(file);
      const buff = FileUtil.toBuff(this.video.dataUrl);
      VideoUtil.info(buff, res => {
        this.video.size = res.size;
        if (res.videoStream) {
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
          this.video.audioStream = {
            codec_name: res.audioStream.codec_name,
            sample_rate: res.audioStream.sample_rate,
            channel_layout: res.audioStream.channel_layout,
            sample_fmt: res.audioStream.sample_fmt,
            bitrate: res.audioStream.bitrate
          };
        }
        this.video.loading = false;
        console.log(tag, this.video);
        this.$store.dispatch("current/setItem", this.video);
        this.$router.push({ name: "MovieAnnotation" });
      });
    }
  }
};
</script>
