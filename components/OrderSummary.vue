<template>
  <Card>
    <template #title>
      <h2>Order Summary</h2>
    </template>

    <template #content>
      <SeatPicker></SeatPicker>
      <div class="pl-4">
        <div v-if="hasDvd" class="font-bold">Selected DVD(s): {{ checkoutStore.selectedDvds }}</div>
        <div v-if="hasDigitalDownload" class="font-bold">Digital Download: {{ checkoutStore.selectedDigitalDownloads }}</div>
        <div class="font-bold">Surcharge: $5</div>
  
        <div class="font-bold text-lg">Total: ${{ checkoutStore.orderTotal.toFixed(2) }}</div>
  
        <h3 class="font-bold mt-4 mb-2">Media Options:</h3>
        <div class="flex flex-col gap-4">
          <!-- DVD Options -->
          <div class="p-3 border rounded-lg">
            <div class="flex items-center justify-between">
              <div>
                <span class="font-bold">DVD Recording</span>
                <p class="text-sm text-gray-600">High-quality DVD of the recital ($30 each)</p>
              </div>
              <div class="flex items-center">
                <Button 
                  icon="pi pi-minus" 
                  @click="removeDVDFromCart"
                  class="p-button-rounded p-button-sm" 
                  :disabled="!hasDvd"
                />
                <span class="mx-2 font-bold">{{ checkoutStore.selectedDvds }}</span>
                <Button 
                  icon="pi pi-plus" 
                  @click="addDVDToCart"
                  class="p-button-rounded p-button-sm"
                />
              </div>
            </div>
          </div>
          
          <!-- Digital Download Options -->
          <div class="p-3 border rounded-lg">
            <div class="flex items-center justify-between">
              <div>
                <span class="font-bold">Digital Download</span>
                <p class="text-sm text-gray-600">Get a link to download the recital ($20)</p>
              </div>
              <div class="flex items-center">
                <Button 
                  icon="pi pi-minus" 
                  @click="removeDigitalFromCart"
                  class="p-button-rounded p-button-sm" 
                  :disabled="!hasDigitalDownload"
                />
                <span class="mx-2 font-bold">{{ checkoutStore.selectedDigitalDownloads }}</span>
                <Button 
                  icon="pi pi-plus" 
                  @click="addDigitalToCart"
                  class="p-button-rounded p-button-sm"
                  :disabled="checkoutStore.selectedDigitalDownloads >= 1" 
                />
              </div>
            </div>
          </div>
          
          <!-- Bundle Option -->
          <div v-if="!hasBundle && !hasDigitalDownload && !hasDvd" class="p-3 border rounded-lg bg-blue-50">
            <div class="flex items-center justify-between">
              <div>
                <span class="font-bold">Bundle Deal</span>
                <p class="text-sm text-gray-600">Get both DVD and Digital Download for $45 (Save $5)</p>
              </div>
              <Button 
                label="Add Bundle" 
                @click="addBundle"
                class="p-button-sm p-button-outlined"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { useCheckoutStore } from '~/stores/checkoutStore';
import SeatPicker from './SeatPicker.vue';

const checkoutStore = useCheckoutStore();

const hasDvd = computed(() => checkoutStore.selectedDvds > 0);
const hasDigitalDownload = computed(() => checkoutStore.selectedDigitalDownloads > 0);
const hasBundle = computed(() => hasDvd.value && hasDigitalDownload.value);

const addDVDToCart = () => {
  checkoutStore.selectedDvds = checkoutStore.selectedDvds + 1;
};

const removeDVDFromCart = () => {
  if (checkoutStore.selectedDvds > 0) {
    checkoutStore.selectedDvds = checkoutStore.selectedDvds - 1;
  }
};

const addDigitalToCart = () => {
  // Limit to 1 digital download per order since it's access to the same content
  if (checkoutStore.selectedDigitalDownloads < 1) {
    checkoutStore.selectedDigitalDownloads = checkoutStore.selectedDigitalDownloads + 1;
  }
};

const removeDigitalFromCart = () => {
  if (checkoutStore.selectedDigitalDownloads > 0) {
    checkoutStore.selectedDigitalDownloads = checkoutStore.selectedDigitalDownloads - 1;
  }
};

const addBundle = () => {
  checkoutStore.selectedDvds = 1;
  checkoutStore.selectedDigitalDownloads = 1;
};
</script>