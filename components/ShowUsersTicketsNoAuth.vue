<template>
  <div class="p-4">
    <!-- Authenticated user view -->
    <div v-if="user">
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
            <p class="text-gray-600">Seat Number: {{ ticket.seat?.number }} (Row {{ ticket.seat?.row }})</p>
          </div>
        </div>
      </div>
      <div v-else class="text-center">
        <p>You have no tickets purchased.</p>
      </div>
    </div>
    
    <!-- Non-authenticated user view -->
    <div v-else>
      <!-- Email search form (only visible when not showing tickets) -->
      <div v-if="!showTickets" class="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
        <p class="mb-4">Enter your email address to view your tickets without logging in.</p>
        
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium mb-1">Email Address</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            class="w-full p-2 border rounded-md" 
            placeholder="yourname@example.com"
            required
          />
        </div>
        
        <Button @click="findTickets" :loading="loading" class="w-full">
          Find My Tickets
        </Button>
        
        <div v-if="errorMessage" class="mt-4 bg-red-100 text-red-700 p-3 rounded-md">
          {{ errorMessage }}
        </div>
      </div>
      
      <!-- Tickets display for non-authenticated users -->
      <div v-if="showTickets">
        <div class="flex justify-between items-center mb-4 print:hidden">
          <h2 class="text-xl font-semibold">Tickets for {{ email }}</h2>
          <Button @click="resetSearch" variant="secondary">
            Search Again
          </Button>
        </div>
        
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
              <p class="text-gray-600">Seat Number: {{ ticket.seat?.number }} (Row {{ ticket.seat?.row }})</p>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center">
          <p>No tickets found for this email address.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStrapiClient, useStrapiUser } from '#imports';

const user = useStrapiUser();
const email = ref('');
const tickets = ref([]);
const loading = ref(false);
const errorMessage = ref('');
const showTickets = ref(false);
const client = useStrapiClient();

// Fetch tickets on component mount if user is authenticated
onMounted(() => {
  if (user.value) {
    fetchTickets();
  }
});

// For authenticated users
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

// For non-authenticated users
const findTickets = async () => {
  if (!email.value || !email.value.includes('@')) {
    errorMessage.value = 'Please enter a valid email address.';
    return;
  }
  
  loading.value = true;
  errorMessage.value = '';
  
  try {
    const response = await client('/orders/find-by-email', {
      method: 'POST',
      body: { email: email.value },
    });
    
    tickets.value = response || [];
    showTickets.value = true;
    
    if (tickets.value.length === 0) {
      errorMessage.value = 'No tickets found for this email address.';
    }
  } catch (error) {
    console.error('Error finding tickets:', error);
    errorMessage.value = 'An error occurred when trying to find your tickets. Please try again.';
  } finally {
    loading.value = false;
  }
};

const resetSearch = () => {
  showTickets.value = false;
  email.value = '';
  tickets.value = [];
  errorMessage.value = '';
};

const backgroundStyle = (ticket) => {
  // Defensive check to make sure ticket.event exists before accessing title
  if (!ticket || !ticket.event) {
    return { backgroundImage: 'none' };
  }
  
  const morningImagePath = `https://a.storyblok.com/f/147058/2289x769/ccf5a13749/2025-ticket-morning.jpg/m/763x256`;
  const afternoonImagePath = `https://a.storyblok.com/f/147058/2289x769/ef58e193a2/2025-ticket-afternoon.jpg/m/763x256`;
  const imageUrl = ticket.event.title?.toLowerCase().includes('morning') ? 
    morningImagePath : afternoonImagePath;
  
  return {
    backgroundImage: `url(${imageUrl})`
  };
};

const printTickets = () => {
  window.print();
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  
  // Create a Date object using UTC time
  const date = new Date(`${dateStr}T00:00:00Z`);
  // Format the date using UTC methods to avoid time zone issues
  return `${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCFullYear()}`;
};
</script>

<style scoped>
.ticket {
  width: 763px; /* Adjusted to fit your image size */
  height: 256px; /* Adjusted to fit your image size */
  position: relative;
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

@media (max-width: 800px) {
  .ticket {
    width: 100%;
    height: auto;
    aspect-ratio: 763/256;
  }
}

@media print {
  .ticket {
    page-break-inside: avoid;
    margin-bottom: 20px;
  }
}
</style>