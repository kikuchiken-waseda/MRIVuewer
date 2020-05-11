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
          <v-simple-table>
            <template v-slot:default>
              <tbody v-if="item.tierType == 'interval'">
                <tr v-for="(x, idx) in item.items" :key="idx">
                  <td>{{ x.text }}</td>
                  <td>{{ x.time }}</td>
                  <td v-if="idx == item.items.length - 1">
                    {{ ws.getDuration() }}
                  </td>
                  <td v-else>
                    {{ item.items[Number(idx + 1)].time }}
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr v-for="(x, key) in item.items" :key="key">
                  <td>{{ x.text }}</td>
                  <td>{{ x.time }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
export default {
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
