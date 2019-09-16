<template>
  <video :src="media.url" controls></video>
</template>

<script>
import dropbox from "@/api/dropbox";
export default {
  data: () => ({
    loading: false,
    media: {
      blob: null,
      url: null
    }
  }),
  methods: {
    set_media: function(id) {
      this.loading = true;
      dropbox.file
        .get(id)
        .then(res => {
          console.log(res);
          this.media.blob = res.fileBlob;
          this.media.url = window.URL.createObjectURL(res.fileBlob);
        })
        .catch(res => {
          console.error(res);
          this.$store.dispatch("show_error", res.error);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  },
  computed: {
    id: function() {
      return this.$route.params.id;
    }
  },
  mounted: function() {
    this.set_media(this.id);
  }
};
</script>
<style scoped></style>
