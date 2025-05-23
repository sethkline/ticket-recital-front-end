<template>
  <div>
    <h1 class="text-4xl font-bold py-4">Media Orders</h1>
    
    <div class="p-4">
      <TabView>
        <TabPanel header="DVD Orders">
          <div class="mb-4">
            <div class="flex justify-between items-center">
              <h2 class="text-2xl font-bold">DVD Orders</h2>
              <div class="flex space-x-2">
                <Button label="Export CSV" icon="pi pi-file-excel" @click="exportDvdOrdersCsv" />
                <Button label="Send Status Emails" icon="pi pi-envelope" @click="confirmSendDvdEmails" severity="secondary" />
              </div>
            </div>
            <DataTable 
              v-model:selection="selectedDvdOrders"
              :value="dvdOrders" 
              :paginator="true" 
              :rows="10"
              :rowsPerPageOptions="[5, 10, 25, 50]"
              v-model:filters="filters"
              filterDisplay="row"
              dataKey="id"
              :loading="loading"
              class="p-datatable-sm mt-4"
              :rowClass="getRowStyleClass"
            >
              <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
              <Column field="id" header="Order ID" sortable></Column>
              <Column field="name" header="Customer Name" sortable :showFilterMenu="false">
                <template #filter="{ filterModel, filterCallback }">
                  <InputText v-model="filterModel.value" @input="filterCallback()" placeholder="Search by name" class="p-column-filter" />
                </template>
              </Column>
              <Column field="email" header="Email" sortable :showFilterMenu="false">
                <template #filter="{ filterModel, filterCallback }">
                  <InputText v-model="filterModel.value" @input="filterCallback()" placeholder="Search by email" class="p-column-filter" />
                </template>
              </Column>
              <Column field="orderDate" header="Order Date" sortable>
                <template #body="slotProps">
                  {{ formatDate(slotProps.data.orderDate) }}
                </template>
              </Column>
              <Column field="dvdCount" header="DVD Count" sortable></Column>
              <Column field="status" header="Status" sortable>
                <template #body="slotProps">
                  <Tag :severity="getStatusSeverity(slotProps.data.status)" :value="slotProps.data.status" />
                </template>
                <template #filter="{ filterModel, filterCallback }">
                  <Dropdown 
                    v-model="filterModel.value" 
                    @change="filterCallback()"
                    :options="statusOptions" 
                    placeholder="Select Status"
                    class="p-column-filter" 
                    showClear 
                  />
                </template>
              </Column>
              <Column header="Actions">
                <template #body="slotProps">
                  <div class="flex">
                    <Button 
                      icon="pi pi-check-circle" 
                      @click="updateOrderStatus(slotProps.data, 'fulfilled')" 
                      class="p-button-sm p-button-success mr-2" 
                      v-tooltip.top="'Mark as Fulfilled'"
                      :disabled="slotProps.data.status === 'fulfilled'"
                    />
                    <Button 
                      icon="pi pi-clock" 
                      @click="updateOrderStatus(slotProps.data, 'processing')" 
                      class="p-button-sm p-button-warning mr-2" 
                      v-tooltip.top="'Mark as Processing'"
                      :disabled="slotProps.data.status === 'processing'"
                    />
                    <Button 
                      icon="pi pi-envelope" 
                      @click="openEmailDialog(slotProps.data)" 
                      class="p-button-sm p-button-info" 
                      v-tooltip.top="'Send Email'"
                    />
                  </div>
                </template>
              </Column>
            </DataTable>
          </div>
        </TabPanel>
        
        <TabPanel header="Digital Downloads">
          <div class="mb-4">
            <div class="flex justify-between items-center">
              <h2 class="text-2xl font-bold">Digital Downloads</h2>
              <div class="flex space-x-2">
                <Button label="Export CSV" icon="pi pi-file-excel" @click="exportDigitalOrdersCsv" />
                <Button label="Generate Access Codes" icon="pi pi-key" @click="generateAccessCodes" severity="secondary" />
                <Button label="Send Access Emails" icon="pi pi-envelope" @click="confirmSendDigitalEmails" severity="secondary" />
              </div>
            </div>
            <DataTable 
              v-model:selection="selectedDigitalOrders"
              :value="digitalOrders" 
              :paginator="true" 
              :rows="10"
              :rowsPerPageOptions="[5, 10, 25, 50]"
              v-model:filters="digitalFilters"
              filterDisplay="row"
              dataKey="id"
              :loading="loading"
              class="p-datatable-sm mt-4"
              :rowClass="getRowStyleClass"
            >
              <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
              <Column field="id" header="Order ID" sortable></Column>
              <Column field="name" header="Customer Name" sortable :showFilterMenu="false">
                <template #filter="{ filterModel, filterCallback }">
                  <InputText v-model="filterModel.value" @input="filterCallback()" placeholder="Search by name" class="p-column-filter" />
                </template>
              </Column>
              <Column field="email" header="Email" sortable :showFilterMenu="false">
                <template #filter="{ filterModel, filterCallback }">
                  <InputText v-model="filterModel.value" @input="filterCallback()" placeholder="Search by email" class="p-column-filter" />
                </template>
              </Column>
              <Column field="orderDate" header="Order Date" sortable>
                <template #body="slotProps">
                  {{ formatDate(slotProps.data.orderDate) }}
                </template>
              </Column>
              <Column field="accessCode" header="Access Code">
                <template #body="slotProps">
                  <div v-if="slotProps.data.accessCode">
                    {{ slotProps.data.accessCode }}
                    <Button 
                      icon="pi pi-copy" 
                      @click="copyAccessCode(slotProps.data.accessCode)" 
                      class="p-button-text p-button-sm" 
                      v-tooltip.top="'Copy to clipboard'"
                    />
                  </div>
                  <div v-else class="text-gray-500">Not generated</div>
                </template>
              </Column>
              <Column field="status" header="Status" sortable>
                <template #body="slotProps">
                  <Tag :severity="getStatusSeverity(slotProps.data.status)" :value="slotProps.data.status" />
                </template>
                <template #filter="{ filterModel, filterCallback }">
                  <Dropdown 
                    v-model="filterModel.value" 
                    @change="filterCallback()"
                    :options="statusOptions" 
                    placeholder="Select Status"
                    class="p-column-filter" 
                    showClear 
                  />
                </template>
              </Column>
              <Column header="Actions">
                <template #body="slotProps">
                  <div class="flex">
                    <Button 
                      icon="pi pi-check-circle" 
                      @click="updateOrderStatus(slotProps.data, 'fulfilled')" 
                      class="p-button-sm p-button-success mr-2" 
                      v-tooltip.top="'Mark as Fulfilled'"
                      :disabled="slotProps.data.status === 'fulfilled'"
                    />
                    <Button 
                      icon="pi pi-key" 
                      @click="generateSingleAccessCode(slotProps.data)" 
                      class="p-button-sm p-button-warning mr-2" 
                      v-tooltip.top="'Generate Access Code'"
                      :disabled="slotProps.data.accessCode !== null"
                    />
                    <Button 
                      icon="pi pi-envelope" 
                      @click="openEmailDialog(slotProps.data, 'digital')" 
                      class="p-button-sm p-button-info" 
                      v-tooltip.top="'Send Email'"
                    />
                  </div>
                </template>
              </Column>
            </DataTable>
          </div>
        </TabPanel>
      </TabView>
    </div>
    
    <!-- Email Dialog -->
    <Dialog v-model:visible="emailDialog" header="Send Status Email" :style="{ width: '500px' }">
      <div class="p-fluid">
        <div class="field">
          <label for="emailSubject">Subject</label>
          <InputText id="emailSubject" v-model="emailDetails.subject" />
        </div>
        <div class="field">
          <label for="emailMessage">Message</label>
          <Textarea id="emailMessage" v-model="emailDetails.message" rows="5" />
        </div>
        <div v-if="emailDetails.type === 'digital' && emailDetails.order?.accessCode" class="field">
          <Checkbox v-model="emailDetails.includeAccessCode" :binary="true" id="includeAccessCode" />
          <label for="includeAccessCode" class="ml-2">Include access code in email</label>
        </div>
      </div>
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" @click="closeEmailDialog" class="p-button-text" />
        <Button label="Send" icon="pi pi-envelope" @click="sendStatusEmail" />
      </template>
    </Dialog>
    
    <!-- Bulk Email Confirmation Dialog -->
    <Dialog v-model:visible="bulkEmailDialog" header="Send Bulk Emails" :style="{ width: '500px' }">
      <div class="p-fluid">
        <div class="field">
          <label for="bulkEmailSubject">Subject</label>
          <InputText id="bulkEmailSubject" v-model="bulkEmailDetails.subject" />
        </div>
        <div class="field">
          <label for="bulkEmailMessage">Message</label>
          <Textarea id="bulkEmailMessage" v-model="bulkEmailDetails.message" rows="5" />
        </div>
        <div class="field">
          <Message severity="info">
            <span>This will send emails to {{ bulkEmailDetails.targetOrders === 'dvd' ? 'all DVD orders' : 'all digital download orders' }} with status "{{ bulkEmailDetails.targetStatus || 'any' }}".</span>
          </Message>
        </div>
      </div>
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" @click="closeBulkEmailDialog" class="p-button-text" />
        <Button label="Send" icon="pi pi-envelope" @click="sendBulkEmails" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const client = useStrapiClient();
