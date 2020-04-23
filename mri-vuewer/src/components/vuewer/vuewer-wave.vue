<template>
  <div id="wavesurfer">
    <div id="waveform" />
    <div id="wave-spectrogram"></div>
    <div id="wave-timeline"></div>
    <div id="wave-multiline1"></div>
    <div id="wave-multiline2"></div>
    <div id="wave-minimap"></div>
  </div>
</template>

<script>
import WaveSurfer from "wavesurfer.js/dist/wavesurfer.min.js";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js";
import SpectrogramPlugin from "wavesurfer.js/dist/plugin/wavesurfer.spectrogram.min.js";
import MultilinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.multiline.min.js";
import MinimapPlugin from "wavesurfer.js/dist/plugin/wavesurfer.minimap.min.js";

export default {
  data: () => ({
    ws: null,
    spec: null,
    timelinel: null,
    minimap: null,
    tiers: [
      {
        name: "#wave-multiline1",
        tierType: "interval",
        height: 50,
        items: [{ time: 0.0, text: "#" }]
      },
      {
        name: "#wave-multiline2",
        tierType: "point",
        height: 50,
        items: [{ time: 0.0, text: "#" }]
      }
    ],
    options: {
      container: "#waveform",
      waveColor: "violet",
      progressColor: "purple",
      loaderColor: "purple",
      cursorColor: "navy",
      minPxPerSec: 100,
      scrollParent: true
    },
    specOptions: {
      container: "#wave-spectrogram",
      labels: true
    }
  }),
  props: {
    src: {
      type: String,
      required: true
    }
  },
  mounted: function() {
    if (this.src) {
      this.ws = WaveSurfer.create(this.options);
      this.timeline = TimelinePlugin.create({
        container: "#wave-timeline"
      });
      this.spec = SpectrogramPlugin.create(this.specOptions);
      this.minimap = MinimapPlugin.create({
        container: "#wave-minimap",
        waveColor: "#777",
        progressColor: "#222",
        height: 50
      });
      this.ws.addPlugin(this.timeline).initPlugin("timeline");
      this.ws.addPlugin(this.spec).initPlugin("spectrogram");
      this.ws.addPlugin(this.minimap).initPlugin("minimap");
      for (const obj of this.tiers) {
        const tier = MultilinePlugin.create({
          container: obj.name,
          tierType: obj.tierType,
          items: obj.items,
          height: obj.height,
          border: { top: true, bottom: true }
        });
        this.ws.addPlugin(tier).initPlugin("multiline");
      }
      this.ws.load(this.src);
    }
  }
};
</script>

<style scoped></style>
