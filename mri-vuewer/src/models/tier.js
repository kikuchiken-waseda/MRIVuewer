import { Model } from "@vuex-orm/core";
import Point from "./point.js";
export default class Tier extends Model {
  static entity = "tiers";
  static fields() {
    return {
      id: this.attr(null),
      file_id: this.attr(null),
      name: this.attr(""),
      tierType: this.attr(""),
      points: this.hasMany(Point, "tier_id")
    };
  }
}
