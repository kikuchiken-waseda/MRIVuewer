<template>
  <v-card class="max-auto overflow-y-auto" :style="cardStyle" width="100%">
    <v-tabs v-model="tab" dark background-color="teal darken-3" show-arrows>
      <v-tabs-slider color="teal lighten-3"></v-tabs-slider>
      <v-tab v-for="(item, key) in items" :key="key">
        {{ item.name }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="item in items" :key="item.name">
        <v-card flat>
          <m-interval-tier-table
            v-if="item.tierType == 'interval'"
            :ws="ws"
            :value="item.items"
            :actions="actions.interval"
          />
          <m-point-tier-table
            v-else
            :value="item.items"
            :actions="actions.point"
          />
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import MIntervalTierTable from "./MIntervalTierTable.vue";
import MPointTierTable from "./MPointTierTable.vue";
export default {
  name: "MTierList",
  components: {
    MIntervalTierTable,
    MPointTierTable
  },
  data: () => ({
    tab: null
  }),
  props: {
    items: {
      type: Array
    },
    maxHeight: {
      type: Number
    },
    ws: {
      type: Object
    },
    actions: {
      type: Object
    }
  },
  computed: {
    cardStyle: function() {
      if (this.maxHeight) {
        return `max-height: ${this.maxHeight}px`;
      }
      return "max-height: 400px";
    }
  }
};
</script>
<style scoped></style>
