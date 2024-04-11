<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
      <div v-if="isLogin" class="mb-4">
        <h2 class="font-bold text-lg mb-2">Login</h2>
        <InputText v-model="loginInfo.identifier" placeholder="Email" class="mb-3"/>
        <InputText v-model="loginInfo.password" placeholder="Password" type="password" />
        <Button label="Login" @click="handleLogin" class="mt-4"/>
        <p class="mt-4">Don't have an account? <a href="#" @click="toggleView" class="text-blue-500">Register</a></p>
      </div>
      
      <div v-else class="mb-4">
        <h2 class="font-bold text-lg mb-2">Register</h2>
        <div class="flex space-x-2">
          <InputText v-model="registerInfo.email" placeholder="Email" class="mb-3"/>
          <Password v-model="registerInfo.password" placeholder="Password" toggle-mask class="mb-3"/>
          <Password v-model="registerInfo.confirmPassword" placeholder="Confirm Password" toggle-mask class="mb-3" />
        </div>
        <Button label="Register" @click="handleRegister" class="mt-4"/>
        <p class="mt-4">Already have an account? <a href="#" @click="toggleView" class="text-blue-500">Login</a></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const { login, register } = useStrapiAuth()
const router = useRouter()


const isLoggingIn = ref(false)
const isLogin = ref(true)
const loginInfo = ref({ identifier: '', password: '' })
const registerInfo = ref({ email: '', password: '', confirmPassword: '' })

const toggleView = () => {
  isLogin.value = !isLogin.value
}

const handleLogin = async() => {
  isLoggingIn.value = true; // Start loading
  try {
    await login(loginInfo.value)
    router.push('/purchase-tickets')
  } catch (e) {
    console.warn(e)
    // Update your UI with the error message
  } finally {
    isLoggingIn.value = false; // End loading
  }
}

const handleRegister = async() => {
  isLoggingIn.value = true; // Start loading
  try {
    await register({ username: registerInfo.value.email, email: registerInfo.value.email, password: registerInfo.value.password})
    router.push('/purchase-tickets')
  } catch (e) {
    console.warn(e)
    // Update your UI with the error message
  } finally {
    isLoggingIn.value = false; // End loading
  }
}
</script>
<style scoped>
</style>