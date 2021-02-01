<template>
<video controls :src="url">
  <source :src="url" type="video/mp4">
  <source :src="url" type="video/ogg">
  <source :src="url" type="video/webm">
  <object :data="url">
      <embed :src="url">
  </object>
</video>
</template>
<script>
    export default {
          data() {
            return {
            }
        },
        props: {
          url: {
            type: String,
            default: ""
          }
        },
        computed: {
        },
        methods: {
        },
    }
</script>