<template>
  <div class="profile-container">
    <!-- <h1 class="text-3xl font-bold print:hidden">My Profile</h1> -->
    <!-- <UserProfile :user="user" /> -->
    <!-- <Fieldset legend="My Tickets" :toggleable="true">
      <ShowUsersTickets />
    </Fieldset> -->
  </div>
    <ShowUsersTicketsNoAuth />
</template>

<script setup lang="ts">
import ShowUsersTickets from '../components/ShowUsersTickets.vue';

definePageMeta({

});

const user = ref(null);
const tickets = ref([]);
const nextEvent = ref(null);
const eventLocation = ref({});
const userSeats = ref([]);

// onMounted(() => {
//   // Fetch user data, tickets, event info, etc.
// });
</script>

<style scoped></style>
