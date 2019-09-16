<template>
  <v-container>
    <v-layout wrap>
      <v-flex>
        <v-card class="mx-auto" max-width="1904">
          <v-card-text>
            <p class="display-1 text--primary">
              Welcome to MRI-VUEWER
            </p>
            <p class="subheading font-weight-regular">
              このアプリケーションでは
              動画ファイルのアノテーションを行うことができます.
            </p>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <m-tooltip-btn class="ma-1" :btn="btn0" />
            <div class="flex-grow-1"></div>
            <m-tooltip-btn class="ma-1" :btn="btn1" />
            <m-tooltip-btn class="ma-1" :btn="btn2" />
          </v-card-actions>
        </v-card>
        <m-d-filer class="mx-auto mt-4" max-width="1904" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import MTooltipBtn from "@/components/widgets/MTooltipBtn";
import MDFiler from "@/components/MDFiler/MDFiler.vue";
export default {
  components: { MTooltipBtn, MDFiler },
  data: () => ({
    btn0: {
      label: "LOGIN DROPBOX",
      icon: "mdi-login",
      color: "primary",
      caption: "DROPBOX にログインします"
    },
    btn1: {
      label: "Open your movie",
      icon: "mdi-file-upload",
      color: "primary",
      caption: "動画ファイルをアップロードします"
    },
    btn2: {
      label: "Go to sample movie",
      icon: "mdi-information",
      color: "primary",
      caption: "サンプル動画を表示します"
    }
  })
};
</script>
