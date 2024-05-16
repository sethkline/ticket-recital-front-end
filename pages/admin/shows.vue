<template>
  <div>
    <AdminMenuBar />
    <h1 class="text-4xl font-bold">Shows</h1>
    <div class="flex space-x-2"><Button>Add New Show</Button>
    <Button @click="seedSeats" :disabled="isSeedingSeats" :loading="isSeedingSeats">{{ isSeedingSeats ? 'Seeding...' : 'Seed Seats' }}</Button>
    </div>

    <div>
      <h2>Test Email Ticket</h2>
      <Button @click="sendTestEmail">Test</Button>
    </div>

    <SelectButton v-model="selectedEvent" :options="eventOptions" optionLabel="name" />
    <hr>
    <!-- <div>
      <h2 class="font-bold text-lg mb-2">Seats</h2>
      <SeatMap/>
    </div> -->

    <div class="p-4 flex space-x-2">
      <Button @click="generateCSV">Generate CSV</Button>
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

const sendTestEmail = async () => {
  try {
    await client('/orders/test-pdf', {
      method: 'POST',
      body: JSON.stringify({htmlContent: '<h1>Your PDF Content</h1>', userEmail: 'seth.mkline@gmail.com'}),
    })
    toast.add({severity: 'success', summary: 'Test email sent', detail: 'Successfully sent test email', life: 3000});
  } catch (error) {
    console.error('Error sending test email:', error)
  }
}

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

const generateCSV = async () => {
  try {
    const response = await client('/orders/csv-report', {
      method: 'GET',
      responseType: 
      'blob'
    });

    // Create a Blob from the binary data
    const blob = new Blob([response], { type: 'application/zip' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders-reports.zip';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating CSV:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to generate CSV', life: 3000 });
  }
}

</script>




<style scoped>

</style>