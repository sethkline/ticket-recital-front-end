<template>
  <div v-if="showCountdown" class="ticket-countdown p-4 bg-yellow-50 border border-yellow-300 rounded-md">
    <h3 class="text-lg font-bold text-yellow-800">Ticket Sales Ending Soon</h3>
    <div class="flex justify-center gap-2 mt-2">
      <div v-if="timeRemaining.days > 0" class="text-center">
        <div class="text-2xl font-bold">{{ timeRemaining.days }}</div>
        <div class="text-sm">Days</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold">{{ timeRemaining.hours }}</div>
        <div class="text-sm">Hours</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold">{{ timeRemaining.minutes }}</div>
        <div class="text-sm">Minutes</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold">{{ timeRemaining.seconds }}</div>
        <div class="text-sm">Seconds</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useTimeRestrictionStore } from '~/stores/timeRestrictionStore';

const TimeRestrictionStore = useTimeRestrictionStore();

const timeRemaining = computed(() => TimeRestrictionStore.timeRemaining);

// Only show countdown when less than 3 days remain
const showCountdown = computed(() => {
  return timeRemaining.value.days < 3 && 
         timeRemaining.value.days >= 0 && 
         TimeRestrictionStore.canPurchaseTickets.allowed;
});
</script>