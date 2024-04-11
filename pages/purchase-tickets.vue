<template>
  <div>
    Get Your Tickets
    <div v-if="timeOptions.length">
      <SelectButton v-model="selectedEvent" :options="timeOptions" optionLabel="name" multiple aria-labelledby="multiple" />
    </div>
    <pre v-if="selectedEvent">
      Tickets
      {{ selectedEvent }}
    </pre>
    <pre> {{ availableSeats}}</pre>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['authenticated'],
});
// This is causing a 500 error not sure why
const { find } = useStrapi()

const eventResponse = await find<Event>('events')

const timeOptions = computed(() => {
  if (eventResponse?.data) {
    const response = eventResponse.data.map(event => {

     return { name: event?.attributes?.title as string, value: event.id
    }})
    console.log(response, 'response')
    return response
  } 
  return []
})

const selectedEvent = ref(null)
const availableSeats = ref(null)

// Function to fetch seats based on selected events
const fetchSeatsForSelectedEvents = async (selectedEvents) => {
  try {
    const seats = [];
    const pageSize = 100; // Adjust based on your needs and Strapi's limits

    for (const eventId of selectedEvents) {
      let fetched = 0; // Counter for fetched items
      let currentPage = 1; // Starting page
      const maxPages = Math.ceil(2000 / pageSize); // Calculate the maximum number of pages to fetch

      while (fetched < 2000 && currentPage <= maxPages) {
        const response = await find('seats', {
          filters: {
            event: eventId.value,
          },
          pagination: {
            page: currentPage,
            pageSize: pageSize,
          },
        });

        // Assuming 'find' correctly handles and parses the Strapi response
        if (response.data && response.data.length) {
          seats.push(...response.data);
          fetched += response.data.length;
          currentPage++; // Go to the next page for the next iteration
        } else {
          break; // Exit if no more data
        }
      }
    }

    console.log(seats, 'seats'); // Process or store seats as needed
    availableSeats.value = seats
  } catch (error) {
    console.error('Failed to fetch seats:', error);
  }
};


// Watch selectedEvent for changes to fetch seats
watch(selectedEvent, (newVal, oldVal) => {
  if (newVal && newVal.length > 0) {
    fetchSeatsForSelectedEvents(newVal);
  }
});




</script>

<style scoped>

</style>