import { VerificationRequest, User } from "@db/models";
import { auth } from "@graphql/resolvers/utils";

const verificationRequestMutations = {
  createDriverVerificationRequest: async (_, __, { user: { id }, loaders }) => {
    const user = await User.findOne({ _id: id });
    const activeRequest = await VerificationRequest.findOne({
      driver: id,
      status: "REVIEW_PENDING",
      type: "DRIVER_REQUEST",
    });

    if (!user) throw new Error("Driver not found");
    if (activeRequest) throw new Error("Driver has an active request.");

    const newRequest = new VerificationRequest({
      folio: "PRUEBA",
      driver: id,
    });

    await newRequest.save();
    return true;
  },
};

export default verificationRequestMutations;
