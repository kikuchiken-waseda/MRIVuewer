<template>
  <div class="component-debug">
    <h1>This is a component-debug page</h1>
    <p>id is {{ id }}</p>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
export default {
  name: "ComponentDebug",
  props: {
    id: {
      type: String,
      required: true
    }
  }
};
</script>
