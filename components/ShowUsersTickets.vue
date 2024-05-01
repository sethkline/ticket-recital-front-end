<template>
  <div class="p-4">
    <div class="flex space-x-4 align-bottom mb-3">
      <div>
        <Button @click="printTickets" class="print-button print:hidden py-3 mb-2">Print Tickets</Button>

      </div>
    <div class="mt-4 text-sm print:hidden text-gray-600">
        <h4 class="font-semibold">Printing your Tickets:</h4>
        <p>If your tickets do not print with the background images:</p>
        <ul class="list-disc pl-5">
          <li>Check your printer settings to ensure 'Print Background Images' is enabled.</li>
          <li>This setting is often found under 'More Settings' in your print dialog.</li>
        </ul>
      </div>

    </div>
    <div v-if="tickets.length > 0" class="space-y-4">
      <div v-for="ticket in tickets" :key="ticket.id" class="ticket" :style="backgroundStyle(ticket)">
        <div class="ticket-content">
          <p class="text-gray-600">{{ ticket?.event?.title }}</p>
          <p class="text-gray-600">{{ formatDate(ticket?.event?.date) }} {{ ticket?.event?.time }}</p>
          <p class="text-gray-600">Seat Number: {{ ticket.seat.number }} (Row {{ ticket.seat.row }})</p>
        </div>
      </div>
    </div>
    <div v-else class="text-center">
      <p>You have no tickets purchased.</p>
    </div>

    </div>
</template>



<script setup lang="ts">
import { useStrapiClient } from '#imports'; // Adjust import according to your setup

const tickets = ref([]);
const client = useStrapiClient();

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
const backgroundStyle = (ticket) => {
  const morningImagePath = `https://a.storyblok.com/f/147058/2289x769/fffff3e58e/2024_recitalam.jpg/m/763x256`;
  const afternoonImagePath = `https://a.storyblok.com/f/147058/2289x769/c73bc32bce/2024_recitalpm.jpg/m/763x256`;
  const imageUrl = ticket.event.title === 'Morning Recital' ? morningImagePath : afternoonImagePath;
  return {
    backgroundImage: `url(${imageUrl})`
  };
};

const printTickets = () => {
  window.print();
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

onMounted(() => {
  fetchTickets();
});
</script>

<style scoped>
.ticket {
  width: 763px; /* Adjusted to fit your image size */
  height: 256px; /* Adjusted to fit your image size */
  position: relative;
  /* background-image: url('https://a.storyblok.com/f/147058/2289x769/f6580089da/2024_recitalpm.jpg/m/763x256'); */
  background-size: cover;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.ticket-content {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff; /* Change text color based on your background */
  text-align: center;
  width: 100%;
}

.ticket-title {
  font-size: 24px;
  font-weight: bold;
}

.ticket p {
  font-size: 16px;
  margin: 5px 0;
}

</style>