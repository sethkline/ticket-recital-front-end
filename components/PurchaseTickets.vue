<template>
  <div class="px-4 py-4">
    <h1 class="text-4xl font-bold py-4">Purchase Recital Tickets</h1>
    <pre>{{ CheckoutStore.selectedSeats }}</pre>
  </div>
  <div class="card flex justify-center">
        <Stepper linear>
            <StepperPanel header="Select Show">
                <template #content="{ nextCallback }">
                      <div class="grid justify-center" v-if="eventOptions.length">
                        <div class="p-4">
                          <h2 class="mb-2 text-3xl font-bold">Select Recital Time</h2>
                          <p>Select the recital time that you would like to purchase tickets for.</p>

                        </div>
                        <SelectButton v-model="selectedEvent" :options="eventOptions" optionLabel="name" multiple aria-labelledby="multiple" />
                      </div>
                    <div v-if="SeatStore.seats && SeatStore.seats.length" class="flex pt-4 justify-end">
                        <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback" />
                    </div>
                </template>
            </StepperPanel>
            <StepperPanel header="Pick Seats" >
                <template #content="{ prevCallback, nextCallback }">
                  <!-- need to make sure this is contained in a container with scroll using tailwind -->
                  <div class="flex overflow-auto border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-md max-h-[500px] bg-surface-200 p-4">
                    <SeatMap v-if="SeatStore.seats" :seats="SeatStore.seats" @selected-seats="handleSelectedSeats"></SeatMap>
                  </div>
                    <div class="flex pt-4 justify-between">
                        <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
                        <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback" />
                    </div>
                </template>
            </StepperPanel>
            <StepperPanel header="Confirm Choices">
                <template #content="{ prevCallback, nextCallback }">
                  <!-- // summary of selected seats -->

                    <OrderSummary />

                    <div class="flex pt-4 justify-between">
                        <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
                        <Button label="Checkout" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback" />
                    </div>
                </template>
            </StepperPanel>
            <StepperPanel header="Pay for seats">
                <template #content="{ prevCallback }">
                  
                    <!-- show the stripe checkout -->
                    <PaymentCheckout />
                    <div class="flex pt-4 justify-start">
                        <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
                    </div>
                </template>
            </StepperPanel>
        </Stepper>
    </div>
  <div>
    <!-- <pre>{{ eventOptions }}</pre> -->

    <ProgressSpinner v-if="isLoadingSeats" />
   
  </div>
</template>

<script setup lang="ts">
  import { useSeatStore } from '~/stores/seatStore';
import type { SeatResponse } from '~/types/seat';
import { useCheckoutStore } from '~/stores/checkoutStore';
// import { PaymentCheckout } from '#build/components';

// This is causing a 500 error not sure why
// const { find } = useStrapi()

// const { events, fetchEvents, fetchSeats, seats } = useSeatStore();
const SeatStore = useSeatStore()
const CheckoutStore = useCheckoutStore()

// const eventResponse = await find<Event>('events')

await SeatStore.fetchEvents()

console.log(SeatStore.events, 'EVENTS')

const selectedEvent = ref(null);

// const seatsTest = computed(() => {
//   return seats
// })

const eventOptions = computed(() => {
    if (!SeatStore.events) return []

  return SeatStore.events.map(event => ({
    name: event.attributes.title,
    value: event.id
  }));
});

// const availableSeats = computed(() => {
//   if (selectedEvent.value) {
//     console.log(selectedEvent.value)
//     return seats.filter(seat => seat.attributes.eventId === selectedEvent.value[0].value);
//   }
//   return [];
// });

const isLoadingSeats = ref(false)

watch(selectedEvent, async(newVal) => {
  if (newVal) {
    isLoadingSeats.value = true
    CheckoutStore.selectEventDetails = selectedEvent.value ?? []
    const ids = newVal.map(event => event.value)
    await SeatStore.fetchSeats(ids);
    isLoadingSeats.value = false
  }
});

const handleSelectedSeats = (selectedSeats) => {
  CheckoutStore.selectedSeats = selectedSeats
}

// const timeOptions = computed(() => {
//   if (eventResponse?.data) {
//     const response = eventResponse.data.map(event => {

//      return { name: event?.attributes?.title as string, value: event.id
//     }})
//     console.log(response, 'response')
//     return response
//   } 
//   return []
// })

// const selectedEvent = ref(null)
// const availableSeats = ref(null)

// Function to fetch seats based on selected events
// const fetchSeatsForSelectedEvents = async (selectedEvents) => {
//   try {
//     const seats = [];
//     const pageSize = 100; // Adjust based on your needs and Strapi's limits

//     for (const eventId of selectedEvents) {
//       let fetched = 0; // Counter for fetched items
//       let currentPage = 1; // Starting page
//       const maxPages = Math.ceil(2000 / pageSize); // Calculate the maximum number of pages to fetch

//       while (fetched < 2000 && currentPage <= maxPages) {
//         const response = await find('seats', {
//           filters: {
//             event: eventId.value,
//           },
//           pagination: {
//             page: currentPage,
//             pageSize: pageSize,
//           },
//         });

//         // Assuming 'find' correctly handles and parses the Strapi response
//         if (response.data && response.data.length) {
//           seats.push(...response.data);
//           fetched += response.data.length;
//           currentPage++; // Go to the next page for the next iteration
//         } else {
//           break; // Exit if no more data
//         }
//       }
//     }

//     console.log(seats, 'seats'); // Process or store seats as needed
//     availableSeats.value = seats
//   } catch (error) {
//     console.error('Failed to fetch seats:', error);
//   }
// };


// Watch selectedEvent for changes to fetch seats
// watch(selectedEvent, (newVal, oldVal) => {
//   if (newVal && newVal.length > 0) {
//     fetchSeatsForSelectedEvents(newVal);
//   }
// });




</script>

<style scoped>

</style>