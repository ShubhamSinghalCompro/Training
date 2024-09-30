<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  delay: Number
})

const showBlock = ref(false)
const timer = ref(null)
const reactionTime = ref(0)

const end = defineEmits(['end'])

onMounted(() => {
  setTimeout(() => {
    showBlock.value = true
    startTimer()
  }, props.delay)
})

const startTimer = () => {
  timer.value = setInterval(() => {
    reactionTime.value += 10
  }, 10)
}

const stopTimer = () => {
  clearInterval(timer.value)
  console.log(reactionTime.value)
  end('end', reactionTime.value)
}
</script>

<template>
  <div class="block" v-if="showBlock" @click="stopTimer">click me</div>
</template>

<style scoped>
.block {
  width: 400px;
  border-radius: 20px;
  background-color: #0faf87;
  color: white;
  text-align: center;
  padding: 100px 0;
  margin: 20px auto;
  cursor: pointer;
}
</style>
