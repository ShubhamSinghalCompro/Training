<script setup>
    //const route = useRoute()
    const nuxt = useNuxtApp()
    //console.log(route.params.id);
    console.log(nuxt);
</script>

<template>
    <h1>Events {{ $route.params.id }}</h1>
</template>
