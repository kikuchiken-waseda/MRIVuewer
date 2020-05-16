/**
 * store/files.js
 *
 * アプリケーションに登録された動画ファイルを管理します
 */
import moment from "moment";
import { Model } from "@vuex-orm/core";
import AudioStream from "./audioStream.js";
import VideoStream from "./videoStream.js";
import VideoSize from "./videoSize.js";
import Tier from "./tier.js";

export default class File extends Model {
  static entity = "files";
  static fields() {
    return {
      id: this.attr(null),
      audioStream_id: this.attr(null),
      videoStream_id: this.attr(null),
      videoSize_id: this.attr(null),
      name: this.attr(""),
      duration: this.attr(0),
      fileSize: this.attr(""),
      fileType: this.attr(""),
      fps: this.number(0),
      dataUrl: this.attr(""),
      lastModifiedDate: this.string(moment().format()),
      currentTime: this.number(0),
      audioStream: this.belongsTo(AudioStream, "audioStream_id"),
      videoStream: this.belongsTo(VideoStream, "videoStream_id"),
      size: this.belongsTo(VideoSize, "videoSize_id"),
      tiers: this.hasMany(Tier, "file_id")
    };
  }
}
