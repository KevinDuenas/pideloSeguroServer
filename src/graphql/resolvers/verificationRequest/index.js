import verificationRequestQueries from "./queries";
import verificationRequestMutations from "./mutations";

const resolveVerificationRequest = {
  one: (verificationRequest, loaders) => {
    // Note: Aggregation results do not have a toObject property
    const verificationRequestObject =
      verificationRequest?.toObject?.() ?? verificationRequest;

    return {
      ...verificationRequestObject,
      id: verificationRequestObject._id,
    };
  },
};

export { verificationRequestQueries, verificationRequestMutations };
export default resolveVerificationRequest;
