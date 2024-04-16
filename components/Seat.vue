<template>
  <button 
    class="px-3 py-1" 
    :class="`seat ${props.seat.attributes.is_available ? 'bg-green-200' : 'bg-red-200'} ${isSelected ? 'ring ring-offset-2 ring-blue-500' : ''}`"
    @click="handleClick">
    {{ props.seat.attributes.number }}
    {{ props.seat.attributes.is_reserved }}
  </button>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import type { SeatResponse } from '~/types/seat';

const props = defineProps<{ seat: SeatResponse }>();

// Include a callback in the emit function for the parent to potentially revert the selection
const emit = defineEmits<{
  (event: 'toggle-seat', seatId: number, isSelected: boolean, revertCallback: () => void): void;
}>();

const isSelected = ref(false);

function handleClick() {
  if (props.seat.attributes.is_available) {
    isSelected.value = !isSelected.value; // Toggle selection state
    // Emit the event and provide a callback to revert the isSelected state
    emit('toggle-seat', props.seat.id, isSelected.value, () => {
      isSelected.value = !isSelected.value;
    });
  }
}
</script>

<style scoped>
</style>
