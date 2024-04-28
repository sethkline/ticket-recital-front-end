
import { ref } from 'vue'
import { defineStore } from 'pinia';
import { useStrapi } from '#imports'
import { useCheckoutStore } from '~/stores/checkoutStore';
import type { SeatResponse } from '~/types/seat';
import type { EventResponse } from '~/types/event'

export const useSeatStore = defineStore('seatStore', () => {
  const checkoutStore = useCheckoutStore();
  const { find } = useStrapi();
  const client = useStrapiClient()
  const recital: Ref<EventResponse | null> = ref(true);
  const seats: Ref<SeatResponse[]> = ref([]);
  const events: Ref<EventResponse[]> = ref([]);
  const ticketPrice: Ref<number> = ref(18);
  const selectedEvent: Ref<string | null> = ref(null);
  const canAccessEarly = ref(false)

  const showPasscodeModal = (event: EventResponse) => {
    console.log(event, 'showPasscodeModal');
    showEarlyAccessRestriction.value=true
  }

  const showEarlyAccessRestriction = ref(false)

  async function submitEarlyAccessPasscode({passcode, earlyAccessType}: {passcode: string,  earlyAccessType: string,  }): Promise<boolean> {
    try {
      const payload = { type: earlyAccessType, passphrase: passcode }
      const response = await client(`/early-access-phrases/verify`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      console.log('API response for submitting early access passcode:', response);
      if (response && response.accessGranted) {
        canAccessEarly.value = true
        return true
      }
      return false
    } catch (error) {
      console.error('Error submitting early access passcode:', error);
      throw error
    }
  }

  // const fetchRecital = async() => {
  //   try {
  //     const response = await find('recitals');
  //     console.log(response, 'response')
  //     if (response && response.data) {
  //       // find the recital that is active
  //       recital.value = response.data.find((recital: EventResponse) => recital.attributes.canSellTickets);
  //     }
  //     return response
  //     // recital.value = eventResponse.data as EventResponse[];
  //   } catch (error) {
  //     console.error('Failed to fetch recital:', error);
  //   }
  // }

  async function fetchEvents() {
    try {
      const eventResponse = await find('events');
      const now = new Date();
      events.value = eventResponse.data as EventResponse[];

          // Iterate through events to check for any access restrictions
    events.value.forEach(event => {
      if (event.is_pre_sale_active && now >= new Date(event.pre_sale_start) && now <= new Date(event.pre_sale_end)) {
        // If pre-sale is active and we are within the pre-sale period
        // Show passcode modal for this event
        showPasscodeModal(event);
      } else if (now < new Date(event.ticket_sale_start) || now > new Date(event.ticket_sale_end)) {
        // If it's outside the ticket selling period
        event.accessRestricted = true; // Add a flag to indicate restricted access
      }
    });
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  }

// Define the fetchSeats function to handle fetching seats for multiple events with pagination.
async function fetchSeats(eventIds: string[], returnValues: boolean): Promise<void | SeatResponse[]> {
  try {
    const pageSize = 100; // Define the page size, adjust based on Strapi's limits or your requirements.
    let allSeats:SeatResponse[] = []; // Array to hold all fetched seats across all pages and events.
    // Iterate over each event ID provided.
    for (const eventId of eventIds) {
      let fetched = 0; // Counter for fetched items.
      let currentPage = 1; // Starting page index.
      let continueFetching = true; // Flag to control the loop.

      // Fetch data while seats are available and we have not reached the stop condition.
      while (continueFetching) {
        const response = await find('seats', {
          filters: { event: eventId },
          pagination: { page: currentPage, pageSize: pageSize },
        });

        // Check if we got data and handle it.
        if (response.data && response.data.length) {
          const seatsWithEventId = response.data.map(seat => ({ ...seat, eventId })); // Add eventId to each seat
          allSeats.push(...seatsWithEventId);
          fetched += response.data.length;
          currentPage++; // Move to the next page.
        } else {
          continueFetching = false; // Stop if no more data is returned.
        }
      }
    }

    if(returnValues) { return allSeats }
    // Once all data is fetched, assign it to the reactive state.
    seats.value = allSeats

  } catch (error) {
    console.error('Failed to fetch seats:', error);
  }
}

const getSeatById = (id: number) => {
  const found = seats.value.find(seat => seat.id === id)
  if (found) {
    return found
  }
}
async function toggleSeat(seatId: string, isReserved: boolean): Promise<void> {
  try {
    // Ensure the URL matches the route defined in the Strapi backend
    const response = await client(`/seats/${seatId}/reserve`, {
      method: 'POST',
      body: JSON.stringify({ isReserved }),
    });
    console.log('API response for toggling seat:', response);

    const seat = getSeatById(seatId)
    checkoutStore.updateSelectedSeats(seatId, isReserved, seat);
    // Update the seat's status locally if needed
  } catch (error) {
    console.error('Error toggling the seat:', error);

    throw error;
  }
}

const getEventIdByTitle = (title: ('Morning Recital' | 'Afternoon Recital')) => {
  if (!events.value) return

  return events.value.find(event => event.attributes.title === title)?.id
}

const morningSeats = computed(() => {
  if (!seats.value?.length) return []
  return seats.value.filter(seat => seat?.eventId === getEventIdByTitle('Morning Recital'))
})
const afternoonSeats = computed(() => {
  if (!seats.value?.length) return []
  return seats.value.filter(seat => seat.eventId === getEventIdByTitle('Afternoon Recital'))
})


async function fetchBothAvailableSeats(): Promise<boolean> {
  console.log('fetching both seats', events.value)
  
  const morningId = getEventIdByTitle('Morning Recital')
  const afternoonId = getEventIdByTitle('Afternoon Recital')



  if (!morningId || !afternoonId) {
    return false
  }

  try {
    const morningSeats = await fetchSeats([morningId as unknown as string], true)
    const afternoonSeats = await fetchSeats([afternoonId as unknown as string], true)

    if (morningSeats && afternoonSeats) {
      seats.value = [...morningSeats, ...afternoonSeats]
    }
     

    return true

  } catch (error) {
    console.error('Error fetching seats:', error);
  }
}



  return {
    seats,
    events,
    fetchEvents,
    fetchSeats,
    toggleSeat,
    ticketPrice,
    morningSeats,
    afternoonSeats,
    fetchBothAvailableSeats,
    selectedEvent,
    submitEarlyAccessPasscode,
    recital,
  }
});
