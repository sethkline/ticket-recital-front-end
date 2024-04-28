<template>
  <div class="flex flex-col items-center pt-4 min-h-screen bg-gray-100">
    <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
      <div v-if="isLogin" class="mb-4">
        <h2 class="font-bold text-lg mb-2">Login</h2>
        <div class="flex flex-col sm:flex-row space-x-0 sm:space-x-2">
          <InputText v-model="loginInfo.identifier" placeholder="Email *" class="mb-3 flex-1" />
          <Password v-model="loginInfo.password" :feedback="false" placeholder="Password *" toggle-mask class="mb-3 flex-1" />
        </div>
        <Button label="Login" @click="handleLogin" class="mt-4 w-full sm:w-auto" />
        <p class="mt-4 text-center sm:text-left">
          Don't have an account? <a href="#" @click="toggleView" class="text-blue-500">Register</a>
        </p>
      </div>
      <!-- <LoginForm v-if="isLogin"> -->

      <!-- </LoginForm> -->

      <div v-else class="mb-4">
        <h2 class="font-bold text-lg mb-2">Register</h2>
        <div class="flex flex-col sm:flex-row space-x-0 sm:space-x-2">
          <InputText v-model="registerInfo.firstName" placeholder="First Name *" class="mb-3" />
          <InputText v-model="registerInfo.lastName" placeholder="Last Name *" class="mb-3" />
        </div>
        <div class="flex flex-col sm:flex-row space-x-0 sm:space-x-2">
          <InputText v-model="registerInfo.email" placeholder="Email *" class="mb-3 flex-1" />
          <Password v-model="registerInfo.password" placeholder="Password *" toggle-mask class="mb-3 flex-1" />
          <Password
            v-model="registerInfo.confirmPassword"
            placeholder="Confirm Password *"
            toggle-mask
            class="mb-3 flex-1"
          />
        </div>
        <Button label="Register" @click="handleRegister" class="mt-4 w-full sm:w-auto" />
        <p class="mt-4 text-center sm:text-left">
          Already have an account? <a href="#" @click="toggleView" class="text-blue-500">Login</a>
        </p>
      </div>
    </div>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const { login, register } = useStrapiAuth();
const router = useRouter();
const toast = useToast();

const isLoggingIn = ref(false);
const isLogin = ref(false);
const loginInfo = ref({ identifier: '', password: '' });
const registerInfo = ref({ email: '', password: '', confirmPassword: '', firstName: '', lastName: '' });

const toggleView = () => {
  isLogin.value = !isLogin.value;
};

const handleLogin = async () => {
  isLoggingIn.value = true; // Start loading
  try {
    await login(loginInfo.value);
    router.push('/purchase-tickets');
  } catch (e) {
    console.warn(e);
    toast.add({ severity: 'error', summary: 'Login Error', detail: 'Invalid email or password', life: 3000 });
  } finally {
    isLoggingIn.value = false; // End loading
  }
};

const handleRegister = async () => {
  isLoggingIn.value = true; // Start loading
  // Check if passwords match
  if (registerInfo.value.password !== registerInfo.value.confirmPassword) {
    toast.add({ severity: 'error', summary: 'Register Error', detail: 'Passwords do not match', life: 3000 });
    return;
  }
  // if name is empty, give error
  if (!registerInfo.value.firstName || !registerInfo.value.lastName) {
    toast.add({ severity: 'error', summary: 'Register Error', detail: 'Name is required', life: 3000 });
  }
  // if email is empty, give error
  if (!registerInfo.value.email) {
    toast.add({ severity: 'error', summary: 'Register Error', detail: 'Email is required', life: 3000 });
  }
  try {
    await register({
      username: registerInfo.value.email,
      email: registerInfo.value.email,
      password: registerInfo.value.password
    });
    router.push('/purchase-tickets');
  } catch (e) {
    console.warn(e);
    toast.add({ severity: 'error', summary: 'Register Error', detail: 'Registration failed', life: 3000 });
  } finally {
    isLoggingIn.value = false; // End loading
  }
};
</script>
<style scoped></style>
