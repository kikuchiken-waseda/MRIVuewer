import { Model } from "@vuex-orm/core";
export default class Point extends Model {
  static entity = "points";
  static fields() {
    return {
      id: this.attr(null),
      tier_id: this.attr(null),
      text: this.attr(""),
      time: this.attr(0),
      dataUrl: this.attr("")
    };
  }
}
