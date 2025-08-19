<template>
  <div class="p-6 max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Reverence Studios Recital Recording</h1>
    
    <!-- Access Code Entry -->
    <div v-if="!accessGranted" class="bg-white shadow-md rounded-lg p-6">
      <h2 class="text-xl font-semibold mb-4">Enter Your Access Code</h2>
      <p class="mb-4">Please enter the access code you received with your digital download purchase.</p>
      
      <div class="flex space-x-2">
        <InputText 
          v-model="accessCode" 
          placeholder="DVL-2025-XXXX" 
          class="w-full" 
          @keyup.enter="validateCode" 
        />
        <Button @click="validateCode" :loading="loading">
          <i class="pi pi-unlock mr-2"></i>
          Access Videos
        </Button>
      </div>
      
      <Message v-if="errorMessage" severity="error" :closable="false" class="mt-3">
        {{ errorMessage }}
      </Message>
    </div>
    
    <!-- Video Access Granted -->
    <div v-else>
      <!-- Download Options Selector -->
      <Card class="mb-6">
        <template #title>
          <h2 class="text-xl font-semibold">Select Download Option</h2>
        </template>
        <template #content>
          <div class="flex flex-wrap gap-4">
            <Button 
              label="Full Recital" 
              icon="pi pi-video" 
              @click="loadVideos('full')"
              :outlined="currentView !== 'full'"
              :loading="loading"
            />
            <Button 
              label="Individual Dances" 
              icon="pi pi-list" 
              @click="loadVideos('individual')"
              :outlined="currentView !== 'individual'"
              :loading="loading"
            />
            <Button 
              label="All Videos" 
              icon="pi pi-folder" 
              @click="loadVideos('both')"
              :outlined="currentView !== 'both'"
              :loading="loading"
            />
          </div>
          
          <Message severity="info" :closable="false" class="mt-4">
            <i class="pi pi-info-circle mr-2"></i>
            Download links expire after 24 hours. You can generate new links anytime with your access code.
          </Message>
        </template>
      </Card>

      <!-- Full Recital Download with Quality Options -->
      <Card v-if="fullRecitalVideos && (currentView === 'full' || currentView === 'both')" class="mb-6">
        <template #title>
          <h3 class="text-lg font-semibold">
            <i class="pi pi-video mr-2"></i>
            Full Recital Recording
          </h3>
        </template>
        <template #content>
          <!-- Quality Selection -->
          <div class="mb-4 p-4 bg-gray-50 rounded-lg">
            <h4 class="font-semibold mb-3">Select Quality:</h4>
            <div class="flex flex-wrap gap-3">
              <Button 
                label="High Quality (1080p)" 
                icon="pi pi-star" 
                @click="selectedQuality = 'hq'"
                :outlined="selectedQuality !== 'hq'"
                severity="success"
              />
              <Button 
                label="Standard Quality (720p)" 
                icon="pi pi-play" 
                @click="selectedQuality = 'standard'"
                :outlined="selectedQuality !== 'standard'"
              />
            </div>
            <div v-if="selectedQuality && selectedFullRecitalVideo" class="mt-3 text-sm text-gray-600">
              <i class="pi pi-info-circle mr-1"></i>
              {{ selectedQuality === 'hq' ? 'Best quality' : 'Good quality' }}, file size: {{ selectedFullRecitalVideo.fileSize }}
            </div>
          </div>

          <!-- Selected Video Details -->
          <div v-if="selectedFullRecitalVideo" class="border-t pt-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <span class="text-gray-600">Duration:</span>
                <span class="ml-2 font-semibold">{{ selectedFullRecitalVideo.duration }}</span>
              </div>
              <div>
                <span class="text-gray-600">File Size:</span>
                <span class="ml-2 font-semibold">{{ selectedFullRecitalVideo.fileSize }}</span>
              </div>
              <div>
                <span class="text-gray-600">Quality:</span>
                <span class="ml-2 font-semibold">{{ selectedFullRecitalVideo.quality }}</span>
              </div>
            </div>
            
            <div class="flex gap-3">
              <Button 
                label="Download Full Recital" 
                icon="pi pi-download" 
                @click="downloadVideo(selectedFullRecitalVideo)"
                class="p-button-success"
              />
              <Button 
                label="Copy Link" 
                icon="pi pi-copy" 
                @click="copyDownloadLink(selectedFullRecitalVideo)"
                class="p-button-secondary"
              />
            </div>
            
            <div class="mt-3 text-sm text-gray-500">
              <i class="pi pi-clock mr-1"></i>
              Link expires in {{ formatExpiryTime() }}
            </div>
          </div>
          
          <div v-else class="text-center py-4 text-gray-500">
            <i class="pi pi-arrow-up mr-2"></i>
            Please select a quality option above
          </div>
        </template>
      </Card>

      <!-- Individual Dances -->
      <Card v-if="individualDances.length > 0 && (currentView === 'individual' || currentView === 'both')">
        <template #title>
          <h3 class="text-lg font-semibold">
            <i class="pi pi-list mr-2"></i>
            Individual Dance Performances ({{ individualDances.length }} videos)
          </h3>
        </template>
        <template #content>
          <!-- Search/Filter -->
          <div class="mb-4">
            <span class="p-input-icon-left w-full">
              <i class="pi pi-search" />
              <InputText 
                v-model="searchQuery" 
                placeholder="Search dances by title or performers..." 
                class="w-full"
              />
            </span>
          </div>

          <!-- Dance List -->
          <DataTable 
            :value="filteredDances" 
            :paginator="true" 
            :rows="10"
            :rowsPerPageOptions="[10, 20, 40]"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} dances"
            class="p-datatable-sm"
          >
            <Column field="order" header="#" style="width: 5%"></Column>
            <Column field="category" header="Category" style="width: 20%"></Column>
            <Column field="title" header="Dance Title" style="width: 30%"></Column>
            <Column field="performers" header="Performers" style="width: 20%"></Column>
            <Column header="Actions" style="width: 25%">
              <template #body="slotProps">
                <div class="flex gap-2">
                  <Button 
                    icon="pi pi-download" 
                    class="p-button-sm p-button-success"
                    @click="downloadVideo(slotProps.data)"
                    v-tooltip.top="'Download'"
                  />
                  <Button 
                    icon="pi pi-copy" 
                    class="p-button-sm p-button-secondary"
                    @click="copyDownloadLink(slotProps.data)"
                    v-tooltip.top="'Copy Link'"
                  />
                </div>
              </template>
            </Column>
          </DataTable>

          <!-- Bulk Download Options -->
          <div class="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 class="font-semibold mb-3">Bulk Download Options</h4>
            <div class="flex flex-wrap gap-3">
              <Button 
                label="Download All Dances" 
                icon="pi pi-download" 
                @click="downloadAllDances"
                class="p-button-success"
                :disabled="downloadingAll"
                :loading="downloadingAll"
              />
              <Button 
                label="Generate Download List" 
                icon="pi pi-file-export" 
                @click="exportDownloadList"
                class="p-button-secondary"
              />
            </div>
            <ProgressBar 
              v-if="downloadingAll" 
              :value="downloadProgress" 
              class="mt-3"
            >
              {{ downloadProgressText }}
            </ProgressBar>
          </div>
        </template>
      </Card>

      <!-- Important Notes -->
      <Card class="mt-6">
        <template #title>
          <h3 class="font-semibold">Important Information</h3>
        </template>
        <template #content>
          <ul class="list-disc pl-5 space-y-2">
            <li>Download links expire after 24 hours for security</li>
            <li>You can regenerate links anytime using your access code</li>
            <li>Videos are for personal use only - please do not share</li>
            <li>Your access code remains valid until December 31, 2025</li>
            <li>For technical support: <a href="mailto:support@reverencestudios.com" class="text-blue-600 hover:underline">support@reverencestudios.com</a></li>
          </ul>
          
          <div class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p class="text-sm">
              <i class="pi pi-exclamation-triangle text-yellow-600 mr-2"></i>
              <strong>Tip:</strong> For best download speed, use a wired internet connection and avoid peak hours (6-9 PM).
            </p>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

