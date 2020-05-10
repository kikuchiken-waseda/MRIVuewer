import { Model } from "@vuex-orm/core";

export default class VideoStream extends Model {
  static entity = "videoStreams";

  static fields() {
    return {
      id: this.attr(null),
      codec_name: this.string(""),
      pix_fmt: this.string(""),
      bitrate: this.number(0),
      fps: this.number(0),
      tbc: this.number(0),
      tbn: this.number(0),
      tbr: this.number(0)
    };
  }
}
