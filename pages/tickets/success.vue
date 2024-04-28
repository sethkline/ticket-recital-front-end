<template>
  <div>
    <div class="p-4">
      <h1 class="text-3xl font-bold">Payment Successful</h1>
      <p>Thank you for your payment here are your tickets.</p>
      <p>You can also download these from your profile</p>
    </div>

    <ShowUsersTickets/>
    <div class="w-full text-center justify-center flex gap 2">
      <Button class="size=large" link>
        <NuxtLink to="/purchase-tickets">
          Buy More Tickets
        </NuxtLink>
      </Button>
      <Button class="size=large">
        <NuxtLink to="/profile">
          Go to My profile
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