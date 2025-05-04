<template>
  <div>
    <AdminMenuBar />
    <h2>Morning Recital</h2>
    <SeatMap :seats="SeatStore.morningSeats" :isAdmin="true" />


    <h2>Afternoon Recital</h2>
    <SeatMap :seats="SeatStore.afternoonSeats" :isAdmin="true"/>


  </div>
</template>

<script setup lang="ts">
import SeatMap from '~/components/SeatMap.vue';


const SeatStore = useSeatStore()

definePageMeta({
  middleware: ['admin'],
});
onMounted(async () => {
  await SeatStore.fetchEvents()
  await SeatStore.fetchBothAvailableSeats()
})
</script>

<style scoped>

</style>