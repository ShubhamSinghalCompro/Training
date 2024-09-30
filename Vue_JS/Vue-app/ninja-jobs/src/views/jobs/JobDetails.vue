<template>
  <div>
    <h1>Job Details</h1>
    <p>The job id is {{ props.id }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

</script>

<style scoped>

</style>
