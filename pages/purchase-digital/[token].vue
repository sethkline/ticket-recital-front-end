<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-2xl">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <ProgressSpinner />
        <p class="mt-4 text-gray-600">Validating payment link...</p>
      </div>

      <!-- Valid Payment Link -->
      <Card v-else-if="!loading && isValid" class="shadow-lg">
        <template #header>
          <div class="text-center py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <h1 class="text-3xl font-bold">Complete Your Purchase</h1>
            <p class="mt-2">Digital Download Access - Reverence Studios Recital</p>
          </div>
        </template>

        <template #content>
          <!-- Customer Information -->
          <div class="mb-6 p-4 bg-gray-100 rounded-lg">
            <h3 class="font-semibold mb-2">Customer Information</h3>
            <p><strong>Name:</strong> {{ paymentLinkData?.customer_name }}</p>
            <p><strong>Email:</strong> {{ paymentLinkData?.customer_email }}</p>
          </div>

          <!-- Order Summary -->
          <div class="mb-6">
            <h3 class="text-xl font-semibold mb-4">Order Summary</h3>
            <div class="border rounded-lg p-4">
              <div class="flex justify-between items-center mb-2">
                <div>
                  <p class="font-semibold">Digital Download Access</p>
                  <p class="text-sm text-gray-600">Full Recital Recording + 38 Individual Dances</p>
                </div>
                <p class="text-2xl font-bold text-purple-600">${{ amount }}</p>
              </div>
              <Divider />
              <div class="mt-4">
                <h4 class="font-semibold mb-2">What's Included:</h4>
                <ul class="text-sm text-gray-700 space-y-1">
                  <li class="flex items-start">
                    <i class="pi pi-check-circle text-green-500 mr-2 mt-0.5"></i>
                    Full recital recording (High Quality 1080p - 3.4GB)
                  </li>
                  <li class="flex items-start">
                    <i class="pi pi-check-circle text-green-500 mr-2 mt-0.5"></i>
                    Full recital recording (Standard Quality 720p - 1.9GB)
                  </li>
                  <li class="flex items-start">
                    <i class="pi pi-check-circle text-green-500 mr-2 mt-0.5"></i>
                    38 individual dance performances
                  </li>
                  <li class="flex items-start">
                    <i class="pi pi-check-circle text-green-500 mr-2 mt-0.5"></i>
                    Access code valid until December 31, 2025
                  </li>
                  <li class="flex items-start">
                    <i class="pi pi-check-circle text-green-500 mr-2 mt-0.5"></i>
                    Unlimited downloads while access is valid
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Custom Message if provided -->
          <div v-if="paymentLinkData?.custom_message" class="mb-6 p-4 bg-blue-50 rounded-lg">
            <p class="text-sm">{{ paymentLinkData.custom_message }}</p>
          </div>

          <!-- Payment Form Component -->
          <DigitalPurchaseForm 
            :token="token"
            :amount="amount"
            :customer-email="paymentLinkData?.customer_email"
            :customer-name="paymentLinkData?.customer_name"
            @success="handlePaymentSuccess"
            @error="handlePaymentError"
          />
        </template>
      </Card>

      <!-- Invalid/Expired Link -->
      <Card v-else-if="!loading && !isValid" class="shadow-lg">
        <template #content>
          <div class="text-center py-12">
            <i class="pi pi-exclamation-triangle text-6xl text-yellow-500 mb-4"></i>
            <h2 class="text-2xl font-bold mb-2">{{ errorTitle }}</h2>
            <p class="text-gray-600 mb-6">{{ errorMessage }}</p>
            
            <div class="space-y-2">
              <p class="text-sm text-gray-500">Need help? Contact us at:</p>
              <p class="font-semibold">support@reverencestudios.com</p>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const client = useStrapiClient();

// State
const loading = ref(true);
const isValid = ref(false);
const paymentLinkData = ref(null);
const token = ref('');
const amount = ref(20);
const errorTitle = ref('Invalid Payment Link');
const errorMessage = ref('This payment link is invalid or has expired.');

// Initialize
onMounted(async () => {
  token.value = route.params.token as string;
  await validatePaymentLink();
});

// Validate the payment link
const validatePaymentLink = async () => {
  loading.value = true;
  try {
    const response = await client(`/payment-links/validate/${token.value}`, {
      method: 'GET'
    });
    
    if (response.status === 'pending') {
      isValid.value = true;
      paymentLinkData.value = response;
      amount.value = response.amount || 20;
    } else if (response.status === 'completed') {
      isValid.value = false;
      errorTitle.value = 'Payment Already Completed';
      errorMessage.value = 'This payment link has already been used. The access code has been sent to the registered email.';
    } else if (response.status === 'expired') {
      isValid.value = false;
      errorTitle.value = 'Payment Link Expired';
      errorMessage.value = 'This payment link has expired. Please contact support for a new link.';
    } else {
      isValid.value = false;
    }
  } catch (error) {
    console.error('Error validating payment link:', error);
    isValid.value = false;
    
    // Check if it's a 404 error
    if (error.response?.status === 404) {
      errorTitle.value = 'Payment Link Not Found';
      errorMessage.value = 'This payment link does not exist. Please check the link and try again.';
    }
  } finally {
    loading.value = false;
  }
};

// Handle successful payment
const handlePaymentSuccess = async (response) => {
  // Store access code in session storage for success page
  if (process.client) {
    sessionStorage.setItem('digitalAccessCode', response.accessCode);
  }
  
  // Navigate to success page
  router.push('/purchase-digital/success');
};

// Handle payment error
const handlePaymentError = (error) => {
  // Navigate to error page with error message
  router.push({
    path: '/purchase-digital/error',
    query: {
      message: error.message || 'Payment processing failed'
    }
  });
};

// SEO
useHead({
  title: 'Purchase Digital Download - Reverence Studios',
  meta: [
    { name: 'description', content: 'Complete your purchase for digital download access to the Reverence Studios recital recording.' }
  ]
});

definePageMeta({
  layout: 'default',
  auth: false
});
</script>

<style scoped>
/* Any additional styles if needed */
</style>