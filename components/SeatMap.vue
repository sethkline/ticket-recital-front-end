<template>
    <div class="seatmap-container">
      <div class="stage-label">Stage</div>
      <div class="seatmap" v-if="Boolean(seats && seats.length)">
        <div v-for="(section, index) in sections" :key="index" class="section" :class="getSectionClass(index)">
          <div v-for="(rowSeats, row) in section" :key="row" class="row">
            <span class="row-label">{{ row }}</span>
            <Seat v-for="seat in rowSeats" :key="seat.id" :seat="seat" :hasSelectedAll="hasSelectedAll" @toggle-seat="handleSeatToggle" class="seat" />
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { useSeatStore } from '~/stores/seatStore'
import { useCheckoutStore } from '~/stores/checkoutStore'
import type { SeatResponse } from '~/types/seat';
import { useToast } from 'primevue/usetoast';
import SeatPicker from './SeatPicker.vue';
const toast = useToast();

const SeatStore = useSeatStore();
const CheckoutStore = useCheckoutStore();


// const client = useStrapiClient();
// const socket = io('http://localhost:1337'); // Adjust this URL to the actual URL of your Strapi server




const props = defineProps<{ seats: SeatResponse[], numberOfSeats: number }>();

const hasSelectedAll = computed(() => {
  if (props.seats.length > 0) {
   return CheckoutStore?.selectedSeats?.length === props.numberOfSeats
  }
  return false;
});

// onMounted(() => {
//   SeatStore.initializeSocket()
// });

// onUnmounted(() => {
//   SeatStore.disconnectSocket();
// });

const sections = computed(() => [
  leftWingSection.value,
  leftMainSection.value,
  centerMainSection.value,
  rightMainSection.value,
  rightWingSection.value
]);

function getSectionClass(index: number) {
  console.log(index, 'getSectionClass')
  switch(index) {
    case 1: return 'section--left';
    case 3: return 'section--right';
    default: return '';
  }
}



// group seats into sections
function organizeSeatsByRow(seats:SeatResponse[]) {
  return seats.reduce((acc, seat) => {
    const rowKey = seat.attributes.row;
    if (!acc[rowKey]) {
      acc[rowKey] = [];
    }
    acc[rowKey].push(seat);
    return acc;
  }, {});
}

function sortSeatsByDisplayOrder(rows) {
  Object.keys(rows).forEach(key => {
    rows[key].sort((a, b) => a.attributes.display_order - b.attributes.display_order);
  });
  return rows;
}

const leftWingSection = computed(() => {
  if (!props.seats || props.seats.length === 0) return [];
  const leftWingSeats = props.seats.filter(seat => seat.attributes.section === 'left-wing');
  const rows = organizeSeatsByRow(leftWingSeats);
  return sortSeatsByDisplayOrder(rows);
});

const rightWingSection = computed(() => {
  if (!props.seats || props.seats.length === 0) return [];
  const rightWingSeats = props.seats.filter(seat => seat.attributes.section === 'right-wing');
  const rows = organizeSeatsByRow(rightWingSeats);
  return sortSeatsByDisplayOrder(rows);
});

const leftMainSection = computed(() => {
  if (!props.seats || props.seats.length === 0) return [];
  const leftWingSeats = props.seats.filter(seat => seat.attributes.section === 'left-main');
  const rows = organizeSeatsByRow(leftWingSeats);
  return sortSeatsByDisplayOrder(rows);
});

const centerMainSection = computed(() => {
  if (!props.seats || props.seats.length === 0) return [];
  const rightWingSeats = props.seats.filter(seat => seat.attributes.section === 'center-main');
  const rows = organizeSeatsByRow(rightWingSeats);
  return sortSeatsByDisplayOrder(rows);
});

const rightMainSection = computed(() => {
  if (!props.seats || props.seats.length === 0) return [];
  const rightWingSeats = props.seats.filter(seat => seat.attributes.section === 'right-main');
  const rows = organizeSeatsByRow(rightWingSeats);
  return sortSeatsByDisplayOrder(rows);
});

const handleSeatToggle = async (seatId: string, isSelected: boolean, revertCallback: () => void) => {
  try {
    await SeatStore.toggleSeat(seatId, isSelected)
  } catch (error) {
    revertCallback();
    toast.add({severity: 'error', summary: 'Error Adding Seat', detail: 'Try selecting a different seat', life: 3000});
}
  }
</script>


<style scoped>
.stage-label {
  width: 100%;
  text-align: center;
  padding: 1em 0;
  font-size: 1.25em;
  font-weight: bold;
}

.seatmap-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.seatmap {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
}

.section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 10px;
}

.section--right {
  align-items: flex-start;
}

.section--left {
  align-items: flex-end;
}

.row {
  display: flex;
  justify-content: center;
  margin-bottom: 1em;
}

.row-label {
  margin-right: .5em;
  font-weight: bold;
}

.seat {
  margin: 0 2px;
}
</style>
<!-- <style scoped>
.stage-label {
  width: 100%;
  text-align: center;
  padding: 1em 0;
  font-size: 1.25em;
  font-weight: bold;
}

.seatmap-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  overflow: hidden; /* Prevent overflow to ensure everything fits within this container */
}

.seatmap {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Switch to auto-fit to collapse empty space */
  justify-content: start; /* Align items to the start to see how items are fitting */
  gap: 10px;
  overflow-x: auto;
  width: 100%;
  min-width: 100%;
}

.section {
  min-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.section--right {
  align-items: flex-start;
}

.section--left {
  align-items: flex-end;
}

.row {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap; /* Prevent wrapping to keep all seats in one line */
}

.row-label {
  margin-right: .5em;
  font-weight: bold;
}

.seat {
  margin: 0 2px;
}
</style> -->
