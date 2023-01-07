import { userQueries, userMutations, userFields } from "./user";
import { configMutations, configQueries } from "./config";
import { tripMutations, tripQueries } from "./trip";
import {
  verificationRequestMutations,
  verificationRequestQueries,
  verificationRequestFields,
} from "./verificationRequest";
import { AWSQueries } from "./aws";

const resolvers = {
  Query: {
    ...userQueries,
    ...configQueries,
    ...tripQueries,
    ...verificationRequestQueries,
    ...AWSQueries,
    serverDate: () => new Date(),
  },
  Mutation: {
    ...userMutations,
    ...configMutations,
    ...tripMutations,
    ...verificationRequestMutations,
  },
  ...userFields,
  ...verificationRequestFields,
};

export default resolvers;