// State
const accessCode = ref('');
const errorMessage = ref('');
const loading = ref(false);
const accessGranted = ref(false);
const currentView = ref(''); // 'full', 'individual', or 'both'

// Video data
const fullRecitalVideos = ref(null);
const individualDances = ref([]);
const expiresAt = ref(null);
const selectedQuality = ref(''); // 'hq' or 'standard'

// Search and filter
const searchQuery = ref('');

// Computed for selected full recital video
const selectedFullRecitalVideo = computed(() => {
  if (!fullRecitalVideos.value || !selectedQuality.value) return null;
  
  if (selectedQuality.value === 'hq') {
    return fullRecitalVideos.value.highQuality;
  } else {
    return fullRecitalVideos.value.standardQuality;
  }
});

// Bulk download
const downloadingAll = ref(false);
const downloadProgress = ref(0);
const downloadProgressText = ref('');

// Computed
const filteredDances = computed(() => {
  if (!searchQuery.value) return individualDances.value;
  
  const query = searchQuery.value.toLowerCase();
  return individualDances.value.filter(dance => 
    dance.title.toLowerCase().includes(query) ||
    dance.performers.toLowerCase().includes(query)
  );
});

// Methods
const validateCode = async () => {
  if (!accessCode.value) {
    errorMessage.value = 'Please enter an access code';
    return;
  }
  
  loading.value = true;
  errorMessage.value = '';
  
  try {
    const response = await $fetch('/api/orders/validate-access-code', {
      method: 'POST',
      body: { accessCode: accessCode.value },
      baseURL: 'http://localhost:1337'
    });
    
    if (response.valid) {
      accessGranted.value = true;
      
      // Store in localStorage
      localStorage.setItem('recitalAccessCode', accessCode.value);
      
      toast.add({ 
        severity: 'success', 
        summary: 'Access Granted', 
        detail: 'Loading your videos...', 
        life: 3000 
      });
      
      // Load default view
      await loadVideos('full');
    } else {
      errorMessage.value = 'Invalid access code. Please check and try again.';
    }
  } catch (error) {
    console.error('Error validating access code:', error);
    errorMessage.value = 'An error occurred. Please try again.';
  } finally {
    loading.value = false;
  }
};

