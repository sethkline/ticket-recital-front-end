<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-2xl">
      <Card class="shadow-lg">
        <template #header>
          <div class="text-center py-8 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <i class="pi pi-clock text-6xl mb-4"></i>
            <h1 class="text-3xl font-bold">Payment Link Expired</h1>
            <p class="mt-2">This payment link is no longer valid</p>
          </div>
        </template>

        <template #content>
          <div class="text-center py-6">
            <div class="mb-8">
              <h2 class="text-xl font-semibold mb-4">What happened?</h2>
              <p class="text-gray-600 mb-4">
                Payment links expire after a certain period for security reasons. 
                This particular link is no longer valid and cannot be used to make a purchase.
              </p>
            </div>

            <!-- Next Steps -->
            <div class="mb-8 p-6 bg-blue-50 rounded-lg">
              <h3 class="text-lg font-semibold mb-4">What can you do next?</h3>
              <div class="space-y-3 text-left">
                <div class="flex items-start">
                  <i class="pi pi-envelope text-blue-500 mr-3 mt-1"></i>
                  <div>
                    <p class="font-semibold">Contact Support</p>
                    <p class="text-sm text-gray-600">We can generate a new payment link for you</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <i class="pi pi-phone text-blue-500 mr-3 mt-1"></i>
                  <div>
                    <p class="font-semibold">Call or Text</p>
                    <p class="text-sm text-gray-600">We can help you complete your purchase over the phone</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <i class="pi pi-user text-blue-500 mr-3 mt-1"></i>
                  <div>
                    <p class="font-semibold">Already Have an Account?</p>
                    <p class="text-sm text-gray-600">Check if you can purchase through your account</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Contact Information -->
            <div class="mb-8 p-4 border border-gray-200 rounded-lg">
              <h3 class="font-semibold mb-3">Contact Information</h3>
              <div class="space-y-2">
                <div>
                  <strong>Email:</strong>
                  <a 
                    href="mailto:support@reverencestudios.com?subject=Expired Payment Link - Need New Link" 
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

            <!-- Action Buttons -->
            <div class="space-y-4">
              <Button 
                label="Send Email to Support" 
                icon="pi pi-envelope" 
                @click="emailSupport"
                severity="success"
                size="large"
                class="w-full"
              />
              
              <Button 
                label="Go to Homepage" 
                icon="pi pi-home" 
                @click="goToHomepage"
                outlined
                class="w-full"
              />
              
              <Button 
                label="Sign In to Your Account" 
                icon="pi pi-user" 
                @click="goToSignIn"
                outlined
                class="w-full"
              />
            </div>

            <!-- Additional Help -->
            <div class="mt-8 text-sm text-gray-500">
              <p class="mb-2">We apologize for any inconvenience.</p>
              <p>We're here to help make sure you get access to your digital downloads!</p>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

// Email support with pre-filled subject
const emailSupport = () => {
  const subject = encodeURIComponent('Expired Payment Link - Need New Link');
  const body = encodeURIComponent(`Hello,

I had a payment link for digital download access that has expired. Could you please send me a new payment link so I can complete my purchase?

Thank you!`);
  
  window.location.href = `mailto:support@reverencestudios.com?subject=${subject}&body=${body}`;
};

// Navigation methods
const goToHomepage = () => {
  router.push('/');
};

const goToSignIn = () => {
  router.push('/auth/signin');
};

// SEO
useHead({
  title: 'Payment Link Expired - Reverence Studios',
  meta: [
    { name: 'description', content: 'This payment link has expired. Contact support for assistance with your digital download purchase.' },
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