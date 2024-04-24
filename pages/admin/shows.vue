<template>
  <div>
    <h1 class="text-4xl font-bold">Shows</h1>
    <div class="flex space-x-2"><Button>Add New Show</Button>
    <Button @click="seedSeats" :disabled="isSeedingSeats" :loading="isSeedingSeats">{{ isSeedingSeats ? 'Seeding...' : 'Seed Seats' }}</Button>
    </div>

    <SelectButton v-model="selectedEvent" :options="eventOptions" optionLabel="name" />
    <hr>
    <div>
      <h2 class="font-bold text-lg mb-2">Seats</h2>
      <SeatMap/>
    </div>

  </div>
</template>

<script setup lang="ts">
import SeatMap from '~/components/SeatMap.vue';
import card from '~/presets/lara/card';
const SeatStore = useSeatStore()
const toast = useToast()

const client = useStrapiClient()
definePageMeta({
  middleware: ['admin'],
});

const isSeedingSeats = ref(false)

const seedSeats = async () => {
  isSeedingSeats.value = true
  const currentYear = new Date().getFullYear()
  try {
    await client('/seats/create-shows-and-seats', {
      method: 'POST',
      body: JSON.stringify({ year: currentYear}),
    })
    toast.add({severity: 'success', summary: 'Seats seeded', detail: 'Successfully seeded seats', life: 3000});
  } catch (error) {
    console.error('Error seeding seats:', error)
  } finally {
    await SeatStore.fetchEvents()
    isSeedingSeats.value = false

  }
}
</script>




<style scoped>

</style>