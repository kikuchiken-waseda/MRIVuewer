import { Model } from "@vuex-orm/core";

export default class VideoSize extends Model {
  static entity = "videoSizes";

  static fields() {
    return {
      id: this.attr(null),
      width: this.attr(0),
      height: this.attr(0)
    };
  }
}