const loading = ref(false);

// Data tables
const dvdOrders = ref([]);
const digitalOrders = ref([]);
const selectedDvdOrders = ref([]);
const selectedDigitalOrders = ref([]);

// Filters
const filters = ref({
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  email: { value: null, matchMode: FilterMatchMode.CONTAINS },
  status: { value: null, matchMode: FilterMatchMode.EQUALS }
});

const digitalFilters = ref({
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  email: { value: null, matchMode: FilterMatchMode.CONTAINS },
  status: { value: null, matchMode: FilterMatchMode.EQUALS }
});

const statusOptions = ['pending', 'processing', 'fulfilled', 'cancelled'];

// Email dialog
const emailDialog = ref(false);
const emailDetails = reactive({
  order: null,
  subject: '',
  message: '',
  type: 'dvd', // or 'digital'
  includeAccessCode: true
});

// Bulk email dialog
const bulkEmailDialog = ref(false);
const bulkEmailDetails = reactive({
  targetOrders: 'dvd', // or 'digital'
  targetStatus: null, // if null, all statuses
  subject: '',
  message: ''
});

// Fetch data
onMounted(async () => {
  await fetchOrders();
});

const fetchOrders = async () => {
  loading.value = true;
  try {
    // Fetch media orders from the API
    const response = await client('/orders/media-orders', {
      method: 'GET',
    });
    
    processOrdersData(response);
  } catch (error) {
    console.error('Error fetching orders:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch orders', life: 3000 });
  } finally {
    loading.value = false;
  }
};

