<template>
  <div>
    <v-btn
      color="primary"
      dark
      large
      @click="importSampleMovie"
      :loading="video.loading"
    >
      {{ $vuetify.lang.t("$vuetify.home.demo.btn") }}
    </v-btn>
    <pre v-if="debug">
    {{ item }}
    </pre>
  </div>
</template>

<script>
import File from "@/models/file.js";
import FileUtil from "@/utils/file.js";
import VideoUtil from "@/utils/video.js";
export default {
  data: () => ({
    debug: false,
    item: {
      fps: 13.79
    },
    video: {
      loading: false
    }
  }),
  methods: {
    log: function(tag, msg) {
      if (this.debug) {
        console.info(tag, msg);
      }
    },
    importSampleMovie: async function() {
      const tag = `${this.$options.name}:importSampleMovie`;
      this.item.name = "sample.mp4";
      this.item.loading = true;
      this.item.fileSize = 1571328;
      this.item.fileType = "video/mp4";
      const url = "https://kikuchiken-waseda.github.io/MRIVuewer/misc/6.mp4";
      const file = await FileUtil.download(url, this.item.name, {
        type: "video/mp4"
      });
      this.item.dataUrl = await FileUtil.toBase64(file);
      const buff = FileUtil.toBuff(this.item.dataUrl);
      VideoUtil.info(buff, res => {
        this.item.size = res.size;
        if (res.videoStream) {
          this.item.fps = res.videoStream.fps
            ? res.videoStream.fps
            : this.item.fps;
          this.item.videoStream = {
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
          this.item.audioStream = {
            codec_name: res.audioStream.codec_name,
            sample_rate: res.audioStream.sample_rate,
            channel_layout: res.audioStream.channel_layout,
            sample_fmt: res.audioStream.sample_fmt,
            bitrate: res.audioStream.bitrate
          };
        }
        this.log(tag + ":inserteItem", this.item);
        File.insertOrUpdate({ data: this.item }).then(() => {
          const file = File.query().last();
          this.log(tag + ":insertedItem", file);
          this.video.loading = false;
          this.$router.push({
            name: "MovieAnnotation",
            params: { id: file.id }
          });
        });
      });
    }
  }
};
</script>
