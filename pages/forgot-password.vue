<template>
  <div class="flex flex-col items-center pt-4 min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
      <h2 class="text-2xl font-bold mb-4 text-center">Reset Password</h2>
      
      <p class="text-gray-700 mb-6">
        Enter your email address below and we'll send you a link to reset your password.
      </p>
      
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <input 
          type="email" 
          id="email" 
          v-model="email" 
          placeholder="yourname@example.com" 
          class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div class="mt-6">
        <Button 
          @click="onSubmit" 
          :loading="loading" 
          class="w-full p-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Reset Password
        </Button>
      </div>
      
      <div v-if="message" :class="messageClass" class="mt-4 p-3 rounded-md text-center">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStrapiAuth } from '#imports';

const { forgotPassword } = useStrapiAuth();
const router = useRouter();
const email = ref('');
const loading = ref(false);
const message = ref('');
const isSuccess = ref(false);

// Compute class for message based on success state
const messageClass = computed(() => {
  return isSuccess.value 
    ? 'bg-green-100 text-green-700' 
    : 'bg-red-100 text-red-700';
});

const onSubmit = async () => {
  // Validate email
  if (!email.value || !email.value.includes('@')) {
    message.value = "Please enter a valid email address.";
    isSuccess.value = false;
    return;
  }
  
  try {
    loading.value = true;
    
    // For debugging
    console.log('Attempting password reset for:', email.value);
    
    await forgotPassword({ email: email.value });
    
    isSuccess.value = true;
    message.value = "If an account with that email exists, we have sent an email to reset your password.";
    
    // Optional redirect after successful request
    setTimeout(() => router.push('/'), 5000); // Redirect after 5 seconds
  } catch (e) {
    console.error('Password reset error:', e);
    isSuccess.value = false;
    message.value = "Failed to reset password. Please try again later.";
  } finally {
    loading.value = false;
  }
};
</script>