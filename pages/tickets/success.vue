<template>
  <div>
    <div class="p-4">
      <h1 class="text-3xl font-bold">Payment Successful</h1>
      <p>Thank you for your payment here are your tickets.</p>
      <p>You can also download these from your profile</p>
    </div>

    <ShowUsersTickets/>
    <div class="w-full text-center">
      <Button class="size=large" link>
        <NuxtLink to="/profile">
          Go to My Profile
        </NuxtLink>
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import ShowUsersTickets from '../../components/ShowUsersTickets.vue';


definePageMeta({
  middleware: ['authenticated'],
});

</script>

<style scoped>

</style>