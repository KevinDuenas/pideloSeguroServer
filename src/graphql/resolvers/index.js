import { userQueries, userMutations, userFields } from "./user";
import { configMutations, configQueries } from "./config";

const resolvers = {
  Query: {
    ...userQueries,
    ...configQueries,
    serverDate: () => new Date(),
  },
  Mutation: {
    ...userMutations,
    ...configMutations,
  },
};

export default resolvers;
