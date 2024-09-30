<!-- eslint-disable vue/multi-word-component-names -->
// eslint-disable-next-line vue/multi-word-component-names
<script setup>
const { theme } = defineProps({
  header: String,
  theme: String
})

const emit = defineEmits(['close'])
</script>

<template>
  <div class="backdrop" @click.self="emit('close')">
    <div class="modal" :class ="{ sale: theme === 'sale' }">
      <slot></slot>
      <div class="actions">
        <slot name="links"></slot>
      </div>
    </div>
  </div>
</template>

<style>
.modal {
  width: 400px;
  padding: 20px;
  margin: 100px auto;
  background: white;
  border-radius: 10px;
}
.backdrop {
  top: 0;
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
}

.modal h1 {
  color: aqua;
  border: none;
  padding: 0;
}
.modal p {
  font-style: normal;
}

.modal.sale {
  background: crimson;
  color: white;
}

.modal .actions {
  text-align: center;
  margin: 30px 0 10px 0;
}

.modal .actions a {
  color: #333;
  margin: 10px;
  margin-top: 0;
  padding: 6px;
  border: 0.5px solid white;
  border-radius: 4px;
  text-decoration: none;
}
</style>
