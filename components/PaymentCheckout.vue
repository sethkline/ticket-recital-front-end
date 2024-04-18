<template>
  <div class="nes-container with-title is-centered">
    <form @submit.prevent="handleSubmit">
      <Fieldset :disabled="loading" legend="Payment" class="space-y-4">
        <!-- Using FloatLabel for all fields -->
        <FloatLabel class="mb-6">
          <InputText id="name_field" v-model="customer.name" class="w-full lg:w-1/2" />
          <label for="name_field">Name</label>
        </FloatLabel>
        <FloatLabel class="mb-6">
          <InputText id="email_field" type="email" v-model="customer.email" />
          <label for="email_field">Email</label>
        </FloatLabel>
        <FloatLabel class="mb-6">
          <InputText id="address_field" v-model="customer.address" />
          <label for="address_field">Address</label>
        </FloatLabel>
        <FloatLabel class="mb-6">
          <InputText id="city_field" v-model="customer.city" />
          <label for="city_field">City</label>
        </FloatLabel>
        <FloatLabel class="mb-6">
          <InputText id="state_field" v-model="customer.state" />
          <label for="state_field">State</label>
        </FloatLabel>
        <FloatLabel class="mb-6">
          <InputText id="zip_field" v-model="customer.zip" />
          <label for="zip_field">Zip</label>
        </FloatLabel>
        <div class="mb-6">
          <div id="payment-element"></div>
        </div>
      </Fieldset>
      <div class="py-6 w-full text-center">
        <Button type="submit" size="large" :disabled="loading">
          {{ loading ? "Loading..." : "Pay $19.99" }}
        </Button>
      </div>
    </form>
  </div>
</template>




<script setup lang="ts">
import { onMounted, ref, reactive } from "vue";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from 'vue-router';
import { useRuntimeConfig } from '#imports';
import type { Stripe, StripeElements } from "@stripe/stripe-js";

const router = useRouter();
const config = useRuntimeConfig();

let stripe: Stripe | null;
let loading = ref(false);
let elements: StripeElements;

let customer = reactive({
  name: '',
  email: '',
  address: '',
  city: '',
  state: '',
  zip: ''
});

onMounted(async () => {
  stripe = await loadStripe(config.public.STRIPE_PUBLIC_KEY);
  elements = stripe!.elements({
    mode: "payment",
    amount: 1999,
    currency: "usd"
  });
  const paymentElement = elements.create("payment");
  paymentElement.mount("#payment-element");

  loading.value = false;
});

const handleSubmit = async () => {
  if (loading.value) return;
  loading.value = true;
  
  // Call your Strapi backend to handle payment processing
  try {
    const response = await fetch('https://your-strapi-domain.com/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer, amount: 1999 })
    });
    const data = await response.json();
    
    // Handle the response here, such as redirecting the user or showing a success message
    console.log('Payment successful:', data);
    // router.push('/success');
  } catch (error) {
    console.error('Payment error:', error);
    // router.push('/error');
  }
  loading.value = false;
}
</script>