const processOrdersData = (data) => {
  // Format the data for display
  dvdOrders.value = (data.dvdOrders || []).map(order => ({
    ...order,
    status: order.status || 'pending' // Ensure status is always defined
  }));
  
  digitalOrders.value = (data.digitalOrders || []).map(order => ({
    ...order,
    status: order.status || 'pending' // Ensure status is always defined
  }));
};

// Format date
const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Get status severity for PrimeVue Tag component
const getStatusSeverity = (status) => {
  switch (status?.toLowerCase()) {
    case 'fulfilled':
      return 'success';
    case 'processing':
      return 'warning';
    case 'cancelled':
      return 'danger';
    case 'pending':
    default:
      return 'info';
  }
};

// Row style class based on status
const getRowStyleClass = (data) => {
  const status = data.status?.toLowerCase();
  return {
    'bg-green-50': status === 'fulfilled',
    'bg-yellow-50': status === 'processing',
    'bg-red-50': status === 'cancelled'
  };
};

// Update order status
const updateOrderStatus = async (order, newStatus) => {
  try {
    loading.value = true;
    
    // Update order status via API
    await client(`/orders/${order.id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ 
        status: newStatus,
        notes: `Status updated to ${newStatus} on ${new Date().toISOString()}` 
      }),
    });
    
    // Refresh the orders data
    await fetchOrders();
    
    toast.add({ 
      severity: 'success', 
      summary: 'Status Updated', 
      detail: `Order #${order.id} status changed to ${newStatus}`, 
      life: 3000 
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'Failed to update order status', 
      life: 3000 
    });
  } finally {
    loading.value = false;
  }
};

