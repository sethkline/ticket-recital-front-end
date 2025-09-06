import { defineStore } from 'pinia';

export interface PaymentLink {
  id: number;
  token: string;
  customer_email: string;
  customer_name: string;
  customer_phone?: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'expired' | 'failed';
  expires_at: string;
  last_accessed?: string;
  completed_at?: string;
  custom_message?: string;
  stripe_payment_intent_id?: string;
  stripe_session_id?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  order?: any;
  access_logs?: AccessLog[];
}

export interface AccessLog {
  id: number;
  accessed_at: string;
  ip_address: string;
  user_agent?: string;
  action: 'viewed' | 'payment_attempted' | 'payment_succeeded' | 'payment_failed' | 'expired';
}

export interface PaymentLinkCreateRequest {
  customer_email: string;
  customer_name: string;
  customer_phone?: string;
  custom_message?: string;
  expiry_days: number;
  send_email: boolean;
  amount: number;
}

export interface PaymentLinkValidationResponse {
  valid: boolean;
  paymentLink?: PaymentLink;
  error?: string;
  status?: string;
}

export interface PaymentCompletionResponse {
  success: boolean;
  accessCode?: string;
  orderId?: number;
  error?: string;
}

export const usePaymentLinkStore = defineStore('paymentLink', () => {
  const client = useStrapiClient();
  
  // State
  const paymentLinks = ref<PaymentLink[]>([]);
  const currentPaymentLink = ref<PaymentLink | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Actions
  const fetchPaymentLinks = async (): Promise<void> => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await client('/payment-links', {
        method: 'GET',
      });
      
      // Handle both direct array response and wrapped response
      paymentLinks.value = Array.isArray(response) ? response : (response.data || []);
    } catch (err) {
      console.error('Error fetching payment links:', err);
      error.value = 'Failed to fetch payment links';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createPaymentLink = async (data: PaymentLinkCreateRequest): Promise<PaymentLink> => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await client('/payment-links/create', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      
      // Add to local state
      paymentLinks.value.unshift(response);
      
      return response;
    } catch (err) {
      console.error('Error creating payment link:', err);
      error.value = 'Failed to create payment link';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const validatePaymentLink = async (token: string): Promise<PaymentLinkValidationResponse> => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await client(`/payment-links/validate/${token}`, {
        method: 'GET'
      });
      
      currentPaymentLink.value = response;
      
      return {
        valid: response.status === 'pending',
        paymentLink: response,
        status: response.status
      };
    } catch (err) {
      console.error('Error validating payment link:', err);
      error.value = 'Invalid or expired payment link';
      
      return {
        valid: false,
        error: error.value
      };
    } finally {
      loading.value = false;
    }
  };

  const initiatePayment = async (token: string, amount: number): Promise<{ client_secret: string }> => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await client('/payment-links/initiate-payment', {
        method: 'POST',
        body: JSON.stringify({
          token,
          amount
        })
      });
      
      return response;
    } catch (err) {
      console.error('Error initiating payment:', err);
      error.value = 'Failed to initiate payment';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const completePayment = async (token: string, paymentIntentId: string): Promise<PaymentCompletionResponse> => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await client('/payment-links/complete-payment', {
        method: 'POST',
        body: JSON.stringify({
          token,
          payment_intent_id: paymentIntentId
        })
      });
      
      // Update current payment link status
      if (currentPaymentLink.value) {
        currentPaymentLink.value.status = 'completed';
        currentPaymentLink.value.completed_at = new Date().toISOString();
      }
      
      return {
        success: true,
        accessCode: response.access_code || response.accessCode,
        orderId: response.order_id || response.orderId
      };
    } catch (err) {
      console.error('Error completing payment:', err);
      error.value = 'Failed to complete payment';
      
      return {
        success: false,
        error: error.value
      };
    } finally {
      loading.value = false;
    }
  };

  const getPaymentLinkDetails = async (token: string): Promise<PaymentLink> => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await client(`/payment-links/admin/${token}`, {
        method: 'GET'
      });
      
      return response;
    } catch (err) {
      console.error('Error fetching payment link details:', err);
      error.value = 'Failed to fetch payment link details';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const resendPaymentLink = async (token: string): Promise<void> => {
    loading.value = true;
    error.value = null;
    
    try {
      await client(`/payment-links/resend/${token}`, {
        method: 'POST'
      });
      
      // Update last_accessed timestamp in local state
      const linkIndex = paymentLinks.value.findIndex(link => link.token === token);
      if (linkIndex !== -1) {
        paymentLinks.value[linkIndex].last_accessed = new Date().toISOString();
      }
    } catch (err) {
      console.error('Error resending payment link:', err);
      error.value = 'Failed to resend payment link';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const cancelPaymentLink = async (token: string): Promise<void> => {
    loading.value = true;
    error.value = null;
    
    try {
      await client(`/payment-links/cancel/${token}`, {
        method: 'POST'
      });
      
      // Update status in local state
      const linkIndex = paymentLinks.value.findIndex(link => link.token === token);
      if (linkIndex !== -1) {
        paymentLinks.value[linkIndex].status = 'expired';
      }
    } catch (err) {
      console.error('Error cancelling payment link:', err);
      error.value = 'Failed to cancel payment link';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Getters
  const getPendingLinks = computed(() => 
    paymentLinks.value.filter(link => link.status === 'pending')
  );

  const getCompletedLinks = computed(() => 
    paymentLinks.value.filter(link => link.status === 'completed')
  );

  const getExpiredLinks = computed(() => 
    paymentLinks.value.filter(link => link.status === 'expired')
  );

  const getTotalRevenue = computed(() => 
    paymentLinks.value
      .filter(link => link.status === 'completed')
      .reduce((sum, link) => sum + link.amount, 0)
  );

  // Utilities
  const getPaymentUrl = (token: string): string => {
    const baseUrl = process.client ? window.location.origin : 'https://recital.reverence.dance';
    return `${baseUrl}/purchase-digital/${token}`;
  };

  const isExpired = (paymentLink: PaymentLink): boolean => {
    return new Date(paymentLink.expires_at) < new Date();
  };

  const clearError = (): void => {
    error.value = null;
  };

  const clearCurrentPaymentLink = (): void => {
    currentPaymentLink.value = null;
  };

  return {
    // State
    paymentLinks: readonly(paymentLinks),
    currentPaymentLink: readonly(currentPaymentLink),
    loading: readonly(loading),
    error: readonly(error),
    
    // Actions
    fetchPaymentLinks,
    createPaymentLink,
    validatePaymentLink,
    initiatePayment,
    completePayment,
    getPaymentLinkDetails,
    resendPaymentLink,
    cancelPaymentLink,
    
    // Getters
    getPendingLinks,
    getCompletedLinks,
    getExpiredLinks,
    getTotalRevenue,
    
    // Utilities
    getPaymentUrl,
    isExpired,
    clearError,
    clearCurrentPaymentLink
  };
});