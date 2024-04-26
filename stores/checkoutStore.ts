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
  const selectedShow = ref()
  const selectEventDetails = ref(null)
  const ticketQuantity = ref(0);
  const paymentInformation = ref({});
  const orderSummary = ref({});
  const selectedDvds = ref(0)

  const TICKET_PRICE = 18;
  const DVD_PRICE = 30;

  // const selectedEventDetailsDetails = ref({
  //   morningShow: { price: 50, quantity: 1 },
  //   afternoonShow: { price: 50, quantity: 1 },
  //   taxRate: 0.15  // 15% tax rate for example
  // });

  // const ticketQuickTotal = computed(() => {
  //   return selectedSeatsDetails.value.length * 20
  // })

  const ticketNumbers = computed(():string[] => {
    if (selectedSeatsDetails.value.length === 0) return []
    return selectedSeatsDetails.value.map(seat => seat.number)
  })


  const orderTotal = computed(() => {
    return selectedSeats.value.length * TICKET_PRICE + dvdTotal.value;});

    const morningId = computed(() => {
      return seatStore.events.filter((seat) => seat.attributes.title === 'Morning Recital')[0].id
    })

    const afternoonId = computed(() => {
      return seatStore.events.filter((seat) => seat.attributes.title === 'Afternoon Recital')[0].id
    })

    const selectedMorningSeats = computed(() => {
      return selectedSeatsDetails.value.filter((seat) => seat.eventId === morningId.value)
    })
    const selectedAfternoonSeats = computed(() => {
      return selectedSeatsDetails.value.filter((seat) => seat.eventId === afternoonId.value)
    })

    const morningTotal = computed(() => {
      return selectedMorningSeats.value.length * TICKET_PRICE
    })

    const afternoonTotal = computed(() => {
      return selectedAfternoonSeats.value.length * TICKET_PRICE
    })

    const dvdTotal = computed(() => {
      return selectedDvds.value * DVD_PRICE
    })


  // const selectEventDetails = (eventDetails) => {
  //   selectedEventDetails.value = eventDetails;
  // };

  const addChildInformation = (childInfo) => {
    childrenInformation.value.push(childInfo);
  };

  const updateSelectedSeats = (seatId, isReserved, seatDetails) => {
    if (isReserved) {
      // update the ids of seats
      selectedSeats.value.push(seatId);
      // update the details of the seats
      selectedSeatsDetails.value.push(seatDetails)
    } else {
      // remove the ids of seats
      selectedSeats.value = selectedSeats.value.filter((id) => id !== seatId);
      // remove the details of the seats
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
    selectedSeatsDetails.value = [];
    selectEventDetails.value = null
    selectedShow.value = null
    selectedDvds.value = 0
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
    // ticketQuickTotal,
    selectEventDetails,
    selectedEvent,
    morningTotal,
    afternoonTotal,
    selectedMorningSeats,
    selectedAfternoonSeats,
    morningId,
    afternoonId,
    dvdTotal,
    selectedDvds,
  };
});
