<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
    <div class="max-w-2xl p-6 bg-white shadow-lg rounded-lg text-center">
      <h1 class="text-3xl font-bold text-green-600 mb-4">Payment Successful</h1>
      <p class="text-gray-700 mb-3">Thank you for your payment. You have recieved an email confirmation of your tickets.</p>
      <p class="text-gray-700 mb-6">Feel free to view your tickets by clicking the View Tickets button.</p>
      <p class="text-gray-700 mb-6">To print the tickets make sure you turn on print background images or the background will not show up.</p>

      <!-- Buttons with PrimeVue components -->
      <div class="flex justify-center gap-4">
        <Button label="Buy More Tickets" @click="navigateTo('/purchase-tickets')" class="p-button-success p-button-raised p-button-rounded" />
        <Button label="View Tickets" @click="navigateTo('/profile')" class="p-button-info p-button-raised p-button-rounded" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function navigateTo(route) {
  router.push(route);
}
</script>

<style scoped>
/* Scoped styles if necessary, though Tailwind is handling most styling */
</style>
