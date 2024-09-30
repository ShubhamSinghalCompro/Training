<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <h1>Results</h1>
    <p>Your reaction time was: {{ props.score }} ms</p>
    <p class="rank">{{ rank }}</p>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  score: Number
})

const rank = ref('')

onMounted(() => {
  rank.value = getRank()
})

const getRank = () => {
  if (props.score < 250) {
    return 'Ninja Fingers'
  } else if (props.score < 400) {
    return 'Rapid Reflexes'
  } else {
    return 'Snail pace...'
  }
}
</script>

<style scoped>
.rank {
  font-size: 1.4rem;
  color: #0faf87;
  font-weight: bold;
}
</style>
