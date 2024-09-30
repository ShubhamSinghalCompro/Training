<template>
  <div class="jobs" v-if="jobs.length">
    <h1>Jobs</h1>

    <div v-for="job in jobs" :key="job.id" class="job">
      <RouterLink :to="{ name: 'job-detail', params: { id: job.id } }">
        <h2>{{ job.title }}</h2></RouterLink
      >
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
const jobs = ref([])
onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/jobs')
    jobs.value = await res.json()
  } catch (err) {
    console.log(err)
  }
})
</script>

<style scoped>
.job h2 {
  background: #f4f4f4;
  padding: 20px;
  border-radius: 10px;
  margin: 10px auto;
  max-width: 600px;
  cursor: pointer;
  color: #444;
}

.job h2:hover {
  background: #ddd; /* Light gray */
}

.job a {
  text-decoration: none;
}
</style>
