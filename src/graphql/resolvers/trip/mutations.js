import { User, Config, Trip } from "@db/models";
import resolveTrip from "@graphql/resolvers/trip";
import { pubSub } from "@connections/firebase";

const tripMutations = {
  requestTrip: async (_, { request }, { user: { id }, loaders }) => {
    const { destinations, onerpInfo, tripType } = request;
    // if (destinations.length < 2)
    //   throw new Error(
    //     "Destinations must have at least 2 destinations. Starting point and ending point."
    //   );

    const newTrip = new Trip({
      destinations,
      onerpInfo,
      tripType,
      cost: 0.9,
      meters: 20.3,
      status: "DRIVER_PENDING",
    });

    await newTrip.save();
    await pubSub.publish("newTrip", newTrip._id.toString());
    return resolveTrip.one(newTrip, loaders);
  },
};

export default tripMutations;
