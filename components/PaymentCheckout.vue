<template>
  <div class="w-full">
    <form @submit.prevent="handleSubmit">
      <Fieldset :disabled="loading" legend="Payment" class="space-y-4">
        <div class="mb-6">
          <div id="card-element"></div>
        </div>
      </Fieldset>
      <div class="py-6 w-full text-center">
        <Button type="submit" size="large" :disabled="loading">
          {{ loading ? 'Loading...' : `Pay $${CheckoutStore.orderTotal}` }}
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

const toast = useToast();

const router = useRouter();
const config = useRuntimeConfig();
let stripePromise = loadStripe(config.public.STRIPE_PUBLIC_KEY);
let stripe, elements, cardElement;

const client = useStrapiClient();
const CheckoutStore = useCheckoutStore();

let loading = ref(false);

onMounted(async () => {
  stripe = await stripePromise;
  if (!stripe) {
    console.error('Stripe failed to initialize');
  }
  if (stripe) {
    elements = stripe.elements();

    cardElement = elements.create('card', {
      style: {
        base: {
          iconColor: 'rgb(71 85 105)',
          color: '#000',
          fontWeight: '500',
          fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
          fontSize: '16px',
          fontSmoothing: 'antialiased',
          ':-webkit-autofill': {
            color: '#000'
          },
          '::placeholder': {
            color: 'rgb(71 85 105)'
          }
        },
        invalid: {
          iconColor: '#DC143C',
          color: '#DC143C'
        }
      }
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

  const seats = [
    {
      eventId: CheckoutStore.morningId,
      seats: CheckoutStore.selectedMorningSeats.map((seat) => seat.id)
    },
    {
      eventId: CheckoutStore.afternoonId,
      seats: CheckoutStore.selectedAfternoonSeats.map((seat) => seat.id)
    }
  ];

  const morningTicketInfo = CheckoutStore.selectedMorningSeats.map((seat) => {
    return {
      date: 'May 18th, 2024',
      time: '10:30 AM',
      row: seat?.attributes?.row ?? null,
      seat: seat?.attributes?.number ?? null,
      backgroundImage: 'morning'
    };
  });

  const afternoonTicketInfo = CheckoutStore.selectedAfternoonSeats.map((seat) => {
    return {
      date: 'May 18th, 2024',
      time: '2:00 PM',
      row: seat?.attributes?.row ?? null,
      seat: seat?.attributes?.number ?? null,
      backgroundImage: 'afternoon'
    };
  });

  // get rid of any empty seats
  const printInfo = [...morningTicketInfo, ...afternoonTicketInfo].filter((ticket) => ticket?.row && ticket?.seat);

  try {
    const response = await client(`/orders/payment`, {
      method: 'POST',
      body: JSON.stringify({
        token: token.id,
        seats,
        dvds: CheckoutStore.selectedDvds,
        amount: CheckoutStore.orderTotal,
        printInfo
      })
    });

    console.log('Payment successful:', response);

    // get back pdfs of the tickets
    // show them to print out
    if (response?.tickets) {
      // Convert the numeric byte array into a Blob of type 'application/pdf'
      const blob = new Blob([new Uint8Array(response.tickets.data)], { type: 'application/pdf' });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Optionally open the PDF in a new window or tab
      window.open(url, '_blank');

      // Or, create a link for the user to download the PDF
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = 'downloadedTicket.pdf'; // Specify the filename to download
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Cleanup the URL object
      window.URL.revokeObjectURL(url);
    }

    CheckoutStore.clearEverything();
    router.push('/tickets/success');
  } catch (error) {
    console.error('Payment error:', error);
    toast.add({ severity: 'error', summary: 'Payment Error', detail: 'Payment failed', life: 3000 });

    // router.push('/tickets/error');
  }
  loading.value = false;
};
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
