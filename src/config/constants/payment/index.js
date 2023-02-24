const paymentStatus = {
  SUCCEEDED: "Exitoso",
  FAILED: "Fallido",
  PROCESSING: "Procesando",
  INITIALIZED: "Inicializado",
};

const paymentMethod = {
  STRIPE: "Stripe",
  DEPOSIT: "Depósito",
};

const paymentType = {
  DRIVER_RECHARGE: "Recarga de conductor",
};

export { paymentStatus, paymentMethod, paymentType };
