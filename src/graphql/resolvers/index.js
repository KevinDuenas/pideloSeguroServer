import { userQueries, userMutations, userFields } from "./user";
import { configMutations, configQueries } from "./config";
import {
  tripMutations,
  tripQueries,
  tripSubscriptions,
  tripFields,
} from "./trip";
import {
  verificationRequestMutations,
  verificationRequestQueries,
  verificationRequestFields,
} from "./verificationRequest";
import {
  automobileMutations,
  automobileQueries,
  automobileFields,
} from "./automobile";
import { AWSQueries } from "./aws";
import { reportsQueries } from "./reports";
import { paymentMutations, paymentQueries } from "./payment";

const resolvers = {
  Query: {
    ...userQueries,
    ...configQueries,
    ...tripQueries,
    ...verificationRequestQueries,
    ...AWSQueries,
    ...reportsQueries,
    ...automobileQueries,
    ...paymentQueries,
    serverDate: () => new Date(),
  },
  Mutation: {
    ...userMutations,
    ...configMutations,
    ...tripMutations,
    ...verificationRequestMutations,
    ...automobileMutations,
    ...paymentMutations,
  },
  Subscription: {
    ...tripSubscriptions,
  },
  ...userFields,
  ...tripFields,
  ...verificationRequestFields,
  ...automobileFields,
};

export default resolvers;
