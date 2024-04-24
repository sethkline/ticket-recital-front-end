
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
  const seats: Ref<SeatResponse[]> = ref([]);
  const events: Ref<EventResponse[]> = ref([]);
  const ticketPrice: Ref<number> = ref(18);

  async function fetchEvents() {
    try {
      const eventResponse = await find('events');
      events.value = eventResponse.data as EventResponse[];
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
          allSeats.push(...response.data as SeatResponse[]);
          fetched += response.data.length;
          currentPage++; // Move to the next page.
        } else {
          continueFetching = false; // Stop if no more data is returned.
        }
      }
    }

    if(returnValues) { return allSeats }
    // Once all data is fetched, assign it to the reactive state.
    seats.value = allSeats;

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

const morningSeats: Ref<SeatResponse[]> = ref([])
const afternoonSeats: Ref<SeatResponse[]> = ref([])

async function fetchBothAvailableSeats(): Promise<boolean> {
  console.log('fetching both seats', events.value)
  morningSeats.value = []
  afternoonSeats.value = []
  
  const morningId = events.value.find(event => event.attributes.title === 'Morning Recital')?.id
  const afternoonId = events.value.find(event => event.attributes.title === 'Afternoon Recital')?.id

  if (!morningId || !afternoonId) {
    return false
  }

  try {
     morningSeats.value = await fetchSeats([morningId as unknown as string], true)
     afternoonSeats.value = await fetchSeats([afternoonId as unknown as string], true)

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
    fetchBothAvailableSeats
  }
});
