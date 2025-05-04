<!-- components/SiteAlertBanner.vue -->
<template>
  <div v-if="show" class="site-alert-banner" :class="severityClass">
    <div class="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between flex-wrap">
        <div class="w-0 flex-1 flex items-center">
          <span class="flex p-2 rounded-lg" :class="iconBgClass">
            <i :class="['pi', icon]" class="text-white"></i>
          </span>
          <p class="ml-3 font-medium text-white truncate">
            <span class="md:inline">{{ message }}</span>
          </p>
        </div>
        <div class="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
          <a v-if="actionLink" :href="actionLink" class="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50">
            {{ actionText }}
          </a>
        </div>
        <div class="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
          <button 
            type="button" 
            class="flex p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white"
            @click="closeAlert"
          >
            <i class="pi pi-times text-white"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  severity: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'warning', 'error', 'success'].includes(value)
  },
  message: {
    type: String,
    required: true
  },
  persistent: {
    type: Boolean,
    default: false
  },
  actionText: {
    type: String,
    default: ''
  },
  actionLink: {
    type: String,
    default: ''
  },
  dismissKey: {
    type: String,
    default: 'site-alert-dismissed'
  }
});

const show = ref(true);

const closeAlert = () => {
  show.value = false;
  if (!props.persistent) {
    localStorage.setItem(props.dismissKey, 'true');
  }
};

onMounted(() => {
  if (!props.persistent && localStorage.getItem(props.dismissKey) === 'true') {
    show.value = false;
  }
});

const severityClass = computed(() => {
  switch (props.severity) {
    case 'info': return 'bg-blue-600';
    case 'warning': return 'bg-yellow-600';
    case 'error': return 'bg-red-600';
    case 'success': return 'bg-green-600';
    default: return 'bg-blue-600';
  }
});

const iconBgClass = computed(() => {
  switch (props.severity) {
    case 'info': return 'bg-blue-800';
    case 'warning': return 'bg-yellow-800';
    case 'error': return 'bg-red-800';
    case 'success': return 'bg-green-800';
    default: return 'bg-blue-800';
  }
});

const icon = computed(() => {
  switch (props.severity) {
    case 'info': return 'pi-info-circle';
    case 'warning': return 'pi-exclamation-triangle';
    case 'error': return 'pi-times-circle';
    case 'success': return 'pi-check-circle';
    default: return 'pi-info-circle';
  }
});
</script>

<style scoped>
.site-alert-banner {
  position: relative;
  z-index: 100;
}
</style>