<script setup lang="ts">
const { login } = useStrapiAuth()
const router = useRouter()
const toast = useToast();
const isLoggingIn = ref(false)
const loginInfo = ref({ identifier: '', password: '' });


const handleLogin = async () => {
  isLoggingIn.value = true; // Start loading
  try {
    await login(loginInfo.value);
    router.push('/profile');
  } catch (e) {
    console.warn(e);
    toast.add({ severity: 'error', summary: 'Login Error', detail: 'Invalid email or password', life: 3000 });
  } finally {
    isLoggingIn.value = false; // End loading
  }
};
</script>
<template>
  <div class="flex flex-col items-center pt-4 min-h-screen bg-gray-100">
    <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
    <h2 class="font-bold text-lg mb-2">Login</h2>
  <div class="flex flex-col sm:flex-row space-x-0 sm:space-x-2">
    <InputText v-model="loginInfo.identifier" placeholder="Email *" class="mb-3 flex-1" />
    <Password
      v-model="loginInfo.password"
      :feedback="false"
      placeholder="Password *"
      toggle-mask
      class="mb-3 flex-1"
    />
  </div>
  <Button label="Login" type="submit" @click="handleLogin" class="mt-4 w-full sm:w-auto" />
  <div class="flex justify-between mt-4">
    <p class="text-center sm:text-left">
            Don't have an account? <NuxtLink href="/register" class="text-blue-500">Register</NuxtLink>
          </p>
    <p class="text-center sm:text-left">
      <NuxtLink href="/forgot-password" class="text-blue-500">Forgot your password?</NuxtLink>
    </p>
  </div>
  </div>
  </div>
</template>
