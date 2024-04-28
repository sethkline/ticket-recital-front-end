<template>
  <div class="event-info bg-white shadow-lg rounded-lg overflow-hidden">
    <TheHero
      title="2024 Dance Recital"
      description="Reverence Studios Presents"
      cover-image-url="https://a.storyblok.com/f/147058/4032x3024/e9ae3f85b8/wilderness.jpg/m/918x0"
    ></TheHero>
    <div class="text-center"> 
      <p v-if="recitalStore.advancedTicketTime">
      Parents of returning seniors, or volunteers 
      </p>
      <Button @click="$router.push('/purchase-tickets')">Purchase Tickets</Button>
    </div>
    <!-- <div class="text-center p-4">
      <div v-if="recitalStore.ticketSalesTime" class="mb-4">
        <h3 class="text-lg font-bold">Ticket Sales Start:</h3>
        <div class="text-lg">
        </div>
      </div>
      </div> -->

  </div>∏
</template>
<script setup lang="ts">

const recitalStore = useRecitalStore();
const isLoading = ref(false);
import { storeToRefs } from 'pinia';
const { recital } = storeToRefs(recitalStore)

const daysLeft = ref(0);
const hoursLeft = ref(0);
const minutesLeft = ref(0);
const secondsLeft = ref(0);

let countdownInterval: ReturnType<typeof setInterval> | null = null;

onMounted(async () => {
isLoading.value = true
  await recitalStore.fetchRecital()
  isLoading.value = false
  // startCountdown();
})

// onUnmounted(() => {
//   clearInterval(countdownInterval as ReturnType<typeof setInterval>);
// });

const advancedTicketSalesStarted = computed(() => {
  const now = new Date();
  const ticketSaleStart = new Date(recital.value?.attributes.pre_sale_start);
  return ticketSaleStart < now;
});

// function startCountdown() {
//   if (recital.value && recital.value.attributes.ticket_sale_start) {
//     const ticketSaleStart = new Date(recital.value.attributes.ticket_sale_start);
//     countdownInterval = setInterval(() => {
//       const now = new Date().getTime();
//       const distance = ticketSaleStart.getTime() - now;

//       daysLeft.value = Math.floor(distance / (1000 * 60 * 60 * 24));
//       hoursLeft.value = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//       minutesLeft.value = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//       secondsLeft.value = Math.floor((distance % (1000 * 60)) / 1000);

//       if (distance < 0) {
//         clearInterval(countdownInterval as ReturnType<typeof setInterval>);
//       }
//     }, 1000);
//   }
// }

</script>
