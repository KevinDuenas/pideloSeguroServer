import { User, Config, Trip } from "@db/models";
import resolveTrip from "@graphql/resolvers/trip";
import { firestoreDB } from "@connections/firebase";
const activeDriversDB = firestoreDB.collection("drivers");
const activeTripsDB = firestoreDB.collection("activeTrips");

const tripMutations = {
  acceptTrip: async (_, { tripId }, { user: { id }, loaders }) => {
    const driver = await User.findOne({ _id: id });
    const activeDriverTrip = await Trip.findOne({
      driver: id,
      status: "ACTIVE",
      tripStartedAt: { $exists: true },
      tripEndedAt: { $exists: false },
    });

    if (!id) throw new Error("Driver token is required.");
    if (!driver) throw new Error("Driver was not found.");
    if (activeDriverTrip) {
      await activeDriversDB.doc(id).delete();
      throw new Error("Driver has an active drive.");
    }

    const trip = await Trip.findOneAndUpdate(
      {
        _id: tripId,
        driver: { $exists: false },
        tripStartedAt: { $exists: false },
        status: "DRIVER_PENDING",
      },
      {
        driver: id,
        tripStartedAt: Date.now(),
        status: "ACTIVE",
      },
      { new: true }
    );
    if (!trip) throw new Error("Trip is not available any more.");
    let jobskill_query = await activeDriversDB.where("tripId", "==", tripId);
    jobskill_query.get().then(async (querySnapshot) => {
      await querySnapshot.forEach(async (doc) => {
        await doc.ref.delete();
      });
    });
    let update_query = await activeTripsDB.where("tripId", "==", tripId);
    update_query.get().then(async (querySnapshot) => {
      await querySnapshot.forEach(async (doc) => {
        await doc.ref.update({ status: "ACTIVE" });
      });
    });
    return resolveTrip.one(trip, loaders);
  },

  denyTrip: async (_, { tripId }, { user: { id }, loaders }) => {
    if (!id) throw new Error("Driver token is required.");
    await activeDriversDB.doc(id).delete();
    return true;
  },
  endTrip: async (_, { tripId }, { user: { id }, loaders }) => {
    if (!id) throw new Error("Driver token is required.");
    const trip = await Trip.findOneAndUpdate(
      {
        _id: tripId,
        driver: id,
        tripStartedAt: { $exists: true },
        status: "ACTIVE",
        deleted: false,
      },
      {
        status: "CLOSED",
        tripEndedAt: Date.now(),
      }
    );
    if (!trip) throw new Error("Trip was not found.");
    let update_query = await activeTripsDB.where("tripId", "==", tripId);
    update_query.get().then(async (querySnapshot) => {
      await querySnapshot.forEach(async (doc) => {
        await doc.ref.delete();
      });
    });
    return true;
  },
};

export default tripMutations;
