import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCheckoutStore = defineStore('checkout-store', () => {
  const userInformation = ref({});
  const selectedEventDetails = ref({});
  const childrenInformation = ref([]);
  const selectedSeats = ref([]);
  const selectedSeatsDetails = ref([]);
  const selectedShow = ref()
  const selectEventDetails = ref(null)
  const ticketQuantity = ref(0);
  const paymentInformation = ref({});
  const orderSummary = ref({});

  const selectedEventDetailsDetails = ref({
    morningShow: { price: 50, quantity: 1 },
    afternoonShow: { price: 50, quantity: 1 },
    taxRate: 0.15  // 15% tax rate for example
  });

  const ticketQuickTotal = computed(() => {
    return selectedSeatsDetails.value.length * 20
  })

  const ticketNumbers = computed(():string[] => {
    if (selectedSeatsDetails.value.length === 0) return []
    return selectedSeatsDetails.value.map(seat => seat.number)
  })

  const orderTotal = computed(() => {
    const morningTotal = selectedEventDetailsDetails.value.morningShow.price * selectedEventDetailsDetails.value.morningShow.quantity;
    const afternoonTotal = selectedEventDetailsDetails.value.afternoonShow.price * selectedEventDetailsDetails.value.afternoonShow.quantity;
    const subtotal = morningTotal + afternoonTotal;
    const tax = subtotal * selectedEventDetailsDetails.value.taxRate;
    return subtotal + tax; // Final total including tax
  });

  const setUserInformation = (info) => {
    userInformation.value = info;
  };

  // const selectEventDetails = (eventDetails) => {
  //   selectedEventDetails.value = eventDetails;
  // };

  const addChildInformation = (childInfo) => {
    childrenInformation.value.push(childInfo);
  };

  const updateSelectedSeats = (seatId, isReserved, seatDetails) => {
    if (isReserved) {
      selectedSeats.value.push(seatId);

      selectedSeatsDetails.value.push(seatDetails)
    } else {
      selectedSeats.value = selectedSeats.value.filter((id) => id !== seatId);
      selectedSeatsDetails.value = selectedSeatsDetails.value.filter((seat) => seat.id !== seatDetails.id);
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

  // const orderTotal = computed(() => {
  //   // Calculate the total cost
  //   // Example calculation (adjust according to actual data structure and needs)
  //   const baseCost = selectedEventDetails.value.price || 0;
  //   const totalSeatsCost = selectedSeats.value.length * baseCost;
  //   return totalSeatsCost; // Modify as needed for more complex calculations
  // });

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
    addChildInformation,
    selectSeats,
    setTicketQuantity,
    setPaymentInformation,
    confirmOrder,
    clearCheckout,
    orderTotal,
    isOrderComplete,
    updateSelectedSeats,
    selectedEventDetailsDetails,
    selectedSeatsDetails,
    ticketNumbers,
    selectedShow,
    ticketQuickTotal,
    selectEventDetails
  };
});
