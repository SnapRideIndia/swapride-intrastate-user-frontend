import RazorpayCheckout from 'react-native-razorpay';

export interface RazorpayPaymentOptions {
  keyId: string; // always provided by backend (razorpayKeyId)
  amount: number; // in INR — service converts to paise internally
  currency: string;
  orderId: string; // razorpayOrderId from backend
  name?: string;
  description?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  themeColor?: string;
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

export interface RazorpayError {
  code: number; // code === 0 means user cancelled
  description: string;
}

class RazorpayService {
  /**
   * Opens the Razorpay payment checkout sheet.
   * Amount is converted from INR → paise internally.
   * Resolves with RazorpaySuccessResponse on payment success.
   * Rejects with RazorpayError on failure or user cancellation.
   */
  openCheckout = async (
    options: RazorpayPaymentOptions,
  ): Promise<RazorpaySuccessResponse> => {
    const checkoutOptions = {
      key: options.keyId,
      amount: options.amount * 100, // INR → paise
      currency: options.currency,
      name: options.name || 'SwapRide',
      description: options.description || '',
      order_id: options.orderId,
      prefill: options.prefill || {},
      theme: { color: options.themeColor || '#1B2B8A' },
    };

    console.log('RazorpayService: opening checkout ===>', checkoutOptions);

    const response = await RazorpayCheckout.open(checkoutOptions);

    console.log('RazorpayService: payment success ===>', response);

    return response;
  };

  /**
   * Returns true if the error was a user-initiated cancellation.
   */
  isCancellation = (error: RazorpayError): boolean => error?.code === 0;
}

export default new RazorpayService();
