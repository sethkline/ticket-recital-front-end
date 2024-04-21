<template>
  <div>
    <h3>Time until event: {{ countdown }}</h3>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const countdown = ref('');

function updateCountdown(eventDate) {
  const now = new Date();
  const eventTime = new Date(eventDate);
  const diff = eventTime - now;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  countdown.value = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

let timer;

onMounted(() => {
  timer = setInterval(() => updateCountdown('2024-05-18T09:00:00'), 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>