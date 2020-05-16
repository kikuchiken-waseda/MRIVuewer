<template>
  <v-container v-resize="onResize" fluid class="pa-0 movie-annotaion">
    <v-col cols="5">
      <v-card>
        <v-img :src="item.dataUrl" contain></v-img>
      </v-card>
    </v-col>
  </v-container>
</template>

<script>
// @ is an alias to /src
import Item from "@/models/item.js";
export default {
  name: "ImageAnnotaion",
  computed: {
    item: {
      get: function() {
        return Item.find(this.$route.params.id);
      },
      set: function(payload) {
        Item.$update({
          where: this.$route.params.id,
          data: payload
        });
      }
    }
  },
  methods: {
    onResize: function(payload) {
      console.log(payload);
    }
  },
  async mounted() {
    await Item.$fetch();
  }
};
</script>
