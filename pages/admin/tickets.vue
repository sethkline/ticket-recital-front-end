<template>
  <div>
    <AdminMenuBar />
    <!-- <pre>{{ morningMetrics }}</pre>
    <pre>{{ afternoonMetrics }}</pre>
    <pre>{{ totalSales }}</pre>
    <pre>{{ adminStore.tickets }}</pre> -->
    <pre>{{ groupedTickets}}</pre>
    <DataTable :value="groupedTickets" tableStyle="min-width: 50rem">
    <Column field="userName" header="UserName"></Column>
    <Column field="email" header="Email"></Column>
    <Column field="tickets" header="Tickets"></Column>
</DataTable>
  </div>
</template>

<script setup lang="ts">
import admin from '~/middleware/admin';

const adminStore = useAdminStore();
const recitalStore = useRecitalStore();
const seatStore = useSeatStore();
const checkoutStore = useCheckoutStore();

definePageMeta({
  middleware: ['authenticated'],
});

const totalSales = ref(null);
const morningMetrics = ref(null);
const afternoonMetrics = ref(null);
const groupedTickets = ref(null);
onMounted(async () => {
  await adminStore.fetchTickets();
  totalSales.value = await adminStore.getTotalSales();
  await recitalStore.fetchRecital();
  await seatStore.fetchEvents()
  morningMetrics.value = await adminStore.getRecitalMetrics(checkoutStore.morningId as string)
  afternoonMetrics.value = await adminStore.getRecitalMetrics(checkoutStore.afternoonId as string)
  groupedTickets.value = await adminStore.getGroupedTickets()
});


</script>


<style scoped>





</style>