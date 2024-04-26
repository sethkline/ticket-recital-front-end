<template>
  <div class="px-4 py-4">
    <h1 class="text-4xl font-bold py-4">Purchase Recital Tickets</h1>
  </div>
  <div class="card flex justify-center">
    <Stepper linear>
      <StepperPanel header="Select Show">
        <template #content="{ nextCallback }">
          <div class="grid justify-center" v-if="eventOptions.length">
            <div class="p-4">
              <h2 class="mb-2 text-3xl font-bold">Select Recital Time</h2>
              <!-- <Checkbox v-model="bothRecitals" inputId="both-recitals" :binary="true"></Checkbox>
                          <label for ="both-recitals" class="font-bold ml-2">I want to buy tickets for both shows</label> -->
            </div>
            <p class="py-2">Select the recital time that you would like to purchase tickets for.</p>
            <SelectButton v-model="CheckoutStore.selectedEvent" :options="eventOptions" optionLabel="name" />
          </div>
          <!-- <div v-if="selectedEvent" class="flex pt-4 justify-end">
                        <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback" />
                    </div> -->
          <div v-if="CheckoutStore.selectedEvent" class="flex pt-4 justify-evenly">
            <Button
              label="Next"
              icon="pi pi-arrow-right"
              iconPos="right"
              @click="handleSelectBothSeats(nextCallback)"
            />
          </div>
        </template>
      </StepperPanel>
      <StepperPanel header="Pick Seats">
        <template #content="{ prevCallback, nextCallback }">
          <div
            v-if="
              CheckoutStore?.selectedEvent?.name === 'Morning Recital' || CheckoutStore?.selectedEvent?.name === 'Both Recitals'
            "
          >
            <h2 class="mb-2 text-3xl font-bold">Select Morning Recital Seats</h2>
            <div class="flex flex-wrap gap-3 p-fluid mb-4">
              <div class="flex-auto">
                <label for="numberOfMorningSeats" class="font-bold block mb-2">Number of Seats</label>
                <Dropdown
                  id="numberOfMorningSeats"
                  v-model="numberOfMorningSeats"
                  :options="ticketOptions"
                  :showClear="numberOfMorningSeats > 0"
                  class="w-full md:w-[14rem]"
                />
              </div>
              <div class="flex-auto">
                <Checkbox v-model="needsMorningHandicap" input-id="needsMorningHandicap" binary></Checkbox>
                <label for="needsMorningHandicap" class="font-bold ml-2">Show handicap-accessible seats?</label>
              </div>
            </div>
            <SeatMap
              v-if="numberOfMorningSeats > 0"
              :seats="SeatStore.morningSeats"
              :hasSelectedAll="CheckoutStore.selectedMorningSeats.length === numberOfMorningSeats"
              :showHandicap="needsMorningHandicap"
            />
          </div>
          <Divider />
          <div
            v-if="
              CheckoutStore?.selectedEvent?.name === 'Afternoon Recital' ||
              CheckoutStore?.selectedEvent?.name === 'Both Recitals'
            "
          >
            <h2 class="mb-2 text-3xl font-bold">Select Afternoon Recital Seats</h2>
            <div class="flex flex-wrap gap-3 p-fluid mb-4">
              <div class="flex-auto">
                <label for="numberOfEveningSeats" class="font-bold block mb-2">Number of Seats</label>
                <Dropdown
                  id="numberOfEveningSeats"
                  v-model="numberOfEveningSeats"
                  :options="ticketOptions"
                  :showClear="numberOfEveningSeats > 0"
                  class="w-full md:w-[14rem]"
                />
              </div>
              <div class="flex-auto">
                <Checkbox v-model="needsEveningHandicap" input-id="needsEveningHandicap" binary></Checkbox>
                <label for="needsEveningHandicap" class="font-bold ml-2">Show handicap-accessible seats?</label>
              </div>
              <!-- <div>Total Price: ${{ CheckoutStore.selectedSeats * SeatStore.ticketPrice) }}</div> -->
            </div>
            <!-- need to make sure this is contained in a container with scroll using tailwind -->
            <SeatMap
              v-if="numberOfEveningSeats > 0"
              :seats="SeatStore.afternoonSeats"
              :hasSelectedAll="CheckoutStore.selectedAfternoonSeats.length === numberOfEveningSeats"
              :showHandicap="needsEveningHandicap"
            />
          </div>

          <div class="flex pt-4 justify-evenly">
            <Button label="Back" icon="pi pi-arrow-left" iconPos="left" @click="prevCallback" />
            <Button v-if="CheckoutStore.selectedSeats.length > 0" label="Next" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback" />
          </div>
        </template>
      </StepperPanel>
      <StepperPanel header="Confirm Choices">
        <template #content="{ prevCallback, nextCallback }">
          <!-- // summary of selected seats -->

          <OrderSummary />

          <div class="flex pt-4 justify-evenly">
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
    <ProgressSpinner v-if="isLoadingSeats" />
  </div>
</template>

<script setup lang="ts">
import { useSeatStore } from '~/stores/seatStore';
import type { SeatResponse } from '~/types/seat';
import { useCheckoutStore } from '~/stores/checkoutStore';
import SeatPicker from './SeatPicker.vue';
import StepperPanel from 'primevue/stepperpanel';

// const { events, fetchEvents, fetchSeats, seats } = useSeatStore();
const SeatStore = useSeatStore();
const CheckoutStore = useCheckoutStore();

// const eventResponse = await find<Event>('events')
SeatStore.selectedEvent = null;
await SeatStore.fetchEvents();

const numberOfMorningSeats = ref(0);
const numberOfEveningSeats = ref(0);
const needsEveningHandicap = ref(false);
const needsMorningHandicap = ref(false);

const selectedEvent = ref(null);
const ticketOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// const seatsTest = computed(() => {
//   return seats
// })

const eventOptions = computed(() => {
  if (!SeatStore.events) return [];

  const availableOptions = SeatStore.events.map((event) => ({
    name: event.attributes.title,
    value: event.id
  }));
  return [...availableOptions, { name: 'Both Recitals', value: null }];
});

// const availableSeats = computed(() => {
//   if (selectedEvent.value) {
//     console.log(selectedEvent.value)
//     return seats.filter(seat => seat.attributes.eventId === selectedEvent.value[0].value);
//   }
//   return [];
// });

const handleSelectBothSeats = async (goToNextStep: () => void) => {
  isLoadingSeats.value = true;
  await SeatStore.fetchBothAvailableSeats();
  isLoadingSeats.value = false;
  goToNextStep();
};

const isLoadingSeats = ref(false);

// watch(selectedEvent, async(newVal) => {
//   if (newVal) {
//     isLoadingSeats.value = true
//     CheckoutStore.selectEventDetails = selectedEvent.value
//     // todo fix this watcher to work with two ids
//     await SeatStore.fetchSeats([selectedEvent.value.value]);
//     isLoadingSeats.value = false
//   }
// });
// Watcher for both recitals and selected event
// watch([selectedEvent, bothRecitals], async ([newSelectedEvent, newBothRecitals]) => {
//   isLoadingSeats.value = true;
//   let eventIds = [];

//   if (newBothRecitals) {
//     // If buying tickets for both recitals, include all event IDs
//     eventIds = SeatStore.events.map(event => event.id);
//   } else if (newSelectedEvent) {
//     // Only one event selected
//     eventIds.push(newSelectedEvent.value);
//   }

//   if (eventIds.length > 0) {
//     CheckoutStore.selectEventDetails = eventIds.map(id => ({ id }));
//     await SeatStore.fetchSeats(eventIds);
//   }

//   isLoadingSeats.value = false;
// }, { immediate: true });

// const handleSelectedSeats = (selectedSeats) => {
//   CheckoutStore.selectedSeats = selectedSeats;
// };
</script>

<style scoped></style>
