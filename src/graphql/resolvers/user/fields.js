import { User, VerificationRequest } from "@db/models";

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
  },
};

export default userFields;
