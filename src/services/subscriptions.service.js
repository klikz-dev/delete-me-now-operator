import axios from "axios";

export const stripeGetSubscriptionService = async (subscriptionId) => {
  try {
    return await axios.get(
      `${window.$server_url}/admin/subscriptions/subscription/${subscriptionId}`
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const stripeGetInvoicesService = async (subscriptionId) => {
  try {
    return await axios.get(
      `${window.$server_url}/admin/subscriptions/invoices/${subscriptionId}`
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const stripeGetProductsService = async () => {
  try {
    return await axios.get(
      `${window.$server_url}/admin/subscriptions/products`
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const stripeGetPaymentByIdService = async (paymentMethodId) => {
  try {
    return await axios.get(
      `${window.$server_url}/admin/subscriptions/payments/${paymentMethodId}`
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const stripeGetPricesService = async () => {
  try {
    return await axios.get(`${window.$server_url}/admin/subscriptions/prices`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const stripeRetrieveCustomersService = async () => {
  try {
    return await axios.get(
      `${window.$server_url}/admin/subscriptions/customers`
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const stripeGetCustomerByEmailService = async (email) => {
  try {
    return await axios.post(
      `${window.$server_url}/admin/subscriptions/customers/get`,
      { email: email }
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const stripeAddCustomerService = async (email, name) => {
  try {
    return await axios.post(
      `${window.$server_url}/admin/subscriptions/customers/add`,
      { email: email, name: name }
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const stripeAddPriceService = async (
  unit_amount,
  currency,
  recurring,
  product
) => {
  try {
    return await axios.post(
      `${window.$server_url}/admin/subscriptions/prices/add`,
      {
        unit_amount: unit_amount,
        currency: currency,
        recurring: recurring,
        product: product,
      }
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const stripeCreateSubscriptionService = async (
  customerId,
  paymentMethodId,
  priceId
) => {
  try {
    return await axios.post(
      `${window.$server_url}/admin/subscriptions/create`,
      {
        customerId: customerId,
        paymentMethodId: paymentMethodId,
        priceId: priceId,
      }
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const stripeUpdateSubscriptionService = async (
  customerId,
  paymentMethodId,
  invoiceId
) => {
  try {
    return await axios.post(
      `${window.$server_url}/admin/subscriptions/update`,
      {
        customerId: customerId,
        paymentMethodId: paymentMethodId,
        invoiceId: invoiceId,
      }
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const stripeCancelSubscriptionService = async (subscriptionId) => {
  try {
    return await axios.post(
      `${window.$server_url}/admin/subscriptions/cancel`,
      {
        subscriptionId: subscriptionId,
      }
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};
