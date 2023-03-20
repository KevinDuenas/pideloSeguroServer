import { Trip, User } from "@db/models";
import cron from "node-cron";
import * as geofirestore from "geofirestore";
import fb from "firebase-admin";
import { firestoreDB } from "@connections/firebase";
import tripsHelper from "@graphql/resolvers/utils/trips";
import { notifications } from "./utils";
import { cronjobs } from "@config/loggers";
const GeoFirestore = geofirestore.initializeApp(firestoreDB);
const geocollection = GeoFirestore.collection("driversLocation");
const activeDriversDB = firestoreDB.collection("drivers");
const activeTripsDB = firestoreDB.collection("activeTrips");

const startTripsCronjobs = async () => {
  try {
    check_trips.start();
    cancel_timeout_trips.start();
    cronjobs.success("⏱️ Trips cronjobs started succefully");
  } catch (err) {
    cronjobs.error("Trips cronjobs cannot started", err);
  }
};

const check_trips = cron.schedule(
  "* * * * *",
  async () => {
    cronjobs.success("Starting check_trips cronjob");
    const pendingTrips = await Trip.find({
      status: { $in: ["DRIVER_PENDING", "ACTIVE"] },
    });
    try {
      for (let trip of pendingTrips) {
        let storeGeo = trip.destinations[0].geolocation.coordinates;
        let destinationGeo = trip.destinations[1].geolocation.coordinates;
        const query = geocollection.near({
          center: new fb.firestore.GeoPoint(storeGeo[0], storeGeo[1]),
          radius: 5,
        });
        const { cost, meters } = await tripsHelper.calculateCost(
          storeGeo,
          destinationGeo
        );
        let firebaseTrip = {
          shippingCost: cost,
          meters,
          ticketTotal: trip.onerpInfo.ticketTotal,
          tripId: trip._id.toString(),
          onerpCost: Math.round(cost * 0.15),
        };
        let firebaseActiveTrip = {
          tripId: trip._id.toString(),
          status: "DRIVER_PENDING",
          storeId: trip.onerpInfo.storeId.toString(),
          ticketId: trip.onerpInfo.ticketId.toString(),
          tripType: "FOOD_DELIVERY",
          folio: trip.folio,
        };
        await activeTripsDB.doc(trip._id.toString()).set(firebaseActiveTrip);
        // Set trip to all drivers at 5 KM
        query.get().then(async (value) => {
          for (let driver of value.docs) {
            let driverInfo = driver.data();
            const driverData = await User.findOne({ _id: driverInfo.driverId });
            await activeDriversDB.doc(driverInfo.driverId).set(firebaseTrip);
            if (driverData.pushNotificationToken) {
              notifications.send(
                driverData.pushNotificationToken,
                "Nuevo viaje disponible 🍽️",
                "Ver detalle"
              );
            }
          }
        });
      }
      cronjobs.success("Finishing check_trips cronjob");
    } catch (err) {
      cronjobs.error("Error at check_trips cronjob", err);
    }
  },
  {
    scheduled: false,
  }
);

const cancel_timeout_trips = cron.schedule(
  "30 * * * * *",
  async () => {
    cronjobs.success("Starting cancel_timeout_trips cronjob");

    try {
      var fiveMinuteAgo = new Date(Date.now() - 1000 * (60 * 5));
      const pendingTrips = await Trip.find({
        status: { $in: ["DRIVER_PENDING", "ACTIVE"] },
        createdAt: { $lte: fiveMinuteAgo },
      });

      for (let trip of pendingTrips) {
        const canceledTrip = await Trip.findOneAndUpdate(
          {
            _id: trip.id,
            status: "DRIVER_PENDING",
            driver: { $exists: false },
            tripStartedAt: { $exists: false },
          },
          {
            status: "CANCELED",
          },
          {
            new: true,
          }
        );
        //if (!canceledTrip) throw new Error("Trip cannot be canceled.");
        let jobskill_query = await activeDriversDB.where(
          "tripId",
          "==",
          trip._id.toString()
        );
        jobskill_query.get().then(async (querySnapshot) => {
          await querySnapshot.forEach(async (doc) => {
            await doc.ref.delete();
          });
        });
        let update_query = await activeTripsDB.where(
          "tripId",
          "==",
          trip._id.toString()
        );
        update_query.get().then(async (querySnapshot) => {
          await querySnapshot.forEach(async (doc) => {
            await doc.ref.delete();
          });
        });
      }
      cronjobs.success("Finishing cancel_timeout_trips cronjob");
    } catch (err) {
      cronjobs.error("Error at cancel_timeout_trips cronjob", err);
    }
  },
  {
    scheduled: false,
  }
);

export { check_trips, cancel_timeout_trips, startTripsCronjobs };
