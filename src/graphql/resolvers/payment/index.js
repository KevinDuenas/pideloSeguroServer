import paymentMutations from "./mutations";
import paymentQueries from "./queries";

const resolvePayment = {
  one: (payment, loaders) => {
    // Note: Aggregation results do not have a toObject property
    const paymentObject = payment?.toObject?.() ?? payment;

    return {
      ...paymentObject,
      id: paymentObject._id,
    };
  },
  many: (payments, loaders) =>
    payments.map((payment) => resolvePayment.one(payment, loaders)),
};

export { paymentMutations, paymentQueries };
export default resolvePayment;
