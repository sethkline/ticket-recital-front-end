
import { ref } from 'vue'
import { defineStore } from 'pinia';
import { useStrapi } from '#imports'
import { useCheckoutStore } from '~/stores/checkoutStore';
import type { SeatResponse } from '~/types/seat';
import type { EventResponse } from '~/types/event'

export const useRecitalStore = defineStore('recitalStore', () => {
  // const checkoutStore = useCheckoutStore();
  const { find } = useStrapi();
  const client = useStrapiClient()
  const recital: Ref<EventResponse | null> = ref(null);
  const ticketPrice: Ref<number> = ref(18);

  const showPasscodeModal = (event: EventResponse) => {
    console.log(event, 'showPasscodeModal');
    showEarlyAccessRestriction.value=true
  }

  const showEarlyAccessRestriction = ref(false)

  async function submitEarlyAccessPasscode({eventId, passcode}: {eventId: string, passcode: string, returnFunction: boolean}): Promise<boolean> {
    try {
      const response = await client(`/events/${eventId}/early-access-passcode`, {
        method: 'POST',
        body: JSON.stringify({passcode}),
      });
      console.log('API response for submitting early access passcode:', response);
      if (response) {
        return response
      }
    } catch (error) {
      console.error('Error submitting early access passcode:', error);
    }
  }

  const advancedTicketTime = computed(() => {
    if (!recital.value || !recital?.value?.attributes?.is_pre_sale_active) return false;
    const now = new Date();
    const ticketSaleStart = new Date(recital.value?.attributes.pre_sale_start);
    const ticketSaleEnd = new Date(recital.value?.attributes.pre_sale_end);
    return ticketSaleStart < now && ticketSaleEnd > now;
  });
  const ticketSalesTime = computed(() => {
    if (!recital.value || !recital?.value?.attributes?.can_sell_tickets) return false;
    const now = new Date();
    const ticketSaleStart = new Date(recital.value?.attributes.ticket_sale_start);
    const ticketSaleEnd = new Date(recital.value?.attributes.ticket_sale_end);
    return ticketSaleStart < now && ticketSaleEnd > now;
  });

  const fetchRecital = async() => {
    try {
      const response = await find('recitals');
      console.log(response, 'response')
      if (response && response.data) {
        // find the recital that is active
        const activeRecital = response.data.find((recital: EventResponse) => recital?.attributes?.can_sell_tickets);
        console.log(activeRecital, 'activeRecital')
        if (activeRecital) {
          recital.value = activeRecital;
        }
      }
      return response
      // recital.value = eventResponse.data as EventResponse[];
    } catch (error) {
      console.error('Failed to fetch recital:', error);
    }
  }


  return {
    submitEarlyAccessPasscode,
    fetchRecital,
    recital,
    advancedTicketTime,
    ticketSalesTime
  }
});
