<template>
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
        <Button v-if="recitalStore.ticketSalesTime" label="Buy Tickets" @click="router.push('/purchase-tickets')" />
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

const ticketSalesStarted = computed(() => {
  const now = new Date();
  const ticketSaleStart = new Date(recital.value?.attributes?.ticket_sale_start);
  return ticketSaleStart < now;
});

const handleLogout = () => {
  logout();
  router.push('/');
};
</script>