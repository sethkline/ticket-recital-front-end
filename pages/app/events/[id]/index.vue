<template>
  <div>
    Event ID: {{ $route.params.id }}
  </div>
</template>

<script setup lang="ts">

definePageMeta({
  middleware: ['authenticated'],
  layout: 'admin',
});
</script>

<style scoped></style>