const loadVideos = async (videoType) => {
  loading.value = true;
  currentView.value = videoType;
  
  try {
    const response = await $fetch('/api/orders/get-video-urls', {
      method: 'POST',
      body: { 
        accessCode: accessCode.value,
        videoType: videoType 
      },
      baseURL: 'http://localhost:1337'
    });
    
    if (videoType === 'full' || videoType === 'both') {
      // Handle both quality options for full recital
      if (response.fullRecital) {
        fullRecitalVideos.value = response.fullRecital;
      } else if (response.video) {
        // Fallback for single video response
        fullRecitalVideos.value = {
          highQuality: response.video,
          standardQuality: response.video
        };
      }
      // Auto-select standard quality by default
      selectedQuality.value = 'standard';
    }
    
    if (videoType === 'individual' || videoType === 'both') {
      individualDances.value = videoType === 'both' ? response.individualDances : response.videos;
    }
    
    expiresAt.value = response.expiresAt;
    
    toast.add({ 
      severity: 'success', 
      summary: 'Videos Loaded', 
      detail: 'Your download links are ready', 
      life: 3000 
    });
  } catch (error) {
    console.error('Error loading videos:', error);
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'Failed to load videos. Please try again.', 
      life: 5000 
    });
  } finally {
    loading.value = false;
  }
};

const downloadVideo = (video) => {
  // Create temporary link and trigger download
  const link = document.createElement('a');
  link.href = video.downloadUrl;
  link.download = video.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.mp4';
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  toast.add({ 
    severity: 'info', 
    summary: 'Download Started', 
    detail: `Downloading: ${video.title}`, 
    life: 5000 
  });
};

const copyDownloadLink = async (video) => {
  try {
    await navigator.clipboard.writeText(video.downloadUrl);
    toast.add({ 
      severity: 'success', 
      summary: 'Link Copied', 
      detail: 'Download link copied to clipboard', 
      life: 3000 
    });
  } catch (error) {
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'Failed to copy link', 
      life: 3000 
    });
  }
};

const downloadAllDances = async () => {
  downloadingAll.value = true;
  downloadProgress.value = 0;
  
  const total = individualDances.value.length;
  let completed = 0;
  
  for (const dance of individualDances.value) {
    downloadProgressText.value = `Downloading ${completed + 1} of ${total}: ${dance.title}`;
    
    // Add delay between downloads to avoid overwhelming the browser
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    downloadVideo(dance);
    
    completed++;
    downloadProgress.value = (completed / total) * 100;
  }
  
  downloadingAll.value = false;
  toast.add({ 
    severity: 'success', 
    summary: 'Downloads Complete', 
    detail: `All ${total} dances have been queued for download`, 
    life: 5000 
  });
};

const exportDownloadList = () => {
  const csvContent = [
    ['#', 'Category', 'Title', 'Performers', 'File Size', 'Download Link'],
    ...individualDances.value.map(dance => [
      dance.order,
      dance.category || '',
      dance.title,
      dance.performers,
      dance.fileSize || '',
      dance.downloadUrl
    ])
  ].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'recital_downloads.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
  
  toast.add({ 
    severity: 'success', 
    summary: 'List Exported', 
    detail: 'Download list saved as CSV', 
    life: 3000 
  });
};

const formatExpiryTime = () => {
  if (!expiresAt.value) return 'N/A';
  
  const expiry = new Date(expiresAt.value);
  const now = new Date();
  const hoursLeft = Math.round((expiry - now) / (1000 * 60 * 60));
  
  return `${hoursLeft} hours`;
};

// Check for saved access code on mount
onMounted(() => {
  const savedCode = localStorage.getItem('recitalAccessCode');
  if (savedCode) {
    accessCode.value = savedCode;
    // Only auto-validate if we have a saved code and the user wants to auto-login
    // validateCode();
  }
});
</script>

<style scoped>
.p-datatable-sm .p-datatable-tbody > tr > td {
  padding: 0.5rem;
}
</style>