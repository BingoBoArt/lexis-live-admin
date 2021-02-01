<template>
  <audio controls>
    <source v-if="url" :src="url" type="audio/mpeg" />
  </audio>
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
    },
  },
  computed: {
  },
  methods: {
  },
  created() {
  }
}
</script>