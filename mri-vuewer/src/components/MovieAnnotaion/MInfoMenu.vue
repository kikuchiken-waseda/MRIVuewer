<template>
  <v-menu bottom v-model="show" left>
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on">
        <v-icon>{{ icon }}</v-icon>
      </v-btn>
    </template>
    <v-card class="mx-auto">
      <v-toolbar color="primary" dark dense>
        <v-toolbar-title>
          {{
            $vuetify.lang.t(
              "$vuetify.movieAnnotation.info.title"
            )
          }}
        </v-toolbar-title>
      </v-toolbar>
      <m-info-list
        title="video stream"
        :items="value.videoStream"
        v-if="value.videoStream"
      />
      <m-info-list
        title="audio stream"
        :items="value.audioStream"
        v-if="value.audioStream"
      />
    </v-card>
  </v-menu>
</template>

<script>
import MInfoList from "@/components/util/MInfoList.vue";
export default {
  name: "movie-annotaion-m-info-menu",
  components: {
    MInfoList
  },
  data: () => ({
    show: false
  }),
  props: {
    icon: {
      type: String,
      default: "mdi-help-circle"
    },
    value: {
      type: Object
    }
  }
};
</script>