// Generate access codes for digital downloads
const generateAccessCodes = async () => {
  try {
    loading.value = true;
    
    // Find orders without access codes
    const ordersWithoutCodes = selectedDigitalOrders.value.filter(order => !order.accessCode);
    
    if (ordersWithoutCodes.length === 0) {
      toast.add({
        severity: 'info',
        summary: 'Info',
        detail: 'All selected orders already have access codes',
        life: 3000
      });
      loading.value = false;
      return;
    }
    
    // Generate access codes via API
    const response = await client('/orders/generate-bulk-access-codes', {
      method: 'POST',
    });
    
    // Refresh orders data
    await fetchOrders();
    
    toast.add({
      severity: 'success',
      summary: 'Access Codes Generated',
      detail: `Generated ${response.count} access codes`,
      life: 3000
    });
  } catch (error) {
    console.error('Error generating access codes:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to generate access codes',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

// Generate a single access code
const generateSingleAccessCode = async (order) => {
  try {
    loading.value = true;
    
    // Generate code via API
    const response = await client(`/orders/${order.id}/generate-access-code`, {
      method: 'POST',
    });
    
    // Refresh orders data
    await fetchOrders();
    
    toast.add({
      severity: 'success',
      summary: 'Access Code Generated',
      detail: `Access code ${response.accessCode} generated for order #${order.id}`,
      life: 3000
    });
  } catch (error) {
    console.error('Error generating access code:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to generate access code',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

// Copy access code to clipboard
const copyAccessCode = (code) => {
  navigator.clipboard.writeText(code).then(
    () => {
      toast.add({
        severity: 'success',
        summary: 'Copied',
        detail: 'Access code copied to clipboard',
        life: 3000
      });
    },
    () => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to copy access code',
        life: 3000
      });
    }
  );
};

// Export CSV functions
const exportDvdOrdersCsv = async () => {
  try {
    // Request CSV export from API
    const response = await client('/orders/export-csv?type=dvd', {
      method: 'GET',
      responseType: 'blob'
    });
    
    // Create download link for CSV
    const blob = new Blob([response], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dvd-orders.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    
    toast.add({
      severity: 'success',
      summary: 'Export Complete',
      detail: 'DVD orders CSV has been downloaded',
      life: 3000
    });
  } catch (error) {
    console.error('Error exporting CSV:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to export DVD orders CSV',
      life: 3000
    });
  }
};

const exportDigitalOrdersCsv = async () => {
  try {
    // Request CSV export from API
    const response = await client('/orders/export-csv?type=digital', {
      method: 'GET',
      responseType: 'blob'
    });
    
    // Create download link for CSV
    const blob = new Blob([response], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'digital-orders.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    
    toast.add({
      severity: 'success',
      summary: 'Export Complete',
      detail: 'Digital orders CSV has been downloaded',
      life: 3000
    });
  } catch (error) {
    console.error('Error exporting CSV:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to export digital orders CSV',
      life: 3000
    });
  }
};

// Email functions
const openEmailDialog = (order, type = 'dvd') => {
  emailDetails.order = order;
  emailDetails.type = type;
  emailDetails.subject = `Your ${type === 'dvd' ? 'DVD' : 'Digital Download'} Order Status`;
  emailDetails.message = `Dear ${order.name},\n\nYour ${type === 'dvd' ? 'DVD' : 'Digital Download'} order (#${order.id}) status is: ${order.status}.\n\n`;
  
  if (type === 'digital' && order.accessCode) {
    emailDetails.includeAccessCode = true;
    emailDetails.message += `Your access code is: ${order.accessCode}\n\nYou can use this code to access your digital download at our website: https://recital.reverence.dance/watch-recital\n\n`;
  }
  
  emailDetails.message += 'Thank you for your order!\n\nReverence Studios';
  emailDialog.value = true;
};

const closeEmailDialog = () => {
  emailDialog.value = false;
};

const sendStatusEmail = async () => {
  try {
    loading.value = true;
    
    // Send email via API
    await client('/orders/send-status-email', {
      method: 'POST',
      body: JSON.stringify({
        orderId: emailDetails.order.id,
        subject: emailDetails.subject,
        message: emailDetails.message,
        includeAccessCode: emailDetails.includeAccessCode
      }),
    });
    
    toast.add({
      severity: 'success',
      summary: 'Email Sent',
      detail: `Status email sent to ${emailDetails.order.email}`,
      life: 3000
    });
    
    closeEmailDialog();
  } catch (error) {
    console.error('Error sending status email:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to send status email',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

// Bulk email functions
const confirmSendDvdEmails = () => {
  bulkEmailDetails.targetOrders = 'dvd';
  bulkEmailDetails.targetStatus = null;
  bulkEmailDetails.subject = 'Your DVD Order Status';
  bulkEmailDetails.message = 'Dear customer,\n\nWe wanted to update you on the status of your DVD order from Reverence Studios.\n\nYour order is being processed and will be fulfilled shortly.\n\nThank you for your order!\n\nReverence Studios';
  bulkEmailDialog.value = true;
};

const confirmSendDigitalEmails = () => {
  bulkEmailDetails.targetOrders = 'digital';
  bulkEmailDetails.targetStatus = null;
  bulkEmailDetails.subject = 'Your Digital Download Access';
  bulkEmailDetails.message = 'Dear customer,\n\nYour digital download for the Reverence Studios Recital is now available.\n\nYou can access your download using the unique access code that has been assigned to your order at: https://recital.reverence.dance/watch-recital\n\nThank you for your purchase!\n\nReverence Studios';
  bulkEmailDialog.value = true;
};

const closeBulkEmailDialog = () => {
  bulkEmailDialog.value = false;
};

const sendBulkEmails = async () => {
  try {
    loading.value = true;
    
    // Send bulk emails via API
    const response = await client('/orders/send-bulk-emails', {
      method: 'POST',
      body: JSON.stringify({
        targetOrders: bulkEmailDetails.targetOrders,
        targetStatus: bulkEmailDetails.targetStatus,
        subject: bulkEmailDetails.subject,
        message: bulkEmailDetails.message
      }),
    });
    
    const targetType = bulkEmailDetails.targetOrders === 'dvd' ? 'DVD' : 'Digital Download';
    toast.add({
      severity: 'success',
      summary: 'Emails Sent',
      detail: `${response.count} emails sent to ${targetType} orders`,
      life: 3000
    });
    
    closeBulkEmailDialog();
  } catch (error) {
    console.error('Error sending bulk emails:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to send bulk emails',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

definePageMeta({
  middleware: ['admin'],
});
</script>

<style scoped>
/* Add any component-specific styles here */
.p-datatable-sm .p-datatable-thead > tr > th {
  padding: 0.5rem 0.5rem;
}

.p-datatable-sm .p-datatable-tbody > tr > td {
  padding: 0.5rem 0.5rem;
}

.p-column-filter {
  width: 100%;
}
</style>