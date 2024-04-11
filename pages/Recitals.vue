<script setup>
const { data: recitals, error } = await useStrapi('recitals');
</script>

<template>
  <div>
    <div v-if="error">An error occurred: {{ error }}</div>
    <ul v-else>
      <li v-for="recital in recitals" :key="recital.id">{{ recital.title }}</li>
    </ul>
  </div>
</template>