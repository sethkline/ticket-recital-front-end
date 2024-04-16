import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCheckoutStore = defineStore('checkout-store', () => {
  const userInformation = ref({});
  const selectedEventDetails = ref({});
  const childrenInformation = ref([]);
  const selectedSeats = ref([]);
  const ticketQuantity = ref(0);
  const paymentInformation = ref({});
  const orderSummary = ref({});

  const setUserInformation = (info) => {
    userInformation.value = info;
  };

  const selectEventDetails = (eventDetails) => {
    selectedEventDetails.value = eventDetails;
  };

  const addChildInformation = (childInfo) => {
    childrenInformation.value.push(childInfo);
  };

  const updateSelectedSeats = (seatId, isReserved) => {
    if (isReserved) {
      selectedSeats.value.push(seatId);
    } else {
      selectedSeats.value = selectedSeats.value.filter((id) => id !== seatId);
    }
  }

  const selectSeats = (seats) => {
    selectedSeats.value = seats;
  };

  const setTicketQuantity = (quantity) => {
    ticketQuantity.value = quantity;
  };

  const setPaymentInformation = (paymentInfo) => {
    paymentInformation.value = paymentInfo;
  };

  const confirmOrder = () => {
    // Implementation for order confirmation
  };

  const clearCheckout = () => {
    userInformation.value = {};
    selectedEventDetails.value = {};
    childrenInformation.value = [];
    selectedSeats.value = [];
    ticketQuantity.value = 0;
    paymentInformation.value = {};
    orderSummary.value = {};
  };

  const orderTotal = computed(() => {
    // Calculate the total cost
    // Example calculation (adjust according to actual data structure and needs)
    const baseCost = selectedEventDetails.value.price || 0;
    const totalSeatsCost = selectedSeats.value.length * baseCost;
    return totalSeatsCost; // Modify as needed for more complex calculations
  });

  const isOrderComplete = computed(() => {
    // Determine if the order can be finalized
    // Example condition
    return !!userInformation.value.name && selectedSeats.value.length > 0 && paymentInformation.value.cardNumber;
  });

  return {
    userInformation,
    selectedEventDetails,
    childrenInformation,
    selectedSeats,
    ticketQuantity,
    paymentInformation,
    orderSummary,
    setUserInformation,
    selectEventDetails,
    addChildInformation,
    selectSeats,
    setTicketQuantity,
    setPaymentInformation,
    confirmOrder,
    clearCheckout,
    orderTotal,
    isOrderComplete,
    updateSelectedSeats
  };
});
