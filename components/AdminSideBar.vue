<!-- components/AdminSidebar.vue -->
<template>
  <div class="flex h-screen">
    <aside
      class="bg-gray-800 text-white w-64 space-y-6 p-6 fixed inset-y-0 left-0 transform -translate-x-full md:translate-x-0 md:relative transition-transform duration-300 ease-in-out overflow-y-auto"
      :class="{ 'translate-x-0': sidebarOpen }"
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold">Studio Dashboard</h2>
        <button class="text-white md:hidden" @click="toggleSidebar">
          <i class="pi pi-times"></i>
        </button>
      </div>

      <!-- Menu Sections -->
      <div class="space-y-6">
        <div
          v-for="section in menuData.sections"
          :key="section.title"
          class="mb-4"
        >
          <h5 class="text-sm font-semibold text-gray-400 mb-2 uppercase">
            {{ section.title }}
          </h5>
          <ul class="space-y-1">
            <li v-for="item in section.items" :key="item.label">
              <!-- Menu Item -->
              <div
                v-if="item.submenu"
                class="flex items-center justify-between p-2 rounded-lg hover:bg-gray-700 cursor-pointer"
                :class="{ 'bg-gray-700': isMenuActive(item) }"
                @click="toggleSubmenu(item.label)"
              >
                <div class="flex items-center space-x-2">
                  <i :class="item.icon"></i>
                  <span>{{ item.label }}</span>
                </div>
                <i
                  class="pi pi-chevron-right transition-transform duration-200"
                  :class="{ 'rotate-90': isExpanded(item.label) }"
                ></i>
              </div>

              <!-- Direct Link (no submenu) -->
              <NuxtLink
                v-else
                :to="item.path"
                class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700"
                :class="{ 'bg-blue-600': isActive(item.path) }"
              >
                <i :class="item.icon"></i>
                <span>{{ item.label }}</span>
              </NuxtLink>

              <!-- Submenu -->
              <Transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <ul
                  v-if="item.submenu && isExpanded(item.label)"
                  class="ml-6 mt-1 space-y-1"
                >
                  <li v-for="subitem in item.submenu" :key="subitem.label">
                    <NuxtLink
                      :to="subitem.path"
                      class="block p-2 rounded-lg hover:bg-gray-700"
                      :class="{ 'bg-blue-600': isActive(subitem.path) }"
                    >
                      {{ subitem.label }}
                    </NuxtLink>
                  </li>
                </ul>
              </Transition>
            </li>
          </ul>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 bg-gray-100 p-6 ml-64 md:ml-0">
      <button
        class="bg-blue-500 text-white px-4 py-2 rounded md:hidden"
        @click="toggleSidebar"
      >
        <i class="pi pi-bars"></i>
      </button>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from '#app'
import { useMenuData } from '~/composables/useMenuData'

const route = useRoute()
const menuData = useMenuData()
const sidebarOpen = ref(false)
const expandedMenus = ref<string[]>([])

// Toggle sidebar for mobile
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

// Check if a route is active
const isActive = (path: string): boolean => {
  return route.path === path
}

// Check if a menu item should be expanded
const isMenuActive = (item: any): boolean => {
  if (item.submenu) {
    return item.submenu.some((subitem: any) => isActive(subitem.path))
  }
  return isActive(item.path)
}

// Toggle submenu expansion
const toggleSubmenu = (label: string) => {
  const index = expandedMenus.value.indexOf(label)
  if (index === -1) {
    expandedMenus.value.push(label)
  } else {
    expandedMenus.value.splice(index, 1)
  }
}

// Check if a submenu is expanded
const isExpanded = (label: string): boolean => {
  return expandedMenus.value.includes(label)
}

// Auto-expand section based on current route
const expandActiveSection = () => {
  menuData.sections.forEach(section => {
    section.items.forEach(item => {
      if (item.submenu) {
        const isActive = item.submenu.some(
          (subitem: any) => route.path.startsWith(subitem.path)
        )
        if (isActive && !expandedMenus.value.includes(item.label)) {
          expandedMenus.value.push(item.label)
        }
      }
    })
  })
}

// Watch for route changes
watch(
  () => route.path,
  () => {
    expandActiveSection()
  }
)

// Initial setup
onMounted(() => {
  expandActiveSection()
})
</script>

<style scoped>
.router-link-active {
  @apply bg-blue-600;
}

.rotate-90 {
  transform: rotate(90deg);
}
</style>