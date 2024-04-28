<template>
  <div>
    <h3 class="text-lg font-bold">Ticket Sales Start:</h3>
    <div class="text-lg">
      <span v-if="daysLeft > 0">{{ daysLeft }} days, </span>
      <span>{{ hoursLeft }}:{{ minutesLeft }}:{{ secondsLeft }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">

const daysLeft = ref(0);
const hoursLeft = ref(0);
const minutesLeft = ref(0);
const secondsLeft = ref(0);

const props = defineProps({
  ticketStartDate: {
    type: String,
    required: true
  }
});

let countdownInterval: ReturnType<typeof setInterval> | null = null;

onMounted(async () => {
  startCountdown();
});

onUnmounted(() => {
  clearInterval(countdownInterval as ReturnType<typeof setInterval>);
});

function startCountdown() {
  if (props.ticketStartDate) {
    const ticketSaleStart = new Date(props.ticketStartDate);
    countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const distance = ticketSaleStart.getTime() - now;

      daysLeft.value = Math.floor(distance / (1000 * 60 * 60 * 24));
      hoursLeft.value = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      minutesLeft.value = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      secondsLeft.value = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        clearInterval(countdownInterval as ReturnType<typeof setInterval>);
      }
    }, 1000);
  }
}
</script>

<style lang="scss" scoped></style>
