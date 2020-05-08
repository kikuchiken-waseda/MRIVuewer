<template>
  <v-menu
    bottom
    v-model="show"
    :close-on-click="false"
    :close-on-content-click="false"
    left
  >
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on">
        <v-icon>{{ icon }}</v-icon>
      </v-btn>
    </template>
    <v-card style="min-width: 600px">
      <v-toolbar color="primary" dark dense>
        <v-toolbar-title>設定メニュー</v-toolbar-title>
      </v-toolbar>
      <m-func-list title="動画操作" :items="funcs" />
      <v-list
        style="min-width: 600px; max-height: 400px"
        class="overflow-y-auto"
      >
        <v-subheader>イコライザー</v-subheader>
        <v-list-item v-for="(eq, key) in eqs" :key="key">
          <v-list-item-content>
            <v-slider
              v-model="eq.val"
              :min="-40"
              :max="40"
              :label="`f: ${eq.f}`"
            />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list>
        <v-subheader>拡大</v-subheader>
        <v-list-item-content>
          <v-slider v-model="zoom" :min="200" :max="300" />
        </v-list-item-content>
      </v-list>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="show = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import MFuncList from "@/components/util/MFuncList.vue";
export default {
  name: "movie-annotaion-m-setting-menu",
  components: {
    MFuncList
  },
  data: () => ({
    show: false,
    funcs: [],
    zoom: 100,
    eqs: [
      {
        f: 32,
        val: 0,
        type: "lowshelf"
      },
      {
        f: 64,
        val: 0,
        type: "peaking"
      },
      {
        f: 125,
        val: 0,
        type: "peaking"
      },
      {
        f: 250,
        val: 0,
        type: "peaking"
      },
      {
        f: 500,
        val: 0,
        type: "peaking"
      },
      {
        f: 1000,
        val: 0,
        type: "peaking"
      },
      {
        f: 2000,
        val: 0,
        type: "peaking"
      },
      {
        f: 4000,
        val: 0,
        type: "peaking"
      },
      {
        f: 8000,
        val: 0,
        type: "peaking"
      },
      {
        f: 16000,
        val: 0,
        type: "highshelf"
      }
    ]
  }),
  props: {
    icon: {
      type: String,
      default: "mdi-cog"
    },
    ws: Object
  },
  watch: {
    eqs: {
      handler: function(val) {
        const tag = `${this.$options.name}:watch:eqs`;
        console.log(tag, val);
        this.setFilters();
      },
      deep: true
    },
    zoom: function(val) {
      const tag = `${this.$options.name}:zoom`;
      console.log(tag, val);
      this.ws.zoom(Number(val));
    }
  },
  methods: {
    play: function() {
      if (this.ws) {
        this.ws.play();
      }
    },
    setFilters: function() {
      if (this.ws) {
        const tag = `${this.$options.name}:setFilters`;
        console.log(tag);
        const filters = this.eqs.map(eq => {
          const filter = this.ws.backend.ac.createBiquadFilter();
          filter.type = eq.type;
          filter.gain.value = ~~eq.val;
          filter.Q.value = 1;
          filter.frequency.value = eq.f;
          return filter;
        });
        console.log(tag, filters);
        this.$emit("updateFiler", filters);
        // this.ws.backend.setFilters(filters);
      }
    }
  },
  mounted: function() {
    this.funcs.push({ title: "play", icon: "mdi-play", callback: this.play });
  }
};
</script>
