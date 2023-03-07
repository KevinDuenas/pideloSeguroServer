import {
  User,
  VerificationRequest,
  Config,
  Trip,
  Automobile,
  Payment,
} from "@db/models";
import resolveTrip from "@graphql/resolvers/trip";
import resolveAutomobile from "@graphql/resolvers/automobile";
import stripe from "@connections/stripe";
import { Types } from "mongoose";

const userFields = {
  User: {
    status: async (_, __, { loaders, user: { id: userId } }) => {
      const activeRequest = await VerificationRequest.find({
        driver: userId,
        type: "DRIVER_REQUEST",
      })
        .sort({ createdAt: -1 })
        .limit(1);
      if (activeRequest.length === 0) return "MISSING";
      if (activeRequest[0].status === "APPROVED") return "APPROVED";
      if (activeRequest[0].status === "REVIEW_PENDING") return "PENDING";
      return "MISSING";
    },
    requestReady: async (_, __, { loaders, user: { id: userId } }) => {
      const activeRequest = await VerificationRequest.find({
        driver: userId,
        type: "DRIVER_REQUEST",
      })
        .sort({ createdAt: -1 })
        .limit(1);

      if (activeRequest[0]?.status === "APPROVED") return null;

      const { driverDocuments } = await Config.findOne({});
      const user = await User.findOne({ _id: userId });
      if (driverDocuments.length !== user.documents.length) return false;
      if (
        !user.firstName ||
        !user.firstLastName ||
        !user.secondLastName ||
        !user.email
      )
        return false;
      return true;
    },
    activeTrip: async (_, __, { loaders, user: { id: userId } }) => {
      const openTrip = await Trip.findOne({
        driver: userId,
        tripEndedAt: { $exists: false },
        status: {
          $in: ["ACTIVE", "DRIVER_PENDING", "FOOD_PENDING", "AT_DELIVER"],
        },
      });
      if (!openTrip) {
        return null;
      }
      return resolveTrip.one(openTrip, loaders);
    },
    automobile: async (_, __, { loaders, user: { id: userId } }) => {
      const automobile = await Automobile.findOne({
        driver: userId,
        deleted: false,
      });

      if (!automobile) return null;
      return resolveAutomobile.one(automobile, loaders);
    },
    defaultPaymentMethod: async (
      { stripeCustomerId },
      __,
      { loaders, user: { id: userId } }
    ) => {
      if (!stripeCustomerId) return null;

      const paymentMethod = await stripe.paymentMethods.list({
        customer: stripeCustomerId,
        type: "card",
      });
      const paymentId = paymentMethod?.data[0]?.id;
      const card = paymentMethod?.data[0]?.card;
      if (!card) return null;
      return {
        expYear: card.exp_year,
        expMonth: card.exp_month,
        lastFourDigits: card.last4,
        brand: card.brand,
        stripeId: paymentId,
      };
    },
    balance: async (_, __, { loaders, user: { id: userId } }) => {
      let incomes = await Payment.aggregate([
        {
          $match: {
            deleted: false,
            user: Types.ObjectId(userId),
            status: "SUCCEEDED",
          },
        },
        {
          $group: {
            _id: "incomes",
            amount: { $sum: "$amount" },
          },
        },
      ]);
      let outcomes = await Trip.aggregate([
        {
          $match: {
            deleted: false,
            driver: Types.ObjectId(userId),
          },
        },
        {
          $group: {
            _id: "outcomes",
            amount: { $sum: "$psFee" },
          },
        },
      ]);
      incomes = incomes[0]?.amount ?? 0;
      outcomes = outcomes[0]?.amount ?? 0;
      const balance = incomes - outcomes;
      await User.findOneAndUpdate({ _id: userId }, { balance });
      return balance;
    },
  },
};

export default userFields;
