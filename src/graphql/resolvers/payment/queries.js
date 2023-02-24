import { Payment } from "@db/models";
import resolvePayment from "@graphql/resolvers/payment";

const paymentQueries = {
  driverPayments: async (_, __, { loaders, user: { id } }) => {
    const payments = await Payment.find({ user: id, deleted: false }).sort({
      createdAt: "desc",
    });
    return resolvePayment.many(payments, loaders);
  },
};

export default paymentQueries;
