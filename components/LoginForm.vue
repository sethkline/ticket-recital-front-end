<template>
  <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
    <div class="mb-4">
      <h2 class="font-bold text-lg mb-2">Login</h2>
      <div class="flex space-x-2">
        <InputText v-model="loginInfo.identifier" placeholder="Email *" class="mb-3"/>
        <Password v-model="loginInfo.password" toggle-mask  placeholder="Password *" class="mb-3" />
      </div>
      <Button label="Login" @click="handleLogin" class="mt-4"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

const { login, fetchUser } = useStrapiAuth();
const router = useRouter();
const toast = useToast();
const loginInfo = ref({ identifier: '', password: '' });
const returnUrl = ref(router.currentRoute.value.query?.returnUrl || '/');

const handleLogin = async () => {
  try {
    await login(loginInfo.value);
    const userDetails = await fetchUser();
    console.log(userDetails);
    navigateBasedOnUserRole(userDetails);
  } catch (e) {
    console.warn(e);
    toast.add({severity: 'error', summary: 'Login Error', detail: 'Invalid email or password', life: 3000});
  }
}

function navigateBasedOnUserRole(userDetails) {
  if (userDetails.role === 'admin') {
    router.push('/admin/dashboard');
  } else if (userDetails.hasPurchasedTickets) {
    router.push('/user/dashboard');
  } else if (returnUrl.value) {
    router.push(returnUrl.value);
  } else {
    router.push('/purchase-tickets');
  }
}
</script>
