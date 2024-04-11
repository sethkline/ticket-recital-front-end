<template>
  <div :class="['mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', className]" v-bind="$attrs">
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  className: String,
});
</script>