<template>
  <div class="p-4">
    <div v-if="tickets.length > 0" class="space-y-4">
      <div v-for="ticket in tickets" :key="ticket.id" class="bg-white shadow-lg rounded-lg p-6">
        <h3 class="text-xl font-semibold">{{ ticket.event.title }}</h3>
        <p class="text-gray-600">Date: {{ ticket.event.date }} at {{ ticket.event.time }}</p>
        <p class="text-gray-600">Location: {{ ticket.event.location }}</p>
        <p class="text-gray-600">Seat Number: {{ ticket.seat.number }} (Row {{ ticket.seat.row }})</p>
        <p class="text-gray-600">Price: ${{ ticket.event.ticket_price_in_cents / 100 }}</p>
      </div>
    </div>
    <div v-else class="text-center">
      <p>You have no tickets purchased.</p>
    </div>
  </div>
</template>


<script setup lang="ts">

const tickets = ref([]);
const client = useStrapiClient()

const fetchTickets = async () => {
  try {
    const response = await client('/orders/my-tickets', {
      method: 'GET',
    });
    tickets.value = response;
  } catch (error) {
    console.error('Error fetching tickets:', error);
  }
};

onMounted(() => {
  fetchTickets();
});

</script>

<style scoped>

</style>