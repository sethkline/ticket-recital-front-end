<template>
  <div class="seatmap-container">
    <div v-if="isAdmin && adminSelected.length" class="flex">
    <SplitButton label="Reserve Selected" icon="pi pi-plus" class="mr-2" :model="adminSelectItems" @click="handleAdminReserve"/> 
    </div>
    <div class="stage-label">Stage</div>
    <div class="seatmap" v-if="Boolean(seats && seats.length)">
      <div v-for="(section, index) in sections" :key="index" class="section" :class="getSectionClass(index)">
        <div v-for="(rowSeats, row) in section" :key="row" class="row">
          <span class="row-label">{{ row }}</span>
          <Seat
            v-for="seat in rowSeats"
            :key="seat.id"
            :seat="seat"
            :showSeatNumber="isAdmin"
            :selectUnavailable="isAdmin"
            :hasSelectedAll="hasSelectedAll"
            :showHandicap="showHandicap"
            @toggle-seat="handleSeatToggle"
            class="seat"

          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSeatStore } from '~/stores/seatStore';
import { useAdminStore } from '~/stores/adminStore';
import type { SeatResponse } from '~/types/seat';
import { useToast } from 'primevue/usetoast';
const toast = useToast();

const SeatStore = useSeatStore();
const AdminStore = useAdminStore();

// const client = useStrapiClient();
// const socket = io('http://localhost:1337'); // Adjust this URL to the actual URL of your Strapi server

const props = defineProps<{ seats: SeatResponse[]; hasSelectedAll: boolean; showHandicap: boolean; isAdmin: boolean }>();


//admin selected seats functions
const adminSelectItems = [
    {
        label: 'make handicap',
        icon: 'pi pi-refresh',
        command: () => {
          handleHandicapAccess(true);
        }
    },
    {
        label: 'make available',
        icon: 'pi pi-times',
        command: () => {
            handleAdminReserve(true);
            toast.add({ severity: 'warn', summary: 'Delete', detail: 'Data Deleted', life: 3000 });
        }
    }
];

const handleAdminReserve = async(isAvailable = false) => {
  try {
    await AdminStore.updateSeatAvailability(adminSelected.value, isAvailable);
    await SeatStore.fetchBothAvailableSeats();
    toast.add({ severity: 'success', summary: 'Reserved', detail: isAvailable ? 'Seats Unreserved' : 'Seats Reserved', life: 3000 });
  }
  catch (error) {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Something went wrong', life: 3000 });
  }
}

const handleHandicapAccess = async(handicap_access = true) => {
  await AdminStore.updateHandicapAvailability(adminSelected.value, handicap_access);
  await SeatStore.fetchBothAvailableSeats();
  toast.add({ severity: 'success', summary: 'Reserved', detail: 'Seats Handicap updated', life: 3000 });

 }


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
  console.log(index, 'getSectionClass');
  switch (index) {
    case 1:
      return 'section--left';
    case 3:
      return 'section--right';
    default:
      return '';
  }
}

// group seats into sections
// function organizeSeatsByRow(seats: SeatResponse[]) {
//   return seats.reduce((acc, seat) => {
//     const rowKey = seat.attributes.row;
//     if (!acc[rowKey]) {
//       acc[rowKey] = [];
//     }
//     acc[rowKey].push(seat);
//     return acc;
//   }, {});
// }
function organizeSeatsByRow(seats) {
  const grouped = seats.reduce((acc, seat) => {
    const rowKey = seat.attributes.row;
    if (!acc[rowKey]) {
      acc[rowKey] = [];
    }
    acc[rowKey].push(seat);
    return acc;
  }, {});

  // Sort each row by `display_order`
  Object.keys(grouped).forEach(rowKey => {
    grouped[rowKey].sort((a, b) => a.attributes.display_order - b.attributes.display_order);
  });

  return grouped;
}

function sortGroupedSeatsByRow(groupedSeats) {
  // Create an array of keys (rows), sort them alphabetically
  const sortedKeys = Object.keys(groupedSeats).sort();

  // Construct a new object with sorted keys and their corresponding values
  const sortedGroupedSeats = {};
  sortedKeys.forEach(key => {
    sortedGroupedSeats[key] = groupedSeats[key];
  });

  return sortedGroupedSeats;
}

function sortSeatsByDisplayOrder(rows) {
  Object.keys(rows).forEach((key) => {
    rows[key].sort((a, b) => a.attributes.display_order - b.attributes.display_order);
  });
  return rows;
}

const leftWingSection = computed(() => {
  if (!props.seats || props.seats.length === 0) return [];
  const leftWingSeats = props.seats.filter((seat) => seat.attributes.section === 'left-wing');
  const rows = organizeSeatsByRow(leftWingSeats);
  const sortedRows = sortGroupedSeatsByRow(rows)
  return sortedRows;
});

const rightWingSection = computed(() => {
  if (!props.seats || props.seats.length === 0) return [];
  const rightWingSeats = props.seats.filter((seat) => seat.attributes.section === 'right-wing');
  const rows = organizeSeatsByRow(rightWingSeats);
  return sortGroupedSeatsByRow(rows)
});

const leftMainSection = computed(() => {
  if (!props.seats || props.seats.length === 0) return [];
  const leftWingSeats = props.seats.filter((seat) => seat.attributes.section === 'left-main');
  const rows = organizeSeatsByRow(leftWingSeats);
  return sortGroupedSeatsByRow(rows)
});

const centerMainSection = computed(() => {
  if (!props.seats || props.seats.length === 0) return [];
  const rightWingSeats = props.seats.filter((seat) => seat.attributes.section === 'center-main');
  const rows = organizeSeatsByRow(rightWingSeats);
  return sortGroupedSeatsByRow(rows)
});

const rightMainSection = computed(() => {
  if (!props.seats || props.seats.length === 0) return [];
  const rightWingSeats = props.seats.filter((seat) => seat.attributes.section === 'right-main');
  const rows = organizeSeatsByRow(rightWingSeats);
  return sortGroupedSeatsByRow(rows)

});

const adminSelected = ref([])

const handleSeatToggle = async (seatId: string, isSelected: boolean, revertCallback: () => void) => {
  if (props.isAdmin) {
    // If the seat is already selected, remove it from the adminSelected array
    if (isSelected) {
      adminSelected.value.push(seatId);
    } else {
      adminSelected.value = adminSelected.value.filter((id) => id !== seatId);
    }
    return
  }

  try {
    await SeatStore.toggleSeat(seatId, isSelected);
  } catch (error) {
    revertCallback();
    toast.add({
      severity: 'error',
      summary: 'Error Adding Seat',
      detail: 'Try selecting a different seat',
      life: 3000
    });
  }
};
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
  margin-right: 0.5em;
  font-weight: bold;
}

.seat {
  margin: 0 2px;
}
</style>