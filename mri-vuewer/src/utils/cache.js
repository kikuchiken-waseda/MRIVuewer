// import * as localforage from "localforage";
// const STORE = localforage.createInstance({
//   name: process.env.VUE_APP_LOCAlFORAGE_NAME,
//   version: process.env.VUE_APP_LOCAlFORAGE_VERSION
// });
// const STORAGE = window.localStorage;
// const STORAGENEME = process.env.VUE_APP_LOCAlFORAGE_NAME;

const getCache = function() {
  // return JSON.parse(STORAGE.getItem(STORAGENEME));
};
const setCache = function() {
  // const json = JSON.stringify(payload);
  // STORAGE.setItem(STORAGENEME, json);
  // return getCache();
};
const destroyCache = async function() {
  // return await localforage.clear();
};
export default {
  get: getCache,
  set: setCache,
  destroy: destroyCache
};
