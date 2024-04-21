// import { defineStore } from 'pinia';
// import { io } from 'socket.io-client';
// import axios from 'axios';  // Assuming you use axios for HTTP requests

// export const useSeatStore = defineStore('seatStore', {
//   state: () => ({
//     seats: [],
//     socket: null,
//   }),
//   actions: {
//     setSeats(seats) {
//       this.seats = seats;
//     },
//     updateSeatStatus(seatId, isReserved) {
//       const seat = this.seats.find(s => s.id === seatId);
//       if (seat) {
//         seat.attributes.is_reserved = isReserved;
//       }
//     },
//     initializeSocket() {
//       if (!this.socket) {
//         this.socket = io('http://localhost:1337'); // Adjust the URL to your Strapi server
//         this.socket.on('seat-reserved', (data) => {
//           this.updateSeatStatus(data.seatId, data.isReserved);
//         });
//       }
//     },
//     disconnectSocket() {
//       if (this.socket) {
//         this.socket.disconnect();
//         this.socket = null;
//       }
//     },
//     async toggleSeat(endpoint) {
//       try {
//         const response = await axios.post(endpoint);
//         console.log('API response for toggling seat:', response.data);
//         // Optionally emit an event if the seat reservation changes something critical
//         if (this.socket) {
//           this.socket.emit('reserve-seat', {
//             seatId: response.data.seatId,
//             isReserved: response.data.isReserved
//           });
//         }
//         return response;
//       } catch (error) {
//         console.error('Error toggling the seat:', error);
//         throw error;
//       }
//     }
//   }
// });
// stores/seatStore.js
import { ref } from 'vue'
import { defineStore } from 'pinia';
import { useStrapi } from '#imports'
import { useCheckoutStore } from '~/stores/checkoutStore';
import axios from 'axios';  // Assuming you use axios for HTTP requests
import type { SeatResponse } from '~/types/seat';
import type { EventResponse } from '~/types/event'

export const useSeatStore = defineStore('seatStore', () => {
  const checkoutStore = useCheckoutStore();
  const { find } = useStrapi();
  const client = useStrapiClient()
  const seats: Ref<SeatResponse[]> = ref([]);
  const events: Ref<EventResponse[]> = ref([]);

  async function fetchEvents() {
    try {
      const eventResponse = await find('events');
      events.value = eventResponse.data as EventResponse[];
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  }

// Define the fetchSeats function to handle fetching seats for multiple events with pagination.
async function fetchSeats(eventIds: string[]): Promise<void> {
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



  return {
    seats,
    events,
    fetchEvents,
    fetchSeats,
    toggleSeat
  }
});
