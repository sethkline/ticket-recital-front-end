<template>
  <div>
    <EventInfo />
    <div class="flex justify-center items-center py-4"> <span class="font-bold px-2"> Already Purchased? </span><Button @click="$router.push('/profile')"> View Tickets</Button></div>
  </div>
</template>