import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", () => {
    const count = ref(0);
    const name = ref("Hi Me");
    const doubleCount = computed(() => count.value * 2);

    function increment() {
        count.value++; 
    }
    function setName(newName) {
        name.value = newName
    }

    function decrement() {
        count.value--;
    }
    return { count, name, doubleCount, increment, setName, decrement }

})