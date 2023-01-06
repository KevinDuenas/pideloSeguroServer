import { userQueries, userMutations, userFields } from "./user";
import { configMutations, configQueries } from "./config";
import { tripMutations, tripQueries } from "./trip";
import { AWSQueries } from "./aws";

const resolvers = {
  Query: {
    ...userQueries,
    ...configQueries,
    ...tripQueries,
    ...AWSQueries,
    serverDate: () => new Date(),
  },
  Mutation: {
    ...userMutations,
    ...configMutations,
    ...tripMutations,
  },
};

export default resolvers;
