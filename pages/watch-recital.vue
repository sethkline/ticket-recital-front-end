<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Reverence Studios Recital Recording</h1>
    
    <div v-if="!accessGranted" class="bg-white shadow-md rounded-lg p-6">
      <h2 class="text-xl font-semibold mb-4">Enter Your Access Code</h2>
      <p class="mb-4">Please enter the access code you received with your digital download purchase.</p>
      
      <div class="flex space-x-2">
        <InputText v-model="accessCode" placeholder="DVL-2025-XXXX" class="w-full" @keyup.enter="validateCode" />
        <Button @click="validateCode" :loading="loading">Access Video</Button>
      </div>
      
      <div v-if="errorMessage" class="mt-3 text-red-600">
        {{ errorMessage }}
      </div>
    </div>
    
    <div v-else class="bg-white shadow-md rounded-lg overflow-hidden">
      <div class="p-6 pb-0">
        <h2 class="text-xl font-semibold mb-2">Reverence Studios 2025 Recital</h2>
        <p class="text-gray-600 mb-4">Thank you for purchasing the digital recording!</p>
      </div>
      
      <!-- Video player -->
      <div class="aspect-w-16 aspect-h-9 bg-black">
        <iframe 
          class="w-full h-full" 
          :src="videoUrl" 
          frameborder="0" 
          allow="autoplay; fullscreen" 
          allowfullscreen>
        </iframe>
      </div>
      
      <div class="p-6">
        <h3 class="font-semibold">Important Notes:</h3>
        <ul class="list-disc pl-5 mt-2">
          <li>This access is for your personal use only</li>
          <li>Please do not share your access code with others</li>
          <li>The video will be available until December 31, 2025</li>
          <li>For any issues, contact <a href="mailto:support@reverencestudios.com" class="text-blue-600 hover:underline">support@reverencestudios.com</a></li>
        </ul>
        
        <div class="mt-6">
          <h3 class="font-semibold mb-2">Video Options:</h3>
          <div class="flex flex-wrap gap-4">
            <Button label="Morning Recital" icon="pi pi-play" @click="setVideo('morning')" :outlined="currentVideo !== 'morning'" />
            <Button label="Afternoon Recital" icon="pi pi-play" @click="setVideo('afternoon')" :outlined="currentVideo !== 'afternoon'" />
            <Button label="Behind the Scenes" icon="pi pi-video" @click="setVideo('behindScenes')" :outlined="currentVideo !== 'behindScenes'" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const client = useStrapiClient();
const toast = useToast();

const accessCode = ref('');
const errorMessage = ref('');
const loading = ref(false);
const accessGranted = ref(false);
const currentVideo = ref('morning');

// Video URLs (these would be set by your API in a real implementation)
const videos = {
  morning: 'https://player.vimeo.com/video/your-morning-video-id?h=your-hash&autoplay=0',
  afternoon: 'https://player.vimeo.com/video/your-afternoon-video-id?h=your-hash&autoplay=0',
  behindScenes: 'https://player.vimeo.com/video/your-bts-video-id?h=your-hash&autoplay=0'
};

const videoUrl = computed(() => {
  return videos[currentVideo.value];
});

const setVideo = (type) => {
  currentVideo.value = type;
};

const validateCode = async () => {
  if (!accessCode.value) {
    errorMessage.value = 'Please enter an access code';
    return;
  }
  
  loading.value = true;
  errorMessage.value = '';
  
  try {
    const response = await client('/orders/validate-access-code', {
      method: 'POST',
      body: JSON.stringify({ accessCode: accessCode.value }),
    });
    
    if (response.valid) {
      accessGranted.value = true;
      
      // Set the initial video type based on the user's order (morning/afternoon)
      if (response.recitalType) {
        currentVideo.value = response.recitalType.toLowerCase();
      }
      
      // Store access in localStorage to persist between page refreshes
      localStorage.setItem('recitalAccessCode', accessCode.value);
      
      toast.add({ severity: 'success', summary: 'Success', detail: 'Access granted', life: 3000 });
    } else {
      errorMessage.value = 'Invalid access code. Please check and try again.';
    }
  } catch (error) {
    console.error('Error validating access code:', error);
    errorMessage.value = 'An error occurred. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Check for saved access code on page load
onMounted(() => {
  const savedCode = localStorage.getItem('recitalAccessCode');
  if (savedCode) {
    accessCode.value = savedCode;
    validateCode();
  }
});
</script>

<style scoped>
.aspect-w-16 {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
}

.aspect-w-16 iframe {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
</style>