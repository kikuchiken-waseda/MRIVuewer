<template>
  <div class="image-annotation">
    <h1>This is an image-annotation page</h1>
    <p>id is {{ id }}</p>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
export default {
  name: "ImageAnnotaion",
  props: {
    id: {
      type: String,
      required: true
    }
  }
};
</script>
