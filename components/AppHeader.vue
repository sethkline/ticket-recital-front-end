<template>
  <!-- <SiteAlertBanner 
    severity="error"
    message="Our ticket system is temporarily unavailable. Please check your email for updates on when ticket purchasing will be available again."
    persistent
    actionText="Contact Us" 
    actionLink="mailto:kirsten@reverencestudios.com"
    dismissKey="ticket-system-outage-may2025"
  /> -->
  <header class="relative z-50 flex-none lg:pt-11 print:hidden">
    <Container class="flex flex-wrap items-center justify-center sm:justify-between lg:flex-nowrap">
      <div class="mt-10 lg:mt-0 lg:grow lg:basis-0">
        <button @click="$router.push('/')" class="inline-flex items-center">
          <Logo class="h-20 w-auto text-slate-900" />
        </button>
      </div>
      <div
        class="order-first -mx-4 flex flex-auto basis-full overflow-x-auto whitespace-nowrap border-b border-blue-600/10 py-4 font-mono text-sm text-blue-600 sm:-mx-6 lg:order-none lg:mx-0 lg:basis-auto lg:border-0 lg:py-0"
      >
        <div class="mx-auto flex items-center gap-4 px-4">
          <p>
            <time dateTime="2022-04-04">Reverence Studios Dance Recital - </time>
            <time dateTime="2022-04-06">May 17, 2025</time>
          </p>
          <p>Mechanicsburg, PA</p>
        </div>
      </div>
      <Button v-if="user" text label="Logout" @click="handleLogout" />
      
      <div class="hidden sm:mt-10 sm:flex lg:mt-0 lg:grow lg:basis-0 lg:justify-end">
        <!-- Buy Tickets button when sales are active -->
        <Button v-if="isTicketSalesActive" label="Buy Tickets" @click="router.push('/purchase-tickets')" />
        
        <!-- Ticket sales over message -->
        <div v-else-if="isTicketSalesEnded" class="px-4 py-2 bg-blue-50 rounded-md border border-blue-200">
          <span class="text-blue-800 font-medium">Ticket sales have ended</span>
        </div>
        
        <!-- Countdown when sales haven't started yet -->
        <TicketSaleCountdown v-else-if="recital" :ticketStartDate="recital?.attributes?.ticket_sale_start" />
      </div>
    </Container>
  </header>
</template>

<script lang="ts" setup>
const { logout } = useStrapiAuth();
import Button from 'primevue/button';
const router = useRouter();
const user = useStrapiUser();
const recitalStore = useRecitalStore();
const { recital } = storeToRefs(recitalStore);

// Check if ticket sales are active (between start and end dates)
const isTicketSalesActive = computed(() => {
  if (!recital.value?.attributes?.ticket_sale_start || !recital.value?.attributes?.ticket_sale_end) {
    return false;
  }
  
  const now = new Date();
  const startDate = new Date(recital.value.attributes.ticket_sale_start);
  const endDate = new Date(recital.value.attributes.ticket_sale_end);
  
  return now >= startDate && now <= endDate;
});

// Check if ticket sales have ended
const isTicketSalesEnded = computed(() => {
  if (!recital.value?.attributes?.ticket_sale_end) {
    return false;
  }
  
  const now = new Date();
  const endDate = new Date(recital.value.attributes.ticket_sale_end);
  
  return now > endDate;
});

const handleLogout = () => {
  logout();
  router.push('/');
};
</script>