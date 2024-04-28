import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useStrapi } from '#imports';
import { useCheckoutStore } from '~/stores/checkoutStore';
import type { SeatResponse } from '~/types/seat';
import type { EventResponse } from '~/types/event';

export const useAdminStore = defineStore('useAdminStore', () => {
  // const checkoutStore = useCheckoutStore();
  const { find } = useStrapi();
  const client = useStrapiClient();
  const tickets = ref([]);

  const fetchOrders = async () => {
    try {
      const response = await find('orders');
      console.log(response, 'response');
      if (response && response.data && response.data.length > 0) {
        // find the recital that is active
        tickets.value = response.data;
        return response;
      }
    } catch (error) {
      console.error('Failed to fetch recital:', error);
    }
  };
  const fetchTickets = async () => {
    try {
      const response = await find('tickets');
      console.log(response, 'response');
      if (response && response.data && response.data.length > 0) {
        // find the recital that is active
        tickets.value = response.data;
        return response;
      }
    } catch (error) {
      console.error('Failed to fetch recital:', error);
    }
  };
  const getTotalSales = async () => {
    try {
      const response = await client(`/orders/total-sales`, {
        method: 'GET'
      });

      if (response) {
        return response;
      }
    } catch (error) {
      console.error('Failed to fetch order totals:', error);
    }
  };

  const getRecitalMetrics = async (eventId: string) => {
    try {
      const response = await client(`/events/${eventId}/metrics`, {
        method: 'GET'
      });

      if (response) {
        return response;
      }
    } catch (error) {
      console.error('Failed to fetch order totals:', error);
    }
  };

  const getGroupedTickets = async () => {
    try {
      const response = await client(`/tickets/list-with-roles`, {
        method: 'GET'
      });
      if (response) {
        return response;
      }
    } catch (error) {
      console.error('Failed to fetch order totals:', error);
    }
  };

  const updateSeatAvailability = async (eventIds: string, is_available = false) => {
    try {
      const response = await client(`/seats/update-availability`, {
        method: 'POST',
        body: JSON.stringify({ ids: eventIds, is_available }),
      });
      if (response) {
        return response;
      }
    } catch (error) {
      console.error('Failed to make seats unavailable:', error);
    }
  }
  const updateHandicapAvailability = async (eventIds: string, handicap_access = true) => {
    try {
      const response = await client(`/seats/update-handicap-access`, {
        method: 'POST',
        body: JSON.stringify({ ids: eventIds, handicap_access }),
      });
      if (response) {
        return response;
      }
    } catch (error) {
      console.error('Failed to make seats unavailable:', error);
    }
  }

  return {
    getRecitalMetrics,
    fetchOrders,
    fetchTickets,
    tickets,
    getTotalSales,
    getGroupedTickets,
    updateSeatAvailability,
    updateHandicapAvailability
  };
});
