<template>
  <div class="w-full text-center border p-2 mb-4"><p>Stage</p></div>
 <div class="seatmap" v-if="Boolean(seats && seats.length)">
    <div class="section">
      <div v-for="(rowSeats, row) in leftWingSection" :key="'left-w-' + row" class="row">
        <Seat v-for="seat in rowSeats" :key="seat.id" :seat="seat" @toggle-seat="handleSeatToggle" class="seat"/>
      </div>
    </div>
    <div class="section section--left">
      <div v-for="(rowSeats, row) in leftMainSection" :key="'left-' + row" class="row">
        <Seat v-for="seat in rowSeats" :key="seat.id" :seat="seat" @toggle-seat="handleSeatToggle" class="seat"/>
      </div>
    </div>
    <div class="section">
      <div v-for="(rowSeats, row) in centerMainSection" :key="'center-' + row" class="row">
        <Seat v-for="seat in rowSeats" :key="seat.id" :seat="seat" @toggle-seat="handleSeatToggle" class="seat"/>
      </div>
    </div>
    <div class="section section--right">
      <div v-for="(rowSeats, row) in rightMainSection" :key="'right-' + row" class="row">
        <Seat v-for="seat in rowSeats" :key="seat.id" :seat="seat" @toggle-seat="handleSeatToggle" class="seat"/>
      </div>
    </div>
    <div class="section">
      <div v-for="(rowSeats, row) in rightWingSection" :key="'right-w-' + row" class="row">
        <Seat v-for="seat in rowSeats" :key="seat.id" :seat="seat" @toggle-seat="handleSeatToggle" class="seat"/>
      </div>
    </div>
  </div>
  <Toast></Toast>
</template>

<script setup lang="ts">
import { useSeatStore } from '~/stores/seatStore'
import type { SeatResponse } from '~/types/seat';
import { useToast } from 'primevue/usetoast';
const toast = useToast();

const SeatStore = useSeatStore();

// const client = useStrapiClient();
// const socket = io('http://localhost:1337'); // Adjust this URL to the actual URL of your Strapi server




const props = defineProps<{ seats: SeatResponse[] }>();

// onMounted(() => {
//   SeatStore.initializeSocket()
// });

// onUnmounted(() => {
//   SeatStore.disconnectSocket();
// });



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
  // const endpoint = isSelected ? `/seats/${seatId}/reserve` : `/seats/${seatId}/unreserve`;
  // const action = isSelected ? 'Reserving' : 'Unreserving';
  // console.log(`${action} seat:`, seatId);

  try {
    
    const response = await SeatStore.toggleSeat(seatId, isSelected)
  } catch (error) {
    revertCallback();
    toast.add({severity: 'error', summary: 'Error Adding Seat', detail: 'Try selecting a different seat', life: 3000});
}
  }
  

  // try {
  //   const response = await SeatStore.toggleSeat(endpoint);
  //   console.log(`${action} successful:`, response);
  // } catch (error) {
  //   console.error(`Error ${action.toLowerCase()} the seat:`, error);
  // }
// }
</script>


<style scoped>
.seatmap {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 20px; /* Adds horizontal space between the sections */
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
.seat {
  margin: 0 5px; /* Adds space between seats */
}
</style>