<template>
  <form @submit.prevent="handleSubmit">
    <label>Email</label>
    <input type="email" required v-model="formDetails.email" />
    <label>Password</label>
    <input type="password" required v-model="formDetails.password" />
    <div v-if="formDetails.passwordError" class="error">{{ formDetails.passwordError }}</div>
    <label>Role</label>
    <select v-model="formDetails.role">
      <option value="developer">Web Developer</option>
      <option value="designer">Web Designer</option>
      <option value="youtuber">YouTuber</option>
      <option value="other">Other</option>
    </select>
    <!-- Keyboard Events -->

    <label>Skills</label>
    <input type="text" @keyup="addSkill" @keydown="handleKeyDown" v-model="formDetails.tempSkill" />

    <div v-for="skill in formDetails.skills" :key="skill" class="pill">
      <div class="skill">
        <p>{{ skill }}</p>
        <p class="close" @click="removeSkill(skill)">&#10005;</p>
      </div>
    </div>

    <div class="terms">
      <input type="checkbox" required v-model="formDetails.terms" />
      <label>Accept terms and conditions</label>
    </div>

    <div class="submit" v-if="formDetails.terms">
      <button>Submit</button>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const formDetails = ref({
  email: '',
  password: '',
  passwordError: '',
  role: 'developer',
  terms: false,
  tempSkill: '',
  skills: []
})

const handleKeyDown = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    e.stopPropagation()
  }
}

const addSkill = (e) => {
  const trimmedSkill = formDetails.value.tempSkill.trim()

  if ((e.key === ',' || e.key === 'Enter') && trimmedSkill) {
    // Remove trailing comma if key was ','
    const skillToAdd = e.key === ',' ? trimmedSkill.slice(0, -1) : trimmedSkill

    if (!formDetails.value.skills.includes(skillToAdd) && skillToAdd) {
      formDetails.value.skills.push(skillToAdd)
    }

    // Clear the tempSkill after adding
    formDetails.value.tempSkill = ''
  }
}

const removeSkill = (skill) => {
  formDetails.value.skills = formDetails.value.skills.filter((item) => {
    return item !== skill
  })
}

const handleSubmit = () => {
  console.log(formDetails.value)
  // validate Password

  if (formDetails.value.password.length < 6) {
    formDetails.value.passwordError = 'Password must be at least 6 characters'
  } else {
    formDetails.value.passwordError = ''
  }
  if (!formDetails.value.terms) {
    alert('You must accept the terms and conditions')
    return
  }
}
</script>

<style scoped>
form {
  max-width: 420px;
  margin: 30px auto;
  background: white;
  text-align: left;
  padding: 40px;
  border-radius: 10px;
}

label {
  color: #aaa;
  display: inline-block;
  margin: 25px 0 15px;
  font-size: 0.6em;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
}

input,
select {
  display: block;
  padding: 10px 6px;
  width: 100%;
  box-sizing: border-box;
  border: none;
  border-bottom: 1px solid #ddd;
  color: #555;
}

button {
  background: #0b6dff;
  border: 0;
  padding: 10px 20px;
  margin-top: 20px;
  color: white;
  border-radius: 20px;
}

.submit {
  text-align: center;
}

input[type='checkbox'] {
  display: inline-block;
  width: 16px;
  margin: 0 10px 0 0;
  position: relative;
  top: 2px;
}

.pill {
  display: inline-block;
  margin: 20px 10px 0 0;
  padding: 6px 12px;
  background: #eee;
  border-radius: 20px;
  font-size: 12px;
  letter-spacing: 1px;
  font-weight: bold;
  color: #777;
  cursor: pointer;
}

.close {
  cursor: pointer;
}
.skill {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.error {
  color: #ff0062;
  margin-top: 10px;
  font-size: 0.8em;
  font-weight: bold;
}
</style>
