<template>
  <div class="w-full">
    <form @submit.prevent="handleSubmit">
      <Fieldset :disabled="loading" legend="Payment" class="space-y-4">
        <!-- Using FloatLabel for all fields -->
        <FloatLabel class="mb-6">
          <InputText id="name_field" v-model="customer.name" class="w-full lg:w-1/2" />
          <label for="name_field">Name</label>
        </FloatLabel>
        <FloatLabel class="mb-6">
          <InputText id="email_field" type="email" class="w-full lg:w-1/2" v-model="customer.email" />
          <label for="email_field">Email</label>
        </FloatLabel>
        <div class="mb-6">
          <div id="card-element"></div>
        </div>
      </Fieldset>
      <div class="py-6 w-full text-center">
        <Button type="submit" size="large" :disabled="loading">
          {{ loading ? "Loading..." : `Pay $${CheckoutStore.ticketQuickTotal}` }}
        </Button>
      </div>
    </form>
  </div>
</template>



<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'vue-router';
import { useRuntimeConfig } from '#imports';
import { useCheckoutStore } from '#imports';

const router = useRouter();
const config = useRuntimeConfig();
let stripePromise = loadStripe(config.public.STRIPE_PUBLIC_KEY);
// let stripe = await loadStripe(config.public.STRIPE_PUBLIC_KEY);
// let elements = stripe.elements();
let stripe, elements, cardElement;

const client = useStrapiClient()
const CheckoutStore = useCheckoutStore()

let loading = ref(false);
let customer = reactive({
  name: '',
  email: '',
});


onMounted(async() => {
  stripe = await stripePromise;
  if (!stripe) {
    console.error('Stripe failed to initialize');
  }
  if (stripe) {
    elements = stripe.elements();
    
    cardElement = elements.create('card',{
      style: {
    base: {
      iconColor: '#c4f0ff',
      color: '#000', 
      fontWeight: '500',
      fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
      fontSize: '16px',
      fontSmoothing: 'antialiased',
      ':-webkit-autofill': {
        color: '#fce883',
      },
      '::placeholder': {
        color: '#87BBFD',
      },
    },
    invalid: {
      iconColor: '#DC143C',
      color: '#DC143C',
    },
  },
});
    cardElement.mount('#card-element');
  } else {
    console.error('Stripe elements not available');
  }
});

const handleSubmit = async () => {
  if (loading.value) return;
  loading.value = true;

  // Create a token or handle the payment
  const { token, error } = await stripe!.createToken(cardElement);
  
  if (error) {
    console.error('Payment error:', error);
    loading.value = false;
    return;
  }

  try {
    const response = await client(`/orders/payment`, {
      method: 'POST',
      body: JSON.stringify({
      token: token.id,
      customer,
      amount: CheckoutStore.ticketQuickTotal,
      eventDetails: { eventId: CheckoutStore.selectEventDetails?.value, seats: CheckoutStore.selectedSeats}
    }),
    });

    console.log('Payment successful:', response);
    router.push('/tickets/success');
  } catch (error) {
    console.error('Payment error:', error);


    router.push('/tickets/error');
  }
  loading.value = false;
}
</script>
<style scoped>
#card-element {
  height: 40px; /* Adjust the height as needed */
  padding: 10px 12px;
  width: 100%; /* Ensure it occupies the full width of its container */
  background-color: white;
  border: 1px solid #ccc; /* Add a border to make the element visible */
  border-radius: 4px; /* Optional: rounded corners */
  box-shadow: 0 1px 3px 0 #e6ebf1; /* Optional: add some shadow for better visibility */
  -webkit-transition: box-shadow 150ms ease;
  transition: box-shadow 150ms ease;
}

#card-element:focus {
  box-shadow: 0 1px 3px 0 #cfd7df; /* Change box shadow for focus */
}

#card-element.invalid {
  border-color: #fa755a; /* Change border color when there are errors */
}

#card-element.StripeElement--focus {
  box-shadow: 0 1px 3px 0 #cfd7df;
}

/* Style the placeholder text color within the input */
.StripeElement--empty::placeholder {
  color: #9bacc8;
}

.StripeElement--invalid {
  border-color: #fa755a;
}
</style>
