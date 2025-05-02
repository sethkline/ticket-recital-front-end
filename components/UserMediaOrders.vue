<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">My Media Orders</h2>
    
    <div v-if="loading" class="text-center py-4">
      <ProgressSpinner />
    </div>
    
    <div v-else-if="mediaOrders.length === 0" class="text-center py-8">
      <p class="text-gray-500">You have no DVD or digital download orders.</p>
    </div>
    
    <div v-else class="space-y-6">
      <div v-for="order in mediaOrders" :key="order.id" class="bg-white shadow-md rounded-lg p-6">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-xl font-semibold">Order #{{ order.id }}</h3>
            <p class="text-gray-500">{{ formatDate(order.orderDate) }}</p>
          </div>
          <Tag :value="formatStatus(order.mediaStatus)" :severity="getStatusSeverity(order.mediaStatus)" />
        </div>
        
        <div class="mt-4 space-y-4">
          <div v-if="order.hasDvd" class="border-l-4 border-blue-500 pl-3 py-2">
            <h4 class="font-semibold">DVD Order</h4>
            <p>Quantity: {{ order.dvdCount }}</p>
            <p class="text-sm text-gray-600">
              {{ getStatusMessage(order.mediaStatus, 'dvd') }}
            </p>
          </div>
          
          <div v-if="order.hasDigital" class="border-l-4 border-green-500 pl-3 py-2">
            <h4 class="font-semibold">Digital Download</h4>
            <div v-if="order.accessCode" class="mt-2">
              <p>Access Code: <span class="font-mono font-semibold">{{ order.accessCode }}</span></p>
              <Button 
                icon="pi pi-copy" 
                @click="copyAccessCode(order.accessCode)" 
                class="p-button-text p-button-sm" 
                v-tooltip.top="'Copy to clipboard'"
              >
                Copy Code
              </Button>
            </div>
            <div v-else class="mt-2">
              <p class="text-yellow-600">Access code will be provided once available.</p>
            </div>
            <p class="text-sm text-gray-600 mt-2">
              {{ getStatusMessage(order.mediaStatus, 'digital') }}
            </p>
          </div>
        </div>
        
        <div v-if="order.hasDigital && order.accessCode && order.mediaStatus === 'fulfilled'" class="mt-4 text-center">
          <Button 
            label="Access Digital Download" 
            icon="pi pi-play" 
            @click="accessDigitalDownload(order.accessCode)" 
            class="p-button-success"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const client = useStrapiClient();
const loading = ref(true);
const mediaOrders = ref([]);

onMounted(async () => {
  await fetchMediaOrders();
});

const fetchMediaOrders = async () => {
  loading.value = true;
  try {
    const response = await client('/orders/my-media-orders', {
      method: 'GET',
    });
    mediaOrders.value = response;
  } catch (error) {
    console.error('Error fetching media orders:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load your media orders', life: 3000 });
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatStatus = (status) => {
  if (!status) return 'Pending';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const getStatusSeverity = (status) => {
  switch (status) {
    case 'fulfilled':
      return 'success';
    case 'processing':
      return 'warning';
    case 'cancelled':
      return 'danger';
    case 'pending':
    default:
      return 'info';
  }
};

const getStatusMessage = (status, type) => {
  const messages = {
    dvd: {
      pending: 'Your DVD order is pending. We will notify you when it is being processed.',
      processing: 'Your DVD is being processed and will be ready for pickup soon.',
      fulfilled: 'Your DVD is ready for pickup at the studio.',
      cancelled: 'Your DVD order has been cancelled. Please contact us for more information.'
    },
    digital: {
      pending: 'Your digital download is pending. The download will be available after the recital.',
      processing: 'Your digital download is being processed and will be available soon.',
      fulfilled: 'Your digital download is now available. Use your access code to view the recital.',
      cancelled: 'Your digital download order has been cancelled. Please contact us for more information.'
    }
  };
  
  return messages[type][status] || messages[type]['pending'];
};

const copyAccessCode = (code) => {
  navigator.clipboard.writeText(code).then(
    () => {
      toast.add({ severity: 'success', summary: 'Copied', detail: 'Access code copied to clipboard', life: 3000 });
    },
    () => {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to copy access code', life: 3000 });
    }
  );
};

const accessDigitalDownload = (code) => {
  // This would typically redirect to a video platform or streaming page
  // For demonstration, we'll just show a toast message
  toast.add({ severity: 'info', summary: 'Access', detail: 'Redirecting to digital download page...', life: 3000 });
  
  // In a real implementation, you would redirect to the video platform
  // window.location.href = `/watch-recital?code=${code}`;
};
</script>

<style scoped>
.border-l-4 {
  border-left-width: 4px;
}
</style>