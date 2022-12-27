import { userQueries, userMutations, userFields } from "./user";
import { configMutations, configQueries } from "./config";
import { AWSQueries } from "./aws";

const resolvers = {
  Query: {
    ...userQueries,
    ...configQueries,
    ...AWSQueries,
    serverDate: () => new Date(),
  },
  Mutation: {
    ...userMutations,
    ...configMutations,
  },
};

export default resolvers;
