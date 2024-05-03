<template>
        <div class="mb-4">
        <h2 class="font-bold text-lg mb-2">Reset Password</h2>
        <div class="flex flex-col sm:flex-row space-x-0 sm:space-x-2">
          <Password v-model="resetInfo.password" placeholder="Password *" toggle-mask class="mb-3 flex-1" />
          <Password
            v-model="resetInfo.confirmPassword"
            placeholder="Confirm Password *"
            toggle-mask
            class="mb-3 flex-1"
          />
        </div>
        <Button label="Reset" @click="onSubmit" class="mt-4 w-full sm:w-auto" />
          Already have an account? <a href="#" @click="toggleView" class="text-blue-500">Login</a>
       
      </div>
</template>
<script setup lang="ts">
const { resetPassword } = useStrapiAuth()
const router = useRouter()

// get code from url
const code = router.currentRoute.value.query.code as string
const toggleView = () => {
  router.push('/login')
}

const resetInfo = ref({ password: '', confirmPassword: '' })

const onSubmit = async () => {
  try {
    await resetPassword({ code: code, password: resetInfo.value.password, passwordConfirmation: resetInfo.value.confirmPassword })

    router.push('/profile')
  } catch (e) {}
}
</script>
