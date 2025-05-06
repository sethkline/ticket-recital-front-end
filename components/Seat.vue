<template>
  <button
    class="px-3 py-1 text-xs seat"
    :class="{
      'bg-green-300 border-green-500 hover:bg-green-400': props.seat.attributes.is_available && !props.seat.attributes.is_reserved,
      'bg-yellow-300 border-yellow-500 hover:bg-yellow-400': props.seat.attributes.is_available && props.seat.attributes.is_reserved,
      'bg-red-300 border-red-500': !props.seat.attributes.is_available,
      'ring-2 ring-blue-500': isSelected
    }"
    @click="handleClick"
  >
    <span class="text-sm" v-if="props.seat?.attributes?.handicap_access">♿</span>
    <span v-if="showSeatNumber">{{ props.seat?.attributes?.number }}</span>
  </button>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import type { SeatResponse } from '~/types/seat';

const props = defineProps<{ seat: SeatResponse; hasSelectedAll: boolean; showHandicap: boolean; showSeatNumber: boolean; selectUnavailable: boolean }>();

// Include a callback in the emit function for the parent to potentially revert the selection
const emit = defineEmits<{
  (event: 'toggle-seat', seatId: number, isSelected: boolean, revertCallback: () => void): void;
}>();

const isSelected = ref(false);

function handleClick() {
  if (!isSelected.value && props.hasSelectedAll) {
    return;
  }

  // don't let a handicap seat be selected
  if(props.seat?.attributes?.handicap_access && !Boolean(props.showHandicap) ) {
    return
  }

  // Check if seat is available
  if (props.seat.attributes.is_available || props.selectUnavailable) {
    isSelected.value = !isSelected.value; // Toggle selection state
    // Emit the event and provide a callback to revert the isSelected state
    emit('toggle-seat', props.seat.id, isSelected.value, () => {
      isSelected.value = !isSelected.value;
    });
  }
}
</script>

<style scoped>
.seat {
  display: inline-block;
  margin: 2px;
  border: 2px solid transparent; /* Default border to ensure consistent size */
  border-radius: 4px; /* Optional: Adds rounded corners */
  transition: background-color 0.3s; /* Smooth transition for hover effects */
  cursor: pointer;
  font-size: 0.75rem; /* Adjust font size to fit small buttons */
}

/* Optionally, you can add more specific hover effects in your CSS */
.hover\:bg-green-400:hover {
  background-color: #68d391; /* Tailwind color, adjust based on your theme */
}

.hover\:bg-red-400:hover {
  background-color: #fc8181; /* Tailwind color, adjust based on your theme */
}
</style>
