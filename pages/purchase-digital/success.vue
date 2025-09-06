<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-2xl">
      <Card class="shadow-lg">
        <template #header>
          <div class="text-center py-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <i class="pi pi-check-circle text-6xl mb-4"></i>
            <h1 class="text-3xl font-bold">Payment Successful!</h1>
            <p class="mt-2">Your digital download access is ready</p>
          </div>
        </template>

        <template #content>
          <div class="text-center py-6">
            <!-- Access Code Display -->
            <div class="mb-8 p-6 bg-green-50 rounded-lg border border-green-200">
              <h2 class="text-xl font-semibold mb-3">Your Access Code</h2>
              <div class="font-mono text-2xl font-bold text-green-700 mb-4 tracking-wider">
                {{ accessCode || 'Loading...' }}
              </div>
              <Button 
                v-if="accessCode"
                label="Copy Access Code" 
                icon="pi pi-copy" 
                @click="copyAccessCode"
                severity="success"
                outlined
              />
            </div>

            <!-- Instructions -->
            <div class="mb-8 text-left">
              <h3 class="text-lg font-semibold mb-4">How to Access Your Videos:</h3>
              <ol class="space-y-3 text-gray-700">
                <li class="flex items-start">
                  <span class="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">1</span>
                  <span>Visit our viewing page by clicking the button below</span>
                </li>
                <li class="flex items-start">
                  <span class="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">2</span>
                  <span>Enter your access code in the field provided</span>
                </li>
                <li class="flex items-start">
                  <span class="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">3</span>
                  <span>Choose your download option (Full Recital or Individual Dances)</span>
                </li>
                <li class="flex items-start">
                  <span class="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">4</span>
                  <span>Click the download links that appear to save videos to your computer</span>
                </li>
              </ol>
            </div>

            <!-- What's Included -->
            <div class="mb-8 p-4 bg-blue-50 rounded-lg text-left">
              <h3 class="font-semibold mb-3">What You've Purchased:</h3>
              <ul class="space-y-2 text-sm text-gray-700">
                <li class="flex items-start">
                  <i class="pi pi-check text-green-500 mr-2 mt-0.5"></i>
                  Full recital recording (High Quality 1080p - 3.4GB)
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check text-green-500 mr-2 mt-0.5"></i>
                  Full recital recording (Standard Quality 720p - 1.9GB)
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check text-green-500 mr-2 mt-0.5"></i>
                  38 individual dance performances
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check text-green-500 mr-2 mt-0.5"></i>
                  Access valid until December 31, 2025
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check text-green-500 mr-2 mt-0.5"></i>
                  Unlimited downloads while access is valid
                </li>
              </ul>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-4">
              <Button 
                label="Go to Viewing Page" 
                icon="pi pi-play" 
                @click="goToWatchPage"
                severity="success"
                size="large"
                class="w-full"
              />
              
              <Button 
                label="Back to Homepage" 
                icon="pi pi-home" 
                @click="goToHomepage"
                outlined
                class="w-full"
              />
            </div>

            <!-- Important Notes -->
            <div class="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 class="font-semibold mb-2 text-yellow-800">
                <i class="pi pi-info-circle mr-2"></i>
                Important Notes:
              </h4>
              <ul class="text-sm text-yellow-700 space-y-1 text-left">
                <li>• Download links expire after 24 hours for security</li>
                <li>• You can generate new download links anytime with your access code</li>
                <li>• For best results, use a desktop computer and high-speed internet</li>
                <li>• Right-click download links and select "Save Link As" for large files</li>
                <li>• A confirmation email has been sent to your email address</li>
              </ul>
            </div>

            <!-- Support Contact -->
            <div class="mt-6 text-sm text-gray-600">
              <p>Questions or need help? Contact us at:</p>
              <a href="mailto:support@reverencestudios.com" class="text-purple-600 hover:underline font-semibold">
                support@reverencestudios.com
              </a>
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

// State
const accessCode = ref('');

// Initialize
onMounted(() => {
  // Get access code from query params if available
  accessCode.value = route.query.code as string || '';
  
  // If no access code, try to get it from sessionStorage
  if (!accessCode.value && process.client) {
    accessCode.value = sessionStorage.getItem('digitalAccessCode') || '';
    // Clear from session storage after retrieving
    sessionStorage.removeItem('digitalAccessCode');
  }
});

// Copy access code to clipboard
const copyAccessCode = async () => {
  try {
    await navigator.clipboard.writeText(accessCode.value);
    toast.add({
      severity: 'success',
      summary: 'Copied!',
      detail: 'Access code copied to clipboard',
      life: 3000
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to copy access code',
      life: 3000
    });
  }
};

// Navigation methods
const goToWatchPage = () => {
  router.push('/watch-recital');
};

const goToHomepage = () => {
  router.push('/');
};

// SEO
useHead({
  title: 'Purchase Complete - Reverence Studios',
  meta: [
    { name: 'description', content: 'Your digital download purchase is complete. Access your recital recordings now.' },
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