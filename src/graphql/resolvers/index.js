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
import { serviceMutations, serviceQueries, serviceFields } from "./service";
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
    ...serviceQueries,
    serverDate: () => new Date(),
  },
  Mutation: {
    ...userMutations,
    ...configMutations,
    ...tripMutations,
    ...verificationRequestMutations,
    ...automobileMutations,
    ...paymentMutations,
    ...serviceMutations,
  },
  Subscription: {
    ...tripSubscriptions,
  },
  ...userFields,
  ...tripFields,
  ...verificationRequestFields,
  ...automobileFields,
  ...serviceFields,
};

export default resolvers;
