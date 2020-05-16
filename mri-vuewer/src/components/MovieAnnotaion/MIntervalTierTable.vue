<template>
  <v-data-table
    :headers="headers"
    :items="items"
    sort-by="calories"
    class="elevation-1"
  >
    <template v-slot:item.actions="{ item }">
      <v-btn
        v-for="act in actions"
        :key="act.name"
        :color="act.color"
        icon
        small
      >
        <v-icon small @click="act.callback(item)">
          {{ act.icon }}
        </v-icon>
      </v-btn>
    </template>
    <template v-slot:item.startTime="{ item }">
      {{ Math.round(item.startTime * 100) / 100 }}
    </template>
    <template v-slot:item.endTime="{ item }">
      {{ Math.round(item.endTime * 100) / 100 }}
    </template>
  </v-data-table>
</template>
<script>
export default {
  name: "MIntervalTierTable",
  data: () => ({
    dialog: false,
    headers: [
      { text: "Start Time", value: "startTime" },
      { text: "End Time", value: "endTime" },
      { text: "Texts", value: "text" },
      { text: "Actions", value: "actions", sortable: false }
    ]
  }),
  props: {
    value: {
      type: Array
    },
    ws: {
      type: Object
    },
    actions: {
      type: Array
    }
  },
  computed: {
    items: {
      get() {
        const vm = this;
        let idx = -1;
        if (this.value) {
          return this.value.map(function(item) {
            idx++;
            const endTime =
              idx == vm.value.length - 1
                ? vm.ws.getDuration()
                : vm.value[idx + 1].time;
            return {
              text: item.text ? item.text : "",
              startTime: item.time,
              endTime: endTime
            };
          });
        } else {
          return [];
        }
      },
      set(diff) {
        this.$emit("input", { ...this.value, ...diff });
      }
    }
  }
};
</script>
