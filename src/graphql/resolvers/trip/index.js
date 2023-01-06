import tripQueries from "./queries";
import tripMutations from "./mutations";
import tripFields from "./fields";

const resolveTrip = {
  one: (trip, loaders) => {
    // Note: Aggregation results do not have a toObject property
    const tripObject = trip?.toObject?.() ?? trip;

    return {
      ...tripObject,
      id: tripObject._id,
    };
  },
  many: (trips, loaders) => trips.map((trip) => resolveTrip.one(trip, loaders)),
};

export { tripQueries, tripMutations, tripFields };
export default resolveTrip;
