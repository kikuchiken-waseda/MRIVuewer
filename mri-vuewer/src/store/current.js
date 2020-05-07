/**
 * store/current.js
 *
 * 現在表示の状態を管理します.
 * 基本的には, 現在解析を行っている動画が画像がどれであるかや,
 * 現在表示の動画時刻がいつであるのか, 現在の画面サイズが
 * どの大きさであるのか等を管理します
 */

const TAG = "current";
const MUTATIONTAG = `${TAG}:MUTATION`;
const ACTIONTAG = `${TAG}:ACTION`;

export const current = {
  namespaced: true,
  state: {
    name: null,
    lastModifiedDate: null,
    fileSize: null,
    fileType: null,
    dataUrl: null,
    fps: null,
    videoCurrentTime: null,
    audioCurrentTime: null,
    isPlaying: false,
    size: {
      width: null,
      height: null
    },
    videoStream: {
      bitrate: null,
      codec_name: null,
      fps: null,
      pix_fmt: null,
      tbc: null,
      tbn: null,
      tbr: null
    },
    audioStream: {
      bitrate: null,
      channel_layout: null,
      codec_name: null,
      sample_fmt: null,
      sample_rate: null
    }
  },
  mutations: {
    setName: function(state, payload) {
      console.info(`${MUTATIONTAG}:setName`, payload);
      state.name = String(payload);
    },
    setVideoCurrentTime: function(state, payload) {
      console.info(
        `${MUTATIONTAG}:setVideoCurrentTime`,
        payload
      );
      state.videoCurrentTime = payload;
    },
    setAudioCurrentTime: function(state, payload) {
      console.info(
        `${MUTATIONTAG}:setAudioCurrentTime`,
        payload
      );
      state.AudioCurrentTime = payload;
    },
    setIsPlaying: function(state, payload) {
      console.info(
        `${MUTATIONTAG}:setAudioCurrentTime`,
        payload
      );
      state.isPlaying = payload;
    },
    setLastModifiedData: function(state, payload) {
      console.info(
        `${MUTATIONTAG}:setLastModifiedData`,
        payload
      );
      state.lastModifiedDate = payload;
    },
    setFileSize: function(state, payload) {
      console.info(`${MUTATIONTAG}:setFileSize`, payload);
      state.fileSize = payload;
    },
    setFileType: function(state, payload) {
      console.info(`${MUTATIONTAG}:setFileType`, payload);
      state.fileType = payload;
    },
    setFps: function(state, payload) {
      console.info(`${MUTATIONTAG}:setFps`, payload);
      state.fps = Number(payload);
    },
    setDataUrl: function(state, payload) {
      console.info(`${MUTATIONTAG}:setDataUrl`, payload);
      state.dataUrl = String(payload);
    },
    setSize: function(state, payload) {
      console.info(`${MUTATIONTAG}:setSize`, payload);
      state.size.width = payload.width;
      state.size.height = payload.height;
    },
    setWidth: function(state, payload) {
      console.info(`${MUTATIONTAG}:setWidth`, payload);
      state.size.width = payload;
    },
    setHeight: function(state, payload) {
      console.info(`${MUTATIONTAG}:setHeight`, payload);
      state.size.height = payload;
    },
    setVideoStream: function(state, payload) {
      console.info(
        `${MUTATIONTAG}:setVideoStream`,
        payload
      );
      state.videoStream.codec_name = String(
        payload.codec_name
      );
      state.videoStream.pix_fmt = String(payload.pix_fmt);
      state.videoStream.bitrate = Number(payload.bitrate);
      state.videoStream.fps = Number(payload.fps);
      state.videoStream.tbc = Number(payload.tbc);
      state.videoStream.tbn = Number(payload.tbn);
      state.videoStream.tbr = Number(payload.tbr);
    },
    setAudioStream: function(state, payload) {
      console.info(
        `${MUTATIONTAG}:setAudioStream`,
        payload
      );
      state.audioStream.bitrate = payload.bitrate;
      state.audioStream.channel_layout =
        payload.channel_layout;
      state.audioStream.codec_name = payload.codec_name;
      state.audioStream.sample_fmt = payload.sample_fmt;
      state.audioStream.sample_rate = payload.sample_rate;
    }
  },
  actions: {
    setItem: function(context, payload) {
      console.info(`${ACTIONTAG}:setItem`, payload);
      context.commit("setName", payload.name);
      context.commit(
        "setLastModifiedData",
        payload.lastModifiedDate
      );
      context.commit("setFileSize", payload.fileSize);
      context.commit("setFileType", payload.fileType);
      context.commit("setFps", payload.fps);
      context.commit("setDataUrl", payload.dataUrl);
      context.commit("setSize", payload.size);
      context.commit("setVideoStream", payload.videoStream);
      context.commit("setAudioStream", payload.audioStream);
    },
    setName: function(context, payload) {
      console.info(`${ACTIONTAG}:setName`, payload);
      context.commit("setName", payload);
    },
    setFps: function(context, payload) {
      console.info(`${ACTIONTAG}:setFps`, payload);
      context.commit("setFps", payload);
    },
    setIsPlaying: function(context, payload) {
      console.info(`${ACTIONTAG}:setIsPlaying`, payload);
      context.commit("setIsPlaying", payload);
    },
    setVideoCurrentTime: function(context, payload) {
      console.info(
        `${ACTIONTAG}:setVideoCurrentTime`,
        payload
      );
      context.commit("setVideoCurrentTime", payload);
    },
    setAudioCurrentTime: function(context, payload) {
      console.info(
        `${ACTIONTAG}:setAudioCurrentTime`,
        payload
      );
      context.commit("setAudioCurrentTime", payload);
    },
    setDataUrl: function(context, payload) {
      console.info(`${ACTIONTAG}:setDataUrl`, payload);
      context.commit("setDataUrl", payload);
    },
    setSize: function(context, payload) {
      console.info(`${ACTIONTAG}:setSize`, payload);
      context.commit("setSize", payload);
    },
    setWidth: function(context, payload) {
      console.info(`${ACTIONTAG}:setWidth`, payload);
      context.commit("setWidth", payload);
    },
    setMovieHeight: function(context, payload) {
      console.info(`${ACTIONTAG}:setHeight`, payload);
      context.commit("setHeight", payload);
    },
    setVideoStream: function(context, payload) {
      console.info(`${ACTIONTAG}:setVideoStream`, payload);
      context.commit("setVideoStream", payload);
    },
    setAudioStream: function(context, payload) {
      console.info(`${ACTIONTAG}:setAudioStream`, payload);
      context.commit("setAudioStream", payload);
    }
  }
};
