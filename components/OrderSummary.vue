<template>
  <Card>
    <template #title>
      <h2>Order Summary</h2>
    </template>

    <template #content>

      <SeatPicker></SeatPicker>
    <!-- <div class="p-field">
      <label>Subtotal (Morning Show)</label>
      <div>{{ checkoutStore.selectedEventDetailsDetails.morningShow.price }}</div>
    </div>

    <div class="p-field">
      <label>Subtotal (Afternoon Show)</label>
      <div>{{ checkoutStore.selectedEventDetailsDetails.afternoonShow.price }}</div>
    </div>

    <div class="p-field">
      <label>Tax Estimate</label>
      <div>{{ (checkoutStore.selectedEventDetailsDetails.morningShow.price + checkoutStore.selectedEventDetailsDetails.afternoonShow.price) * checkoutStore.selectedEventDetailsDetails.taxRate }}</div>
    </div> -->

    <div class="p-field">
      <label>Free Digital Download Included</label>
      <div>Yes</div>
    </div>

    <!-- <div class="p-field p-text-bold">
      <label>Order Total</label>
      <div>{{ checkoutStore.orderTotal }}</div>
    </div> -->
  </template>

    <template #footer>
    <div class="p-field">
      <p>Tickets will be sent to your registered email and can also be accessed from your account.</p>
    </div>
    </template>
  </Card>
</template>


<script setup lang="ts">
import { useCheckoutStore } from '~/stores/checkoutStore';
import SeatPicker from './SeatPicker.vue';
const checkoutStore = useCheckoutStore();
</script>
