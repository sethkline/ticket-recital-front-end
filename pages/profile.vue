<template>
  <div class="profile-container">
    <h1 class="text-3xl font-bold">My Profile</h1>
    <!-- <UserProfile :user="user" /> -->
    <Fieldset legend="My Tickets" :toggleable="true">
      <ShowUsersTickets />
    </Fieldset>
    <!-- <UserTickets :tickets="tickets" /> -->
    <EventCountdown :event="nextEvent" />
    <Fieldset legend="Directions" :toggleable="true">
      <p class="m-0">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum.
      </p>
    </Fieldset>
    <DirectionsMap :location="eventLocation" />
    <Fieldset legend="Auditorium Map" :toggleable="true">
      <p class="m-0">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum.
      </p>
    <!-- <AuditoriumMap :seats="userSeats" /> -->
    </Fieldset>
    <div class="w-full text-center">
      <Button class="size=large" link>
        <NuxtLink to="/purchase-tickets">
          Buy Tickets
        </NuxtLink>
        </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import ShowUsersTickets from '../components/ShowUsersTickets.vue';

definePageMeta({
  middleware: ['authenticated']
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
