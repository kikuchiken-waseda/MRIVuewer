<template>
  <v-app>
    <m-app-bar />
    <v-content>
      <m-side-bar />
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import MAppBar from "@/components/MAppBar.vue";
import MSideBar from "@/components/MSideBar.vue";
export default {
  name: "App",
  components: { MAppBar, MSideBar },
  data: () => ({
    //
  })
};
</script>
