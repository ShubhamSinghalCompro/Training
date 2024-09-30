<script setup lang="ts">
import { ref } from 'vue'
import Modal from './components/Modal.vue'
const title = ref('My First Vue App')
const isActive = ref(true)

const changeTitle = () => {
  title.value = title.value === 'My First Vue App' ? 'My Second Vue App' : 'My First Vue App'
}

const toggleActive = () => {
  isActive.value = !isActive.value
}

const showModal = ref(false)
const toggleModal = () => {
  showModal.value = !showModal.value
}

const showModal2 = ref(false)
const toggleModal2 = () => {
  showModal2.value = !showModal2.value
}
</script>

<template>
  <div>
    <h1 :class="isActive ? 'active' : ''">{{ title }}</h1>
    <button @click="changeTitle">Change Title</button>
    <button @click="toggleActive">Toggle Active</button>
    <!-- Conditionally render the modal -->
    <Teleport to=".modals" v-if="showModal">
      <Modal :header="title" :theme="'sale'" @close="toggleModal">
        <template v-slot:links>
          <a href="#">Sign Up</a>
          <a href="#">more info</a>
        </template>
        <h1>Content</h1>
        <p>Paragraph</p>
      </Modal>
    </Teleport>
    <button @click="toggleModal">Show Modal</button>

    <Teleport to=".modals" v-if="showModal2">
      <Modal :header="title" :theme="'sale'" @close="toggleModal2">
        <template v-slot:links>
          <a href="#">Sign Up 2</a>
          <a href="#">more info 2</a>
        </template>
        <h1>Content 2</h1>
        <p>Paragraph 2</p>
      </Modal>
    </Teleport>
    <button @click="toggleModal2">Show Modal 2</button>
  </div>
</template>

<style>
.active {
  color: red;
}

#app, .modals {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
h1 {
  color: green;
}
</style>
