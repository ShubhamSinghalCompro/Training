<script setup lang="ts">
import { ref } from 'vue'
import Block from './components/Block.vue'
import Results from './components/Results.vue'
const isPlaying = ref(false)
const delay = ref(0)
const score = ref(0)

const start = () => {
  score.value = 0
  delay.value = 2000 + Math.random() * 5000
  isPlaying.value = true
}

const endGame = (reactionTime: number) => {
  isPlaying.value = false
  console.log(reactionTime)
  score.value = reactionTime
}
</script>

<template>
  <h1>Reaction Timer</h1>
  <button @click="start" :disabled="isPlaying">Play</button>
  <Block v-if="isPlaying" :delay="delay" @end="endGame" />
  <Results v-if="!isPlaying && score !== 0" :score="score" />
</template>
<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
