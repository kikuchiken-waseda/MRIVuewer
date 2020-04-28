/**
 * store/files.js
 *
 * アプリケーションに登録された動画ファイルを管理します
 */
import moment from "moment";
import { Model } from "@vuex-orm/core";

export default class File extends Model {
  static entity = "files";
  static fields() {
    return {
      id: this.uid(),
      fps: this.number(0),
      name: this.attr(""),
      dataUrl: this.attr(""),
      created_at: this.string(moment().format())
    };
  }
}
