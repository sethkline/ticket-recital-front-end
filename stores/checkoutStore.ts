import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useSeatStore } from './seatStore';

export const useCheckoutStore = defineStore('checkout-store', () => {
  const seatStore = useSeatStore();

  const userInformation = ref({});
  const selectedEventDetails = ref({});
  const selectedEvent = ref();
  const childrenInformation = ref([]);
  // ids of selected seats
  const selectedSeats = ref([]);
  const selectedSeatsDetails = ref([]);
  const selectedShow = ref();
  const selectEventDetails = ref(null);
  const ticketQuantity = ref(0);
  const paymentInformation = ref({});
  const orderSummary = ref({});
  const selectedDvds = ref(0);
  const selectedDigitalDownloads = ref(0);

  const TICKET_PRICE = 18;
  const DVD_PRICE = 30;
  const DIGITAL_PRICE = 20;
  const BUNDLE_DISCOUNT = 5; // Discount when purchasing both DVD and digital
  const SURCHARGE = 5;

  const ticketNumbers = computed(() => {
    if (selectedSeatsDetails.value.length === 0) return [];
    return selectedSeatsDetails.value.map(seat => seat.number);
  });

  const dvdTotal = computed(() => {
    return selectedDvds.value * DVD_PRICE;
  });

  const digitalTotal = computed(() => {
    return selectedDigitalDownloads.value * DIGITAL_PRICE;
  });

  // Calculate bundle discount if both DVD and digital are selected
  const discountTotal = computed(() => {
    return (selectedDvds.value > 0 && selectedDigitalDownloads.value > 0) ? BUNDLE_DISCOUNT : 0;
  });

  const orderTotal = computed(() => {
    const seatTotal = selectedSeats.value.length * TICKET_PRICE;
    return seatTotal + dvdTotal.value + digitalTotal.value + SURCHARGE - discountTotal.value;
  });

  const morningId = computed(() => {
    const morningEvent = seatStore.events.filter((seat) => seat.attributes.title === 'Morning Recital');
    return morningEvent.length > 0 ? morningEvent[0].id : null;
  });

  const afternoonId = computed(() => {
    const afternoonEvent = seatStore.events.filter((seat) => seat.attributes.title === 'Afternoon Recital');
    return afternoonEvent.length > 0 ? afternoonEvent[0].id : null;
  });

  const selectedMorningSeats = computed(() => {
    return selectedSeatsDetails.value.filter((seat) => seat.eventId === morningId.value);
  });

  const selectedAfternoonSeats = computed(() => {
    return selectedSeatsDetails.value.filter((seat) => seat.eventId === afternoonId.value);
  });

  const morningTotal = computed(() => {
    return selectedMorningSeats.value.length * TICKET_PRICE;
  });

  const afternoonTotal = computed(() => {
    return selectedAfternoonSeats.value.length * TICKET_PRICE;
  });

  const addChildInformation = (childInfo) => {
    childrenInformation.value.push(childInfo);
  };

  const updateSelectedSeats = (seatId, isReserved, seatDetails) => {
    if (isReserved) {
      // update the ids of seats
      selectedSeats.value.push(seatId);
      // update the details of the seats
      selectedSeatsDetails.value.push(seatDetails);
    } else {
      // remove the ids of seats
      selectedSeats.value = selectedSeats.value.filter((id) => id !== seatId);
      // remove the details of the seats
      selectedSeatsDetails.value = selectedSeatsDetails.value.filter((seat) => seat.id !== seatDetails.id);
    }
  };

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

  const clearEverything = () => {
    console.log('clearing everything');
    clearCheckout();
    seatStore.clearSeatStore();
  };

  const clearCheckout = () => {
    userInformation.value = {};
    selectedEventDetails.value = {};
    childrenInformation.value = [];
    selectedSeats.value = [];
    selectedSeatsDetails.value = [];
    selectEventDetails.value = null;
    selectedShow.value = null;
    selectedDvds.value = 0;
    selectedDigitalDownloads.value = 0;
    ticketQuantity.value = 0;
    paymentInformation.value = {};
    orderSummary.value = {};
    selectedEvent.value = null;
    childrenInformation.value = [];
  };

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
    addChildInformation,
    selectSeats,
    setTicketQuantity,
    setPaymentInformation,
    confirmOrder,
    clearCheckout,
    orderTotal,
    isOrderComplete,
    updateSelectedSeats,
    selectedSeatsDetails,
    ticketNumbers,
    selectedShow,
    selectEventDetails,
    selectedEvent,
    morningTotal,
    afternoonTotal,
    selectedMorningSeats,
    selectedAfternoonSeats,
    morningId,
    afternoonId,
    dvdTotal,
    digitalTotal,
    discountTotal,
    selectedDvds,
    selectedDigitalDownloads,
    clearEverything
  };
});