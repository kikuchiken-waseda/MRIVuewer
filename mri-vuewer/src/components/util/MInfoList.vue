<template>
  <v-list>
    <v-subheader v-if="title">{{ title }}</v-subheader>
    <v-list-item two-line v-for="(item, key) in items" :key="key">
      <v-list-item-title>
        {{ item.title }}
        <v-tooltip bottom v-if="item.help">
          <template v-slot:activator="{ on }">
            <v-icon v-on="on">
              mdi-information
            </v-icon>
          </template>
          <span>{{ item.help }}</span>
        </v-tooltip>
      </v-list-item-title>
      <v-list-item-subtitle>
        {{ item.val }}
      </v-list-item-subtitle>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  props: {
    items: {
      type: Array
    },
    title: {
      type: String
    }
  }
};
</script>

<style scoped></style>
