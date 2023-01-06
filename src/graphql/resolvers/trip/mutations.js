import { User, Config, Trip } from "@db/models";
import resolveTrip from "@graphql/resolvers/trip";

const tripMutations = {
  requestTrip: async (_, { request }, { user: { id }, loaders }) => {
    const { destinations, onerpInfo, tripType } = request;

    if (destinations.length < 2)
      throw new Error(
        "Destinations must have at least 2 destinations. Starting point and ending point."
      );

    const newTrip = new Trip({ destinations, onerpInfo, tripType });

    return null;
  },
};

export default tripMutations;
