<template>
  <div class="event-info bg-white shadow-lg rounded-lg overflow-hidden">
    <div class="cover-image">
      <img :src="coverImageUrl" alt="Event Cover Image" class="w-full h-64 object-contain" />
    </div>
    <div class="p-4">
      <h2 class="font-bold text-2xl mb-2 text-gray-800">{{ title }}</h2>
      <p class="text-gray-600">{{ description }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  title: string
  description: string
  coverImageUrl: string
}>()
</script>