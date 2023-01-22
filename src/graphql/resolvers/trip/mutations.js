import { User, Config, Trip } from "@db/models";
import resolveTrip from "@graphql/resolvers/trip";
import { pubSub } from "@connections/firebase";
import { firestoreDB } from "@connections/firebase";
const activeDriversDB = firestoreDB.collection("drivers");

const tripMutations = {
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
    let jobskill_query = await activeDriversDB.where("tripId", "==", tripId);
    jobskill_query.get().then(async (querySnapshot) => {
      await querySnapshot.forEach(async (doc) => {
        await doc.ref.delete();
      });
    });
    return resolveTrip.one(savedTrip, loaders);
  },

  denyTrip: async (_, { tripId }, { user: { id }, loaders }) => {
    if (!id) throw new Error("Driver token is required.");
    await activeDriversDB.doc(id).delete();
    return true;
  },
};

export default tripMutations;
