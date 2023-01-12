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
  acceptTrip: async (_, { tripId }, { user: { id }, loaders }) => {
    if (!id) throw new Error("Driver token is required.");
    const trip = await Trip.findOne({
      _id: tripId,
      driver: { $exists: false },
      tripStartedAt: { $exists: false },
    });
    if (!trip) throw new Error("Trip is not available any more.");
    trip.driver = id;
    trip.tripStartedAt = Date.now();
    trip.status = "ACTIVE";
    const savedTrip = await trip.save();
    return resolveTrip.one(savedTrip, loaders);
  },
};

export default tripMutations;
