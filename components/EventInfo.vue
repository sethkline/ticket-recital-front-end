<template>
  <div class="event-info bg-white shadow-lg rounded-lg overflow-hidden">
    <TheHero :coverImageUrl :description :title></TheHero>
    <div class="cover-image">
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

