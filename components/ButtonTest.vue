<template>
  <NuxtLink
    v-if="href"
    :to="href"
    :class="buttonClasses"
    v-bind="$attrs"
  >
    <slot></slot>
  </NuxtLink>
  <button
    v-else
    :class="buttonClasses"
    v-bind="$attrs"
  >
    <slot></slot>
  </button>
</template>

<script setup>
defineProps({
  href: String,
  className: String,
});

const buttonClasses = computed(() => [
  'inline-flex justify-center rounded-2xl bg-blue-600 p-4 text-base font-semibold text-white hover:bg-blue-500 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:text-white/70',
  className,
]);
</script>