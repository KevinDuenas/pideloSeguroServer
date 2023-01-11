import { User, Config, Trip } from "@db/models";
import resolveTrip from "@graphql/resolvers/trip";
import { pubSub } from "@connections/firebase";

const tripSubscriptions = {
  newTrip: {
    subscribe: () => {
      return pubSub.asyncIterator("newTrip");
    },
    resolve: async (payload) => {
      const trip = await Trip.findOne({ _id: payload });
      return trip;
    },
  },
};

export default tripSubscriptions;
