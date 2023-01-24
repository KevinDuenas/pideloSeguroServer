import { Router } from "express";
import { User, Config, Trip } from "@db/models";
import * as geofirestore from "geofirestore";
import fb from "firebase-admin";
import { firestoreDB } from "@connections/firebase";
import tripsHelper from "@graphql/resolvers/utils/trips";

const onerp = Router();
const GeoFirestore = geofirestore.initializeApp(firestoreDB);
const geocollection = GeoFirestore.collection("driversLocation");
const activeDriversDB = firestoreDB.collection("drivers");
const activeTripsDB = firestoreDB.collection("activeTrips");

onerp.post("/requestTrip", async (req, res) => {
  const { destinations, onerpInfo, tripType } = req.body;

  try {
    let storeGeo = destinations[0].geolocation.coordinates;
    let destinationGeo = destinations[1].geolocation.coordinates;
    const query = geocollection.near({
      center: new fb.firestore.GeoPoint(storeGeo[0], storeGeo[1]),
      radius: 5000,
    });

    const { cost, meters } = await tripsHelper.calculateCost(
      storeGeo,
      destinationGeo
    );

    const newTrip = new Trip({
      destinations,
      onerpInfo,
      tripType,
      cost,
      meters,
      status: "DRIVER_PENDING",
    });

    let firebaseTrip = {
      shippingCost: cost,
      meters,
      ticketTotal: onerpInfo.ticketTotal,
      tripId: newTrip._id.toString(),
      onerpCost: Math.round(cost * 0.15),
    };

    let firebaseActiveTrip = {
      tripId: newTrip._id.toString(),
      status: "DRIVER_PENDING",
      storeId: onerpInfo.storeId,
      ticketId: onerpInfo.ticketId,
      tripType: "FOOD_DELIVERY",
    };

    await newTrip.save();
    await activeTripsDB.doc(newTrip._id.toString()).set(firebaseActiveTrip);
    query.get().then(async (value) => {
      for (let driver of value.docs) {
        let driverInfo = driver.data();
        await activeDriversDB.doc(driverInfo.driverId).set(firebaseTrip);
      }
    });
    return res.status(201).send(newTrip);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

onerp.get("/activeTrips", async (req, res) => {
  const { storeId } = req.body;

  try {
    const trips = await Trip.find({
      "onerpInfo.storeId": storeId,
      status: { $in: ["DRIVER_PENDING", "ACTIVE"] },
    }).sort({ createdAt: "desc" });

    return res.status(200).send(trips);
  } catch (err) {
    return res.status(500).json(err);
  }
});

onerp.put("/cancelTrip", async (req, res) => {
  const { tripId } = req.body;

  try {
    const canceledTrip = await Trip.findOneAndUpdate(
      {
        _id: tripId,
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
    if (!canceledTrip) throw new Error("Trip cannot be canceled.");
    let jobskill_query = await activeDriversDB.where("tripId", "==", tripId);
    jobskill_query.get().then(async (querySnapshot) => {
      await querySnapshot.forEach(async (doc) => {
        await doc.ref.delete();
      });
    });
    let update_query = await activeTripsDB.where("tripId", "==", tripId);
    update_query.get().then(async (querySnapshot) => {
      await querySnapshot.forEach(async (doc) => {
        await doc.ref.delete();
      });
    });
    return res.status(202).send({ tripCanceled: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

export default onerp;
