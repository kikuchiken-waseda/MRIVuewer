<template>
  <v-list>
    <v-progress-linear
      v-if="loading"
      :active="loading"
      :indeterminate="loading"
      color="light-blue"
    />
    <v-alert prominent type="error" v-else-if="items.length == 0">
      Not Found Any Datas in Your Dropbox.
    </v-alert>
    <v-list-item
      v-else
      v-for="(item, i) in items"
      :key="i"
      @click="to_vuewer(item)"
    >
      <v-list-item-avatar>
        <v-icon>mdi-filmstrip</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>
          {{ item.name }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
import dropbox from "@/api/dropbox";
export default {
  props: {
    url: {
      type: String
    }
  },
  data: () => ({
    loading: false,
    item: 1,
    items: []
  }),
  methods: {
    to_vuewer: function(item) {
      this.$router.push({ name: "vuewer", params: { id: item.path_display } });
    }
  },
  mounted: function() {
    this.loading = true;
    dropbox.path
      .get(this.url)
      .then(res => {
        for (const e of res.entries) {
          this.items.push(e);
        }
      })
      .catch(res => {
        let msg = "";
        const msgs = res.error.split(":");
        if (msgs.length > 1) {
          msg = `${res.status}: ${msgs[1]}`;
        } else {
          msg = `${res.status}: ${msgs[0]}`;
        }
        this.$store.dispatch("show_error", msg);
      })
      .finally(() => {
        this.loading = false;
      });
  }
};
</script>

<style scoped></style>
