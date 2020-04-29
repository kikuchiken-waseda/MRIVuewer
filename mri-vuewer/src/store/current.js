/**
 * store/current.js
 *
 * 現在表示の状態を管理します.
 * 基本的には, 現在解析を行っている動画が画像がどれであるかや,
 * 現在表示の動画時刻がいつであるのか, 現在の画面サイズが
 * どの大きさであるのか等を管理します
 */
export const current = {
  namespaced: true,
  state: {
    name: null,
    fps: null,
    dataUrl: null
  },
  mutations: {
    setMovieName: function(state, payload) {
      state.name = payload;
    },
    setMovieFps: function(state, payload) {
      state.fps = payload;
    },
    setMovieDataUrl: function(state, payload) {
      state.dataUrl = payload;
    }
  },
  actions: {
    setMovie: function(context, payload) {
      console.log("current:actions:setMovie", payload);
      const name = payload.name;
      const fps = payload.fps;
      const dataUrl = payload.dataUrl;
      context.commit("setMovieName", name);
      context.commit("setMovieFps", fps);
      context.commit("setMovieDataUrl", dataUrl);
    },
    setMovieName: function(context, payload) {
      console.log("current:actions:setMovieName", payload);
      context.commit("setMovieName", payload);
    },
    setMovieFps: function(context, payload) {
      console.log("current:actions:setMovieFps", payload);
      context.commit("setMovieFps", payload);
    },
    setMovieDataUrl: function(context, payload) {
      console.log("current:actions:setMovieDataUrl", payload);
      context.commit("setMovieDataUrl", payload);
    }
  }
};
