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
    <template v-slot:item.time="{ item }">
      {{ Math.round(item.time * 100) / 100 }}
    </template>
  </v-data-table>
</template>
<script>
export default {
  name: "MPointTierTable",
  data: () => ({
    dialog: false,
    headers: [
      { text: "Time", value: "time" },
      { text: "Texts", value: "text" },
      { text: "Actions", value: "actions", sortable: false }
    ]
  }),
  props: {
    value: {
      type: Array
    },
    actions: {
      type: Array
    }
  },
  computed: {
    items: {
      get() {
        return this.value;
      },
      set(diff) {
        this.$emit("input", { ...this.value, ...diff });
      }
    }
  }
};
</script>
