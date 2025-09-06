<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-2xl">
      <Card class="shadow-lg">
        <template #header>
          <div class="text-center py-8 bg-gradient-to-r from-red-500 to-pink-600 text-white">
            <i class="pi pi-exclamation-triangle text-6xl mb-4"></i>
            <h1 class="text-3xl font-bold">Payment Error</h1>
            <p class="mt-2">There was an issue processing your payment</p>
          </div>
        </template>

        <template #content>
          <div class="text-center py-6">
            <!-- Error Message -->
            <div class="mb-8">
              <h2 class="text-xl font-semibold mb-4">What went wrong?</h2>
              <div class="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                <p class="text-red-700">
                  {{ errorMessage || 'An unexpected error occurred while processing your payment.' }}
                </p>
              </div>
            </div>

            <!-- Next Steps -->
            <div class="mb-8 p-6 bg-blue-50 rounded-lg">
              <h3 class="text-lg font-semibold mb-4">What can you do?</h3>
              <div class="space-y-3 text-left">
                <div class="flex items-start">
                  <i class="pi pi-refresh text-blue-500 mr-3 mt-1"></i>
                  <div>
                    <p class="font-semibold">Try Again</p>
                    <p class="text-sm text-gray-600">Your payment link is still valid - you can try the payment again</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <i class="pi pi-credit-card text-blue-500 mr-3 mt-1"></i>
                  <div>
                    <p class="font-semibold">Check Your Card</p>
                    <p class="text-sm text-gray-600">Ensure your card details are correct and you have sufficient funds</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <i class="pi pi-envelope text-blue-500 mr-3 mt-1"></i>
                  <div>
                    <p class="font-semibold">Contact Support</p>
                    <p class="text-sm text-gray-600">We can help you complete your purchase or issue a new payment link</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-4">
              <Button 
                label="Try Payment Again" 
                icon="pi pi-refresh" 
                @click="goBack"
                severity="success"
                size="large"
                class="w-full"
              />
              
              <Button 
                label="Contact Support" 
                icon="pi pi-envelope" 
                @click="emailSupport"
                outlined
                class="w-full"
              />
              
              <Button 
                label="Go to Homepage" 
                icon="pi pi-home" 
                @click="goToHomepage"
                outlined
                class="w-full"
              />
            </div>

            <!-- Contact Information -->
            <div class="mt-8 p-4 border border-gray-200 rounded-lg">
              <h3 class="font-semibold mb-3">Need Help?</h3>
              <div class="space-y-2 text-sm">
                <div>
                  <strong>Email:</strong>
                  <a 
                    href="mailto:support@reverencestudios.com" 
                    class="text-purple-600 hover:underline ml-2"
                  >
                    support@reverencestudios.com
                  </a>
                </div>
                <div>
                  <strong>Phone/Text:</strong>
                  <a href="tel:+1234567890" class="text-purple-600 hover:underline ml-2">
                    (123) 456-7890
                  </a>
                </div>
              </div>
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

const route = useRoute();
const router = useRouter();

// State
const errorMessage = ref('');

// Initialize
onMounted(() => {
  // Get error message from query params if available
  errorMessage.value = route.query.message as string || '';
});

// Email support with pre-filled content
const emailSupport = () => {
  const subject = encodeURIComponent('Payment Error - Digital Download Purchase');
  const body = encodeURIComponent(`Hello,

I was trying to purchase digital download access but encountered an error during payment.

Error details: ${errorMessage.value || 'Payment processing failed'}

Could you please help me complete my purchase?

Thank you!`);
  
  window.location.href = `mailto:support@reverencestudios.com?subject=${subject}&body=${body}`;
};

// Navigation methods
const goBack = () => {
  window.history.back();
};

const goToHomepage = () => {
  router.push('/');
};

// SEO
useHead({
  title: 'Payment Error - Reverence Studios',
  meta: [
    { name: 'description', content: 'There was an error processing your payment. Get help completing your digital download purchase.' },
    { name: 'robots', content: 'noindex, nofollow' }
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