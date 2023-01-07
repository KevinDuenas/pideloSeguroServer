import { VerificationRequest } from "@db/models";
import resolveVerificationRequest from "@graphql/resolvers/verificationRequest";
import { defaultParams } from "@config/constants";
import { buildQuery, buildSearch } from "@graphql/resolvers/utils";

const verificationRequestQueries = {
  //   driverDocuments: async (_, __, { loaders, user: { id } }) => {
  //     const config = await Config.findOne({});
  //     return n
  //   },
};

export default verificationRequestQueries;
