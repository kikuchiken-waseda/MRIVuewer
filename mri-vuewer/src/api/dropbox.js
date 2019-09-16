import { Dropbox } from "dropbox";
const TOKEN = process.env.VUE_APP_DROPBOX_TOKEN;
const ROOT = "/realTimeMRI/";
const CLIENT = new Dropbox({ accessToken: TOKEN });

const urlJoin = (...args) =>
  args
    .join("/")
    .replace(/[/]+/g, "/")
    .replace(/^(.+):\//, "$1://")
    .replace(/^file:/, "file:/")
    .replace(/\/(\?|&|#[^!])/g, "$1")
    .replace(/\?/g, "&")
    .replace("&", "?");

export default {
  file: {
    get: function(path = null) {
      let url = ROOT;
      if (path) {
        url = urlJoin(url, path);
      }
      return CLIENT.filesListFolder({ path: url });
    }
  }
};
