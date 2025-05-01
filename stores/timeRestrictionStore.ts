import { defineStore } from 'pinia';

export const useTimeRestrictionStore = defineStore('timeRestriction', {
  state: () => ({
    // Configure these dates for your specific requirements
    seniorTicketSalesStart: new Date('2025-05-10T09:00:00'),  // When seniors can start buying
    volunteerTicketSalesStart: new Date('2025-05-11T09:00:00'), // When volunteers can start buying
    generalTicketSalesStart: new Date('2025-05-15T09:00:00'),  // When general public can buy
    ticketSalesEnd: new Date('2025-06-01T23:59:59'),          // When all sales end
    currentUserType: null, // 'senior', 'volunteer', or 'general'
  }),
  
  getters: {
    canPurchaseTickets() {
      const now = new Date();
      
      // Check if we're past the end date first
      if (now > this.ticketSalesEnd) {
        return { allowed: false, message: 'Ticket sales have ended.' };
      }

      // Check sales status based on user type
      switch(this.currentUserType) {
        case 'senior':
          return now >= this.seniorTicketSalesStart 
            ? { allowed: true, message: 'Senior early access granted.' }
            : { allowed: false, message: `Senior ticket sales begin ${this.formatDate(this.seniorTicketSalesStart)}.` };
        
        case 'volunteer':
          return now >= this.volunteerTicketSalesStart 
            ? { allowed: true, message: 'Volunteer early access granted.' }
            : { allowed: false, message: `Volunteer ticket sales begin ${this.formatDate(this.volunteerTicketSalesStart)}.` };
        
        default: // general public
          return now >= this.generalTicketSalesStart 
            ? { allowed: true, message: 'Welcome! Tickets are on sale now.' }
            : { allowed: false, message: `General ticket sales begin ${this.formatDate(this.generalTicketSalesStart)}.` };
      }
    },
    
    // Time remaining until sales end (for countdown display)
    timeRemaining() {
      const now = new Date();
      const diff = this.ticketSalesEnd - now;
      
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      return { days, hours, minutes, seconds };
    }
  },
  
  actions: {
    formatDate(date) {
      return date.toLocaleString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    },
    
    setUserType(type) {
      this.currentUserType = type;
    }
  }
});