import { Payment } from "@db/models";
import { defaultParams } from "@config/constants";
import resolvePayment from "@graphql/resolvers/payment";
import { UserAgent } from "express-useragent";

const paymentQueries = {
  payments: async (
    _,
    { params = defaultParams },
    { loaders, user: { id } }
  ) => {
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
  driverBalance: async (_, __, { loaders, user: { id } }) => {
    // const driver = await User.findOne({ _id: id, overallRole: "DRIVER" });
    // if (!driver) throw new Error("Driver not found.");
    let driverBalance = {
      balance: 100.0,
      prevMonth: 50.0,
      recharges: 150.0,
      fees: 100.0,
    };
    return driverBalance;
  },
  driverPayments: async (_, __, { loaders, user: { id } }) => {
    const payments = await Payment.find({ user: id, deleted: false }).sort({
      createdAt: "desc",
    });
    return resolvePayment.many(payments, loaders);
  },
};

export default paymentQueries;
