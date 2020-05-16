import { Model } from "@vuex-orm/core";
import Item from "./item.js";
export default class Tier extends Model {
  static entity = "tiers";
  static fields() {
    return {
      id: this.attr(null),
      file_id: this.attr(null),
      name: this.attr(""),
      tierType: this.attr(""),
      items: this.hasMany(Item, "tier_id")
    };
  }
}
