<template>
    <div>
      <h1>Index</h1>
      <Header />
      <Alert />
      <Profile />
      <ProfileHeader />
      <ProfileHeaderAlpha /> 
      <img src="/download.jfif" />
      <Icon />
  
      <!-- Import and use the SVG component -->
      <MaterialSymbol123 />
    </div>
  </template>
  
  <script setup>
  import MaterialSymbol123 from '~/assets/MaterialSymbols123.svg';
  import { useCounterStore } from '~/stores/myStore';

  const myStore = useCounterStore();
  console.log(myStore);

  const resp = await $fetch('/api/hello');
  console.log(resp);
  </script>
  