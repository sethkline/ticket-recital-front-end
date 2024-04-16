<template>
 <template>
  <div :class="`seat ${ticket.is_available ? 'bg-green-200' : 'bg-red-200'} ${isSelected ? 'ring ring-offset-2 ring-blue-500' : ''}`">
    {{ ticket.number }}
  </div>
</template>

</template>

<script setup lang="ts">
defineProps<{ ticket: any}>()

const isSelected = ref(false)
</script>

<style scoped>

</style>