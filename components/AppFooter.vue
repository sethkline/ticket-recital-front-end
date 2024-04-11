<template>
  <footer class="flex-none py-16">
    <Container class="flex flex-col items-center justify-between md:flex-row">
      <Logo class="h-12 w-auto text-slate-900" />
      <p class="mt-6 text-base text-slate-500 md:mt-0">
        Copyright &copy; {{ currentYear }} Reverence Studios, All rights reserved.
      </p>
    </Container>
  </footer>
</template>

<script setup>

const currentYear = new Date().getFullYear();
</script>