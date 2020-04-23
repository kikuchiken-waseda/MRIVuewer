<template>
  <div class="movie-annotaion">
    <h1>This is a movie-annotaion page</h1>
    <p>id is {{ id }}</p>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "MovieAnnotaion",
  props: {
    id: {
      type: String,
      required: true
    }
  }
};
</script>
