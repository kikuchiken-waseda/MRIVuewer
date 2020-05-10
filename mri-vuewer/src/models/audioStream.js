import { Model } from "@vuex-orm/core";

export default class AudioStream extends Model {
  static entity = "audioStreams";

  static fields() {
    return {
      id: this.attr(null),
      codec_name: this.string(""),
      bitrate: this.number(0),
      channel_layout: this.string("mono"),
      sample_fmt: this.string(""),
      sample_rate: this.number(0)
    };
  }
}
