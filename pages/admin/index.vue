<template>
  <div>
    <AdminMenuBar />
  </div>
</template>

<script setup lang="ts">
import AdminMenuBar from '~/components/AdminMenuBar.vue';

definePageMeta({
  middleware: ['authenticated']
});
</script>

<style scoped></style>
