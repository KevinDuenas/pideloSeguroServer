import { Payment } from "@db/models";
import resolvePayment from "@graphql/resolvers/payment";

const paymentQueries = {
  payments: async (_, { params }, { loaders, user: { id } }) => {
    const query = {
      deleted: false,
    };
    return {
      results: async () => {
        const { page, pageSize } = params;
        const paymentPromise = Payment.find(query)
          .skip(pageSize * (page - 1))
          .limit(pageSize)
          .sort({ createdAt: -1 });

        const results = await paymentPromise;
        return resolvePayment.many(results, loaders);
      },
      count: () => Payment.countDocuments(query),
      params,
    };
  },
  driverPayments: async (_, __, { loaders, user: { id } }) => {
    const payments = await Payment.find({ user: id, deleted: false }).sort({
      createdAt: "desc",
    });
    return resolvePayment.many(payments, loaders);
  },
};

export default paymentQueries;
