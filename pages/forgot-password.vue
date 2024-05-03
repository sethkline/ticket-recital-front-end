<template>
  <div class="flex flex-col items-center pt-4 min-h-screen bg-gray-100">
    <p class="text-gray-800 text-sm mb-4">
        Enter your email address below and we'll send you a link to reset your password.
      </p>
    <div class="flex flex-col sm:flex-row space-x-0 sm:space-x-2">
      <InputText v-model="email" placeholder="Email *" class="mb-3 flex-1" />
    </div>
    <div>
      <Button label="Reset Password" :loading="loading" @click="onSubmit" class="mt-4 w-full sm:w-auto" />
    </div>
    <p v-if="message" class="text-red-500">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';// make sure the path is correct
import { useStrapiAuth } from '#imports';

const { forgotPassword } = useStrapiAuth();
const router = useRouter();
const email = ref('');
const loading = ref(false);
const message = ref('');

const onSubmit = async () => {
  try {
    loading.value = true;
    await forgotPassword({ email: email.value });
    message.value = "If an account with that email exists, we have sent an email to reset your password.";
    loading.value = false;
    // Optionally redirect the user after showing the message or set a timeout to redirect
    setTimeout(() => router.push('/'), 5000); // Redirect after 5 seconds
  } catch (e) {
    message.value = "Failed to reset password. Please try again later.";
    loading.value = false;
  }
};
</script>
