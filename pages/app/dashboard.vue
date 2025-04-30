<template>
  <div class="grid gap-4 p-4">
    <!-- Header -->
    <div class="col-12 flex justify-content-between align-items-center mb-4">
      <h1 class="text-2xl font-semibold m-0">Dashboard</h1>
      <Button 
        label="Refresh" 
        icon="pi pi-refresh"
        severity="success"
        size="small"
        @click="loadDashboardData"
      />
    </div>

    <!-- Metrics Cards -->
    <div class="col-12">
      <div class="grid gap-4">
        <div class="col-12 md:col-3 p-0">
          <div class="p-4 surface-card border-round">
            <div class="mb-3">
              <span class="text-lg text-700">
                <i class="pi pi-dollar mr-2"></i>
                Total Revenue
              </span>
            </div>
            <div class="text-3xl font-medium">
              ${{ metrics.totalRevenue.toLocaleString() }}
            </div>
          </div>
        </div>
        <div class="col-12 md:col-3 p-0">
          <div class="p-4 surface-card border-round">
            <div class="mb-3">
              <span class="text-lg text-700">
                <i class="pi pi-ticket mr-2"></i>
                Tickets Sold
              </span>
            </div>
            <div class="text-3xl font-medium">
              {{ metrics.ticketsSold }}
            </div>
          </div>
        </div>
        <div class="col-12 md:col-3 p-0">
          <div class="p-4 surface-card border-round">
            <div class="mb-3">
              <span class="text-lg text-700">
                <i class="pi pi-calendar mr-2"></i>
                Upcoming Events
              </span>
            </div>
            <div class="text-3xl font-medium">
              {{ metrics.upcomingEvents }}
            </div>
          </div>
        </div>
        <div class="col-12 md:col-3 p-0">
          <div class="p-4 surface-card border-round">
            <div class="mb-3">
              <span class="text-lg text-700">
                <i class="pi pi-users mr-2"></i>
                Active Volunteers
              </span>
            </div>
            <div class="text-3xl font-medium">
              {{ metrics.activeVolunteers }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upcoming Events -->
    <div class="col-12 lg:col-8 p-0">
      <div class="surface-card border-round p-4">
        <div class="flex justify-content-between align-items-center mb-4">
          <span class="text-xl font-medium">Upcoming Events</span>
          <Button 
            label="View All" 
            link
            severity="success"
            class="p-0"
            @click="router.push('/events')"
          />
        </div>
        <DataTable 
          :value="upcomingEvents" 
          :paginator="true" 
          :rows="5"
          stripedRows
          class="p-datatable-sm"
        >
          <Column field="title" header="Event Name" />
          <Column field="date" header="Date">
            <template #body="{ data }">
              {{ new Date(data.date).toLocaleDateString() }}
            </template>
          </Column>
          <Column field="venue" header="Venue" />
          <Column field="ticketsSold" header="Tickets" style="width: 150px">
            <template #body="{ data }">
              {{ data.ticketsSold }} / {{ data.capacity }}
            </template>
          </Column>
          <Column :columnKey="'actions'" :exportable="false" style="width: 4rem">
            <template #body="{ data }">
              <Button 
                icon="pi pi-external-link" 
                text 
                rounded 
                severity="secondary"
                @click="navigateToEvent(data.id)"
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <!-- Recent Sales -->
    <div class="col-12 lg:col-4 p-0">
      <div class="surface-card border-round p-4">
        <div class="flex justify-content-between align-items-center mb-4">
          <span class="text-xl font-medium">Recent Ticket Sales</span>
          <Button 
            label="View All" 
            link
            severity="success"
            class="p-0"
            @click="router.push('/sales')"
          />
        </div>
        <Timeline :value="recentTicketSales" class="customized-timeline">
          <template #content="{ item }">
            <div class="flex flex-column">
              <span class="font-semibold mb-1">{{ item.event }}</span>
              <span class="text-sm">{{ item.customer }}</span>
              <div class="flex justify-content-between text-sm text-600">
                <span>{{ item.quantity }} tickets</span>
                <span>${{ item.total.toFixed(2) }}</span>
              </div>
            </div>
          </template>
        </Timeline>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Timeline from 'primevue/timeline';

const router = useRouter();

definePageMeta({
  middleware: ['authenticated'],
  layout: 'admin',
});

// Sample data - in real app would come from API
const upcomingEvents = ref([
  { 
    id: 1, 
    title: 'Spring Recital 2024',
    date: '2024-04-15',
    ticketsSold: 245,
    capacity: 300,
    venue: 'Main Theater'
  },
  // More events...
]);

const recentTicketSales = ref([
  {
    id: 1,
    event: 'Spring Recital 2024',
    customer: 'John Smith',
    quantity: 2,
    total: 50.00,
    date: '2024-03-20'
  },
  // More sales...
]);

const metrics = ref({
  totalRevenue: 15750.00,
  ticketsSold: 630,
  upcomingEvents: 5,
  activeVolunteers: 25
});

const toast = useToast();

const loadDashboardData = async () => {
  try {
    // In real app, would fetch data from API
    // await fetch('/api/dashboard-data')...
  } catch (error) {
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'Failed to load dashboard data', 
      life: 3000 
    });
  }
};

const navigateToEvent = (eventId: number) => {
  router.push(`/events/${eventId}`);
};

onMounted(() => {
  loadDashboardData();
});
</script>

<style scoped>
.customized-timeline :deep(.p-timeline-event-content) {
  line-height: 1.5;
}

.customized-timeline :deep(.p-timeline-event-opposite) {
  flex: 0;
  padding: 0 1rem;
}

/* Adjust DataTable styling */
:deep(.p-datatable .p-datatable-header) {
  background: transparent;
  border: none;
  padding: 0;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background: transparent;
  border: none;
  padding: 0.75rem 1rem;
  font-weight: 600;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.75rem 1rem;
  border: none;
}

/* Adjust card spacing */
.surface-card {
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
</style>