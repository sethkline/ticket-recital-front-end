<template>
  <div>
    <AdminMenuBar />
    <AdminMediaOrders />
  </div>
</template>

<script setup lang="ts">
import AdminMediaOrders from '~/components/AdminMediaOrders.vue';

definePageMeta({
  middleware: ['admin'],
});
</script>