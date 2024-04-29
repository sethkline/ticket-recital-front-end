<template>
  <Card>
    <template #title>
      <h2>Order Summary</h2>
    </template>

    <template #content>
      <SeatPicker></SeatPicker>
      <div class="pl-4">
        <div v-if="hasDvd" class="font-bold">Selected DVD(s): {{ checkoutStore.selectedDvds }}</div>
        <div class="font-bold">Surcharge: $5</div>
  
        <div class="font-bold text-lg">Total: ${{ checkoutStore.orderTotal.toFixed(2) }}</div>
  
        <div class="font-bold py-2">
          <span>*Includes Free Digital Download</span>
          <span v-if="!hasDvd" class="ml-4">Want a physical copy too? Get the DVD for only $30!</span>
        </div>
  
        <div v-if="hasDvd">
          <Button @click="removeDVDFromCart">Remove DVD</Button>
          <span class="ml-2">Quantity: {{ checkoutStore.selectedDvds }}</span>
        </div>
        
        <Button v-else="!hasDvd" @click="addDVDToCart">Add DVD ($30)</Button>

      </div>

    </template>
  </Card>
</template>

<script setup lang="ts">
import { useCheckoutStore } from '~/stores/checkoutStore';
import SeatPicker from './SeatPicker.vue';

const checkoutStore = useCheckoutStore();

const hasDvd = computed(() => checkoutStore.selectedDvds > 0);

const addDVDToCart = () => {
  // Add DVD to cart logic (interact with checkoutStore)
  checkoutStore.selectedDvds = checkoutStore.selectedDvds + 1; 
};

const removeDVDFromCart = () => {
  // Remove DVD from cart logic (interact with checkoutStore)
  if (checkoutStore.selectedDvds > 0) {
    checkoutStore.selectedDvds = checkoutStore.selectedDvds - 1;
  }
};
</script>