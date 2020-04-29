const STORAGENEME = "vuex";
const STORAGE = window.localStorage;

const getCache = function() {
  return JSON.parse(STORAGE.getItem(STORAGENEME));
};
const setCache = function(payload) {
  const json = JSON.stringify(payload);
  STORAGE.setItem(STORAGENEME, json);
  return getCache();
};
const destroyCache = function() {
  return STORAGE.removeItem(STORAGENEME);
};

export default {
  get: getCache,
  set: setCache,
  destroy: destroyCache
};
