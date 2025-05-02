<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">My Media Orders</h1>
    <UserMediaOrders />
  </div>
</template>

<script setup>

definePageMeta({
  middleware: ['authenticated'],
});
</script>