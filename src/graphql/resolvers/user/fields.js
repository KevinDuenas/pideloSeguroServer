import { User, VerificationRequest, Config, Trip } from "@db/models";
import resolveTrip from "@graphql/resolvers/trip";

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
      const openTrip = await Trip({
        driver: userId,
        tripEndedAt: { $exists: false },
        status: "ACTIVE",
      });
      if (!openTrip) {
        return null;
      }
      return resolveTrip.one(openTrip, loaders);
    },
  },
};

export default userFields;
