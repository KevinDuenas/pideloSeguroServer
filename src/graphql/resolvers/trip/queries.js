import { User, Config, Trip } from "@db/models";
import { defaultParams } from "@config/constants";
import resolveTrip from "@graphql/resolvers/trip";

const tripQueries = {
  driverTrips: async (
    _,
    { params = defaultParams },
    { loaders, user: { id } }
  ) => {
    const query = {
      deleted: false,
      driver: id,
    };
    return {
      results: async () => {
        const { page, pageSize } = params;
        const tripsPromise = Trip.find(query)
          .skip(pageSize * (page - 1))
          .limit(pageSize);
        tripsPromise.sort({ createdAt: "desc" });
        const results = await tripsPromise;
        return resolveTrip.many(results, loaders);
      },
      count: () => Trip.countDocuments(query),
      params,
    };
  },
  trip: async (_, { tripId }, { loaders, user: { id } }) => {
    const trip = await Trip.findOne({ _id: tripId, deleted: false });
    if (!trip) throw new Error("Trip was not found.");
    return resolveTrip.one(trip, loaders);
  },
  trips: async (_, { params = defaultParams }, { loaders, user: { id } }) => {
    const query = {
      deleted: false,
    };

    return {
      results: async () => {
        const { page, pageSize } = params;
        const tripsPromise = Trip.find(query)
          .skip(pageSize * (page - 1))
          .limit(pageSize);
        tripsPromise.sort({ createdAt: "desc" });
        const results = await tripsPromise;
        return resolveTrip.many(results, loaders);
      },
      count: () => Trip.countDocuments(query),
      params,
    };
  },
};

export default tripQueries;
