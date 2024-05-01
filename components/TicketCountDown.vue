<template>
  <div>
    <h1>Your selected seats are reserved for a limited time.</h1>
    <p>You have <strong>{{ timeLeft }}</strong> minutes to complete your purchase.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';


const timeLeft = ref(10); // minutes left, adjust accordingly
let timer = null;

function startTimer() {
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(timer);
      alert('Time expired. Returning to seat selection.');
      // Logic to release seats and redirect user
    }
  }, 60000); // update every minute
}

onMounted(() => {
  startTimer();
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>
