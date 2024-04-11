import { defineStore } from 'pinia'

export const useCheckoutStore = defineStore({
  id: 'checkout-store',
  state: () => ({
    userInformation: {},
    selectedEventDetails: {},
    childrenInformation: [],
    selectedSeats: [],
    ticketQuantity: 0,
    paymentInformation: {},
    orderSummary: {},
  }),
  actions: {
    setUserInformation(info: string) {
      this.userInformation = info;
    },
    selectEventDetails(eventDetails) {
      this.selectedEventDetails = eventDetails;
    },
    addChildInformation(childInfo) {
      this.childrenInformation.push(childInfo);
    },
    selectSeats(seats) {
      this.selectedSeats = seats;
    },
    setTicketQuantity(quantity) {
      this.ticketQuantity = quantity;
    },
    setPaymentInformation(paymentInfo) {
      this.paymentInformation = paymentInfo;
    },
    confirmOrder() {
      // Implementation for order confirmation
    },
    clearCheckout() {
      this.userInformation = {};
      this.selectedEventDetails = {};
      this.childrenInformation = [];
      this.selectedSeats = [];
      this.ticketQuantity = 0;
      this.paymentInformation = {};
      this.orderSummary = {};
    },
  },
  getters: {
    orderTotal(state) {
      // Calculate the total cost
    },
    isOrderComplete(state) {
      // Determine if the order can be finalized
    },
  },
})
