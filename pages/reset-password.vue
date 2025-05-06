<template>
  <div class="mb-4 p-4">
    <h2 class="font-bold text-lg mb-2">Reset Password</h2>
    
    <div v-if="errorMessage" class="p-3 bg-red-100 text-red-700 rounded mb-3">
      {{ errorMessage }}
    </div>
    
    <div v-if="successMessage" class="p-3 bg-green-100 text-green-700 rounded mb-3">
      {{ successMessage }}
    </div>
    
    <div class="flex flex-col sm:flex-row space-x-0 sm:space-x-2">
      <Password 
        v-model="resetInfo.password" 
        placeholder="Password *" 
        toggle-mask 
        class="mb-3 flex-1" 
        :class="{'p-invalid': passwordErrors.length > 0}"
      />
      <Password
        v-model="resetInfo.confirmPassword"
        placeholder="Confirm Password *"
        toggle-mask
        class="mb-3 flex-1"
        :class="{'p-invalid': confirmErrors.length > 0}"
      />
    </div>
    
    <div v-if="passwordErrors.length > 0" class="text-red-500 text-sm mb-2">
      <div v-for="(error, index) in passwordErrors" :key="index">
        {{ error }}
      </div>
    </div>
    
    <div v-if="confirmErrors.length > 0" class="text-red-500 text-sm mb-2">
      <div v-for="(error, index) in confirmErrors" :key="index">
        {{ error }}
      </div>
    </div>
    
    <Button 
      label="Reset" 
      @click="onSubmit" 
      class="mt-4 w-full sm:w-auto"
      :loading="loading"
      :disabled="loading" 
    />
    
    Already have an account? <a href="#" @click="toggleView" class="text-blue-500">Login</a>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStrapiAuth } from '#imports';

const { resetPassword } = useStrapiAuth();
const router = useRouter();

// Get code from URL
const code = (router.currentRoute.value.query.code || router.currentRoute.value.query.token) as string;

// State variables
const resetInfo = ref({ password: '', confirmPassword: '' });
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

// Validation
const passwordErrors = computed(() => {
  const errors = [];
  if (resetInfo.value.password.length > 0) {
    if (resetInfo.value.password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    if (!/[A-Z]/.test(resetInfo.value.password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[0-9]/.test(resetInfo.value.password)) {
      errors.push('Password must contain at least one number');
    }
  }
  return errors;
});

const confirmErrors = computed(() => {
  const errors = [];
  if (resetInfo.value.confirmPassword.length > 0 && 
      resetInfo.value.password !== resetInfo.value.confirmPassword) {
    errors.push('Passwords do not match');
  }
  return errors;
});

// Check if code is present
if (!code) {
  errorMessage.value = 'Reset code is missing. Please request a new password reset link.';
}

// Submit handler
const onSubmit = async () => {
  // Reset messages
  errorMessage.value = '';
  successMessage.value = '';
  
  // Validate
  if (passwordErrors.value.length > 0 || confirmErrors.value.length > 0) {
    errorMessage.value = 'Please fix the errors before submitting.';
    return;
  }
  
  if (!resetInfo.value.password || !resetInfo.value.confirmPassword) {
    errorMessage.value = 'Please fill in all required fields.';
    return;
  }
  
  if (!code) {
    errorMessage.value = 'Reset code is missing. Please request a new password reset link.';
    return;
  }
  
  try {
    loading.value = true;
    
    await resetPassword({
      code: code,
      password: resetInfo.value.password,
      passwordConfirmation: resetInfo.value.confirmPassword
    });
    
    successMessage.value = 'Password reset successful! Redirecting to profile...';
    
    // Redirect after a short delay
    setTimeout(() => {
      router.push('/profile');
    }, 2000);
    
  } catch (error) {
    console.error('Password reset error:', error);
    
    // Check if error is from Strapi
    if (error.response && error.response.data) {
      errorMessage.value = error.response.data.error.message || 'Failed to reset password. Please try again.';
    } else {
      errorMessage.value = 'Failed to reset password. The link may have expired or is invalid.';
    }
  } finally {
    loading.value = false;
  }
};

// Navigation
const toggleView = () => {
  router.push('/login');
};
</script>