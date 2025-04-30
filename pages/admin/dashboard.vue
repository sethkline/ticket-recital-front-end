<template>
  <div class="p-6 bg-gray-100">
    <!-- State Toggle (for demo purposes) -->
    <div class="mb-6">
      <Dropdown
        v-model="dashboardState"
        :options="stateOptions"
        optionLabel="label"
        optionValue="value"
        class="w-48"
      />
    </div>

    <!-- Empty State -->
    <div v-if="dashboardState === 'empty'" class="bg-white rounded-lg shadow-sm p-8 text-center">
      <div class="max-w-md mx-auto">
        <h2 class="text-2xl font-bold mb-4">Welcome to ShowFlow!</h2>
        <p class="text-gray-600 mb-8">Let's get started by creating your first recital event</p>

        <div class="space-y-4">
          <Button
            class="w-full p-button-primary"
            @click="createFirstEvent"
          >
            <i class="pi pi-plus-circle mr-2" />
            Create Your First Event
          </Button>

          <div class="text-left bg-gray-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-2">Quick Start Checklist</h3>
            <div class="space-y-2">
              <div
                v-for="(item, index) in quickStartItems"
                :key="index"
                class="flex items-center text-gray-600"
              >
                <div class="w-5 h-5 rounded-full border-2 border-gray-300 mr-3 flex items-center justify-center">
                  {{ index + 1 }}
                </div>
                {{ item }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Event -->
    <div v-if="dashboardState === 'active'" class="space-y-6">
      <Card>
        <template #content>
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold">Spring Recital 2024</h2>
            <Tag severity="success" value="Active" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="(stat, index) in activeEventStats" :key="index" 
                 class="bg-gray-50 p-4 rounded-lg">
              <div class="flex items-center justify-between mb-2">
                <span class="text-gray-600">{{ stat.label }}</span>
                <i :class="stat.icon" class="text-blue-600" />
              </div>
              <div class="text-2xl font-bold">{{ stat.value }}</div>
              <div class="text-sm text-gray-600">{{ stat.subtext }}</div>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Post Event -->
    <div v-if="dashboardState === 'post-event'" class="space-y-6">
      <Card>
        <template #content>
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-xl font-bold">Spring Recital 2024</h2>
              <p class="text-gray-600">Event completed on June 15, 2024</p>
            </div>
            <div class="space-x-3">
              <Button
                class="p-button-outlined"
                @click="useAsTemplate"
              >
                <i class="pi pi-copy mr-2" />
                Use as Template
              </Button>
              <Button
                class="p-button-primary"
                @click="createNewEvent"
              >
                <i class="pi pi-plus-circle mr-2" />
                Create New Event
              </Button>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Event Summary -->
            <div class="bg-gray-50 p-6 rounded-lg">
              <h3 class="font-semibold mb-4">Event Summary</h3>
              <div class="space-y-4">
                <div v-for="(metric, index) in eventSummary" :key="index"
                     class="flex justify-between items-center">
                  <span class="text-gray-600">{{ metric.label }}</span>
                  <span class="font-semibold">{{ metric.value }}</span>
                </div>
              </div>
            </div>

            <!-- Follow-up Actions -->
            <div class="bg-gray-50 p-6 rounded-lg">
              <h3 class="font-semibold mb-4">Follow-up Actions</h3>
              <div class="space-y-3">
                <Button
                  v-for="(action, index) in followUpActions"
                  :key="index"
                  class="w-full p-button-text flex justify-between items-center"
                  @click="handleAction(action.type)"
                >
                  <div class="flex items-center">
                    <i :class="action.icon" class="text-blue-600 mr-3" />
                    <span>{{ action.label }}</span>
                  </div>
                  <i class="pi pi-arrow-right" />
                </Button>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- Planning Ahead Section -->
      <Card class="bg-blue-50">
        <template #content>
          <h3 class="font-semibold mb-4">Planning Ahead</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="(plan, index) in planningItems" :key="index"
                 class="bg-white p-4 rounded-lg">
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-medium">{{ plan.title }}</h4>
                <i :class="plan.icon" class="text-blue-600" />
              </div>
              <p class="text-sm text-gray-600 mb-3">{{ plan.description }}</p>
              <Button 
                class="p-button-text text-blue-600"
                @click="handlePlanningAction(plan.type)"
              >
                {{ plan.actionText }}
                <i class="pi pi-arrow-right ml-2" />
              </Button>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

  definePageMeta({
  middleware: ['authenticated'],
  layout: 'admin',
});

const dashboardState = ref('empty')

const stateOptions = [
  { label: 'Empty State', value: 'empty' },
  { label: 'Active Event', value: 'active' },
  { label: 'Post Event', value: 'post-event' }
]

const quickStartItems = [
  'Add your studio branding',
  'Create your first recital',
  'Set up ticket pricing',
  'Design your seating layout'
]

const activeEventStats = [
  {
    label: 'Ticket Sales',
    icon: 'pi pi-ticket',
    value: '247/300',
    subtext: '82% Sold'
  },
  {
    label: 'Volunteers',
    icon: 'pi pi-users',
    value: '18/20',
    subtext: 'Positions Filled'
  },
  {
    label: 'Website Views',
    icon: 'pi pi-eye',
    value: '1,247',
    subtext: 'Last 7 days'
  }
]

const eventSummary = [
  { label: 'Total Attendance', value: '289 people' },
  { label: 'Ticket Revenue', value: '$8,670' },
  { label: 'Volunteers', value: '20 people' },
  { label: 'Website Views', value: '3,542' }
]

const followUpActions = [
  {
    type: 'thank-volunteers',
    label: 'Send thank you to volunteers',
    icon: 'pi pi-envelope'
  },
  {
    type: 'summer-camp',
    label: 'Promote summer camp registration',
    icon: 'pi pi-calendar'
  },
  {
    type: 'analytics',
    label: 'View detailed analytics',
    icon: 'pi pi-chart-bar'
  }
]

const planningItems = [
  {
    type: 'next-recital',
    title: "Next Year's Recital",
    description: "Use this year's event as a template",
    icon: 'pi pi-clock',
    actionText: 'Start Planning'
  },
  {
    type: 'summer-programs',
    title: 'Summer Programs',
    description: 'Convert recital momentum into registrations',
    icon: 'pi pi-calendar',
    actionText: 'Create Campaign'
  },
  {
    type: 'engagement',
    title: 'Engagement Report',
    description: 'Review detailed event analytics',
    icon: 'pi pi-chart-line',
    actionText: 'View Report'
  }
]

// Methods
const createFirstEvent = () => {
  console.log('Creating first event')
}

const useAsTemplate = () => {
  console.log('Using as template')
}

const createNewEvent = () => {
  console.log('Creating new event')
}

const handleAction = (actionType) => {
  console.log('Handling action:', actionType)
}

const handlePlanningAction = (planType) => {
  console.log('Handling planning action:', planType)
}

</script>

<style scoped>
.p-card {
  @apply shadow-sm;
}

.p-button {
  @apply font-semibold;
}

.p-button-text {
  @apply hover:bg-gray-50;
}
</style>


