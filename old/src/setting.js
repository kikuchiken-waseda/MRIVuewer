/**
 * @desc MRIViewer で使用する設定情報を管理します.
 */

// eslint-disable-next-line no-unused-vars
const SETTING = {
  files: [
    { url: './misc/10.mp4', fps: 13.84 },
    { url: './misc/11.mp4', fps: 13.84 },
    { url: './misc/28.mp4', fps: 13.84 }
  ],
  wavesurfer: {
    container: '#wave-form',
    waveColor: 'violet',
    progressColor: 'purple',
    minPxPerSec: 200,
    scrollParent: true,
    minimap: true,
    normalize: true
  },
  region: {
    dragSelection: {
      slop: 5
    },
    color: 'rgba(255,183,77, 0.3)'
  },
  spectrogram: {
    container: '#wave-spectrogram',
    fftSamples: 256,
    brightness: 1,
    labels: true
  },
  timeline: {
    container: '#wave-timeline'
  },
  minimap: {
    height: 30,
    waveColor: '#ddd',
    progressColor: '#999',
    cursorColor: '#999'
  },
  marker: {
    color: 'rgba(244,81,30 ,1)',
    pointSize: 5
  }
}
