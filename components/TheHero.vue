<template>
  <div class="relative py-10 sm:pb-12 sm:pt-18">
    <div class="cover-image" :style="backgroundImageStyle">
    </div>
    <Container class="relative">
      <div class="mx-auto max-w-2xl lg:max-w-4xl lg:px-12">
        <h1 class="font-display text-4xl pt-2 font-bold tracking-tight text-blue-600 sm:text-7xl">
          <span class="sr-only">Reverence Studios 2025 Recital - </span>Echoes of Grace: Stories in Motion
        </h1>
        <div class="mt-6 space-y-6 font-display text-2xl tracking-wide text-blue-900">
          <p>Buy your Tickets for Reverence Studios 2025 Spring Recital</p>
        </div>
        
        <!-- Display purchase button when tickets are on sale -->
        <Button v-if="isTicketSalesActive" @click="$router.push('/purchase-tickets')" class="mt-10 w-full sm:hidden">
          Get your tickets
        </Button>
        
        <!-- Display countdown when sales haven't started yet -->
        <TicketSaleCountdown v-else-if="isTicketSalesFuture && recital" 
          :ticketStartDate="recital?.attributes?.ticket_sale_start" />
        
        <!-- Display message when ticket sales are over -->
        <div v-else class="mt-10 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p class="text-lg font-medium text-blue-900">Ticket sales have ended</p>
          <p class="text-sm text-blue-700 mt-1">Thank you for your interest in our recital. Please contact us directly for any inquiries.</p>
        </div>

        <dl
          class="mt-10 grid grid-cols-2 gap-x-10 gap-y-6 sm:mt-16 sm:gap-x-16 sm:gap-y-10 sm:text-center lg:auto-cols-auto lg:grid-flow-col lg:grid-cols-none lg:justify-start lg:text-left"
        >
          <div v-for="item in items" :key="item.name" class="stats-item">
            <dt class="font-mono text-sm text-blue-600">{{ item.name }}</dt>
            <dd class="mt-0.5 text-2xl font-semibold tracking-tight text-blue-900">
              {{ item.value }}
            </dd>
          </div>
        </dl>
      </div>
    </Container>
  </div>
</template>

<script setup lang="ts">
const items = [
  { name: 'Venue', value: 'Mechanicsburg Middle School' },
  { name: 'Location', value: 'Mechanicsburg' }
];

const recitalStore = useRecitalStore();
const { recital } = storeToRefs(recitalStore);
const props = defineProps<{ coverImageUrl: string }>();

const backgroundImageStyle = computed(() => {
  if (!props.coverImageUrl) {
    return '';
  }
  return `background-image: url('${props.coverImageUrl}');`;
});

// Check if ticket sales are active
const isTicketSalesActive = computed(() => {
  if (!recital.value?.attributes?.ticket_sale_start || !recital.value?.attributes?.ticket_sale_end) {
    return false;
  }
  
  const now = new Date();
  const startDate = new Date(recital.value.attributes.ticket_sale_start);
  const endDate = new Date(recital.value.attributes.ticket_sale_end);
  
  return now >= startDate && now <= endDate;
});

// Check if ticket sales are in the future
const isTicketSalesFuture = computed(() => {
  if (!recital.value?.attributes?.ticket_sale_start) {
    return false;
  }
  
  const now = new Date();
  const startDate = new Date(recital.value.attributes.ticket_sale_start);
  
  return now < startDate;
});
</script>

<style scoped>
.cover-image {
  background-size: cover;
  background-position: center;
  height: 400px;
  width: 100%;
  background-repeat: no-repeat;
}
</style>