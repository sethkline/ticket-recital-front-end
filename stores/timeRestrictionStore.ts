import { defineStore } from 'pinia';

export const useTimeRestrictionStore = defineStore('timeRestriction', {
  state: () => {
    // Get dates from environment variables or config service
    const config = {
      seniorTicketSalesStart: import.meta.env.VITE_SENIOR_SALES_START || '2025-05-01T09:00:00',
      volunteerTicketSalesStart: import.meta.env.VITE_VOLUNTEER_SALES_START || '2025-05-03T09:00:00',
      generalTicketSalesStart: import.meta.env.VITE_GENERAL_SALES_START || '2025-05-5T09:00:00',
      ticketSalesEnd: import.meta.env.VITE_TICKET_SALES_END || '2025-05-15T22:00:00',
    };
    
    // Safely check if localStorage is available
    let savedUserType = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        savedUserType = localStorage.getItem('userType') || null;
      } catch (e) {
        console.warn('Unable to access localStorage:', e);
      }
    }
    
    return {
      seniorTicketSalesStart: new Date(config.seniorTicketSalesStart),
      volunteerTicketSalesStart: new Date(config.volunteerTicketSalesStart),
      generalTicketSalesStart: new Date(config.generalTicketSalesStart),
      ticketSalesEnd: new Date(config.ticketSalesEnd),
      currentUserType: savedUserType,
    };
  },
  
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
      // Safely persist the user type
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          localStorage.setItem('userType', type);
        } catch (e) {
          console.warn('Unable to save to localStorage:', e);
        }
      }
    },
    
    // Add this method to handle potential date errors
    validateDates() {
      const dates = [
        this.seniorTicketSalesStart,
        this.volunteerTicketSalesStart,
        this.generalTicketSalesStart,
        this.ticketSalesEnd
      ];
      
      // Check if any date is invalid
      const hasInvalidDate = dates.some(date => isNaN(date.getTime()));
      if (hasInvalidDate) {
        console.error('Invalid date format in TimeRestrictionStore');
        // You could also reset to defaults or take other recovery actions
      }
      
      return !hasInvalidDate;
    }
  }
});