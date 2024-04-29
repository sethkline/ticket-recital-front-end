<template>
  <div class="p-4">
    <div v-if="tickets.length > 0" class="space-y-4">
      <div v-for="ticket in tickets" :key="ticket.id" class="ticket">
        <div class="ticket-content">
          <p class="text-gray-600">Seat Number: {{ ticket.seat.number }} (Row {{ ticket.seat.row }})</p>
          <p class="text-gray-600">Price: ${{ ticket.event.ticket_price_in_cents / 100 }}</p>
        </div>
        <!-- <h3 class="ticket-title">{{ ticket.event.title }}</h3> -->
        <!-- <p class="text-gray-600">Location: {{ ticket.event.location }}</p> -->
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

const formatDate = (datePart, timePart) => {
    const date = new Date(datePart + 'T' + timePart);
    
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutes = date.getMinutes() === 0 ? '' : ':' + date.getMinutes();

    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} at ${hours}${minutes}${ampm}`;
    return formattedDate;
  }

onMounted(() => {
  fetchTickets();
});

</script>

<style scoped>
.ticket {
  width: 763px; /* Adjusted to fit your image size */
  height: 256px; /* Adjusted to fit your image size */
  position: relative;
  background-image: url('https://a.storyblok.com/f/147058/2289x769/f6580089da/2024_recitalpm.jpg/m/763x256');
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