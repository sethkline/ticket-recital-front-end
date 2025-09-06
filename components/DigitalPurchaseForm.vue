<template>
  <div class="payment-form">
    <form @submit.prevent="handleSubmit">
      <!-- Customer Information (Read-only) -->
      <div class="mb-6 p-4 bg-gray-100 rounded-lg">
        <h3 class="font-semibold mb-2">Billing Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Name</label>
            <InputText :value="customerName" readonly class="bg-white" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <InputText :value="customerEmail" readonly class="bg-white" />
          </div>
        </div>
      </div>

      <!-- Payment Information -->
      <div class="mb-6">
        <h3 class="font-semibold mb-4">Payment Information</h3>
        <div class="border rounded-lg p-4">
          <label class="block text-sm font-medium mb-2">Card Details</label>
          <div id="card-element" class="p-3 border rounded focus-within:ring-2 focus-within:ring-purple-500"></div>
          <div v-if="cardError" class="text-red-500 text-sm mt-2">{{ cardError }}</div>
        </div>
      </div>

      <!-- Security Notice -->
      <div class="mb-6">
        <Message severity="info" :closable="false">
          <div class="flex items-start">
            <i class="pi pi-shield text-blue-500 mr-2 mt-0.5"></i>
            <div>
              <p class="font-semibold">Secure Payment</p>
              <p class="text-sm">Your payment is processed securely by Stripe. We do not store your credit card information.</p>
            </div>
          </div>
        </Message>
      </div>

      <!-- Terms Notice -->
      <div class="mb-6">
        <div class="flex items-start">
          <Checkbox v-model="agreeToTerms" :binary="true" id="agreeToTerms" class="mr-2 mt-1" />
          <label for="agreeToTerms" class="text-sm text-gray-700">
            By completing this purchase, I agree that digital downloads are non-refundable and that access codes are valid until December 31, 2025.
          </label>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="text-center">
        <Button 
          type="submit" 
          :disabled="!agreeToTerms || loading || processing"
          :loading="processing"
          size="large"
          severity="success"
          class="w-full py-3"
        >
          <template v-if="processing">
            <i class="pi pi-spinner pi-spin mr-2"></i>
            Processing Payment...
          </template>
          <template v-else>
            <i class="pi pi-credit-card mr-2"></i>
            Complete Purchase - ${{ amount }}
          </template>
        </Button>
      </div>

      <!-- Payment Error -->
      <div v-if="paymentError" class="mt-4">
        <Message severity="error" :closable="false">
          {{ paymentError }}
        </Message>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { loadStripe } from '@stripe/stripe-js';
import { useRuntimeConfig } from '#imports';

// Props
interface Props {
  token: string;
  amount: number;
  customerEmail: string;
  customerName: string;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  success: [response: any];
  error: [error: any];
}>();

// Composables
const config = useRuntimeConfig();
const client = useStrapiClient();

// State
const loading = ref(false);
const processing = ref(false);
const agreeToTerms = ref(false);
const cardError = ref('');
const paymentError = ref('');

// Stripe
let stripe: any = null;
let elements: any = null;
let cardElement: any = null;

// Initialize Stripe
onMounted(async () => {
  try {
    stripe = await loadStripe(config.public.STRIPE_PUBLIC_KEY);
    
    if (!stripe) {
      throw new Error('Failed to load Stripe');
    }

    elements = stripe.elements();
    cardElement = elements.create('card', {
      style: {
        base: {
          iconColor: 'rgb(107 114 128)',
          color: 'rgb(31 41 55)',
          fontWeight: '500',
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
          fontSize: '16px',
          fontSmoothing: 'antialiased',
          ':-webkit-autofill': {
            color: 'rgb(31 41 55)'
          },
          '::placeholder': {
            color: 'rgb(107 114 128)'
          }
        },
        invalid: {
          iconColor: 'rgb(239 68 68)',
          color: 'rgb(239 68 68)'
        }
      }
    });

    // Listen for real-time validation errors from the card Element
    cardElement.on('change', ({ error }) => {
      cardError.value = error ? error.message : '';
    });

    cardElement.mount('#card-element');
  } catch (error) {
    console.error('Error initializing Stripe:', error);
    paymentError.value = 'Payment system could not be loaded. Please refresh the page and try again.';
  }
});

// Cleanup Stripe elements
onUnmounted(() => {
  if (cardElement) {
    cardElement.destroy();
  }
});

// Handle form submission
const handleSubmit = async () => {
  if (!stripe || !cardElement) {
    paymentError.value = 'Payment system not ready. Please try again.';
    return;
  }

  if (!agreeToTerms.value) {
    paymentError.value = 'Please agree to the terms before completing your purchase.';
    return;
  }

  processing.value = true;
  paymentError.value = '';
  
  try {
    // Step 1: Initiate payment to get client secret
    const paymentIntentResponse = await client('/payment-links/initiate-payment', {
      method: 'POST',
      body: JSON.stringify({
        token: props.token,
        amount: props.amount
      })
    });

    if (!paymentIntentResponse.client_secret) {
      throw new Error('Failed to initiate payment');
    }

    // Step 2: Confirm payment with Stripe
    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
      paymentIntentResponse.client_secret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: props.customerName,
            email: props.customerEmail,
          },
        }
      }
    );

    if (stripeError) {
      throw new Error(stripeError.message);
    }

    if (paymentIntent.status === 'succeeded') {
      // Step 3: Complete the order and get access code
      const completionResponse = await client('/payment-links/complete-payment', {
        method: 'POST',
        body: JSON.stringify({
          token: props.token,
          payment_intent_id: paymentIntent.id
        })
      });

      // Emit success with the response (normalize the field name)
      const normalizedResponse = {
        ...completionResponse,
        accessCode: completionResponse.access_code || completionResponse.accessCode
      };
      emit('success', normalizedResponse);
    } else {
      throw new Error('Payment was not successful');
    }
  } catch (error) {
    console.error('Payment error:', error);
    paymentError.value = error.message || 'Payment failed. Please try again.';
    emit('error', error);
  } finally {
    processing.value = false;
  }
};
</script>

<style scoped>
.payment-form {
  max-width: 100%;
}

#card-element {
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  transition: border-color 0.15s ease;
}

#card-element:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.StripeElement--invalid {
  border-color: #ef4444;
}

.StripeElement--webkit-autofill {
  background: white !important;
}
</style>