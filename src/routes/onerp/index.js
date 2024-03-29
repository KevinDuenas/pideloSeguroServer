import { Router } from "express";
import { User, Config, Trip, Folio } from "@db/models";
import * as geofirestore from "geofirestore";
import fb from "firebase-admin";
import { firestoreDB } from "@connections/firebase";
import tripsHelper from "@graphql/resolvers/utils/trips";
import { folio } from "@graphql/resolvers/utils/folio";
import { pideloSeguroApiKey } from "@config/environment";
import { notifications } from "./utils";

const onerp = Router();
const GeoFirestore = geofirestore.initializeApp(firestoreDB);
const geocollection = GeoFirestore.collection("driversLocation");
const activeDriversDB = firestoreDB.collection("drivers");
const activeTripsDB = firestoreDB.collection("activeTrips");

onerp.post("/requestTrip", async (req, res) => {
  let accessToken;
  if (!req.headers.authorization) return res.status(401).send();
  if (req.headers.authorization)
    [, accessToken] = req.headers.authorization.split("psApiKey ");
  if (accessToken !== pideloSeguroApiKey)
    return res.status(401).send({ message: "Api key is not valid." });

  const { destinations, onerpInfo, tripType } = req.body;
  try {
    let storeGeo = destinations[0].geolocation.coordinates;
    let destinationGeo = destinations[1].geolocation.coordinates;
    const query = geocollection.near({
      center: new fb.firestore.GeoPoint(storeGeo[0], storeGeo[1]),
      radius: 5,
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
      psFee: Math.round(cost * 0.15),
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

    const nextFolio = await folio.foodDelivery();
    newTrip.folio = nextFolio;
    firebaseActiveTrip.folio = nextFolio;
    firebaseTrip.folio = nextFolio;

    await newTrip.save();

    // Set active trip on firebase
    await activeTripsDB.doc(newTrip._id.toString()).set(firebaseActiveTrip);

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
    return res.status(201).send(newTrip);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

onerp.get("/activeTrips", async (req, res) => {
  const { storeId } = req.query;
  let accessToken;
  if (!req.headers.authorization) return res.status(401).send();
  if (req.headers.authorization)
    [, accessToken] = req.headers.authorization.split("psApiKey ");
  if (accessToken !== pideloSeguroApiKey)
    return res.status(401).send({ message: "Api key is not valid." });
  try {
    const trips = await Trip.find({
      "onerpInfo.storeId": storeId,
      status: {
        $in: ["DRIVER_PENDING", "ACTIVE", "FOOD_PENDING", "AT_DELIVER"],
      },
    }).sort({ createdAt: "desc" });

    const loadedTripsPromises = await trips.map(async (trip) => {
      let driver = await User.findOne({ _id: trip.driver });

      const loadedTrip = await {
        ...trip._doc,
        driver: driver ? { ...driver._doc, id: driver._id } : trip.driver,
      };
      return loadedTrip;
    });
    Promise.all(loadedTripsPromises).then((results) => {
      return res.status(200).send(results);
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

onerp.put("/updateTrip", async (req, res) => {
  const { tripId, status } = req.body;
  let accessToken;
  if (!req.headers.authorization) return res.status(401).send();
  if (req.headers.authorization)
    [, accessToken] = req.headers.authorization.split("psApiKey ");
  if (accessToken !== pideloSeguroApiKey)
    return res.status(401).send({ message: "Api key is not valid." });
  try {
    if (status !== "AT_DELIVER") return res.status(401).send();
    const trip = await Trip.findOneAndUpdate(
      {
        _id: tripId,
        driver: { $exists: true },
      },
      {
        status,
      },
      { new: true }
    );

    if (!trip) {
      return res.status(404).send();
    }
    return res.status(200).send(trip);
  } catch (err) {
    return res.status(500).json(err);
  }
});

onerp.get("/trip", async (req, res) => {
  const { tripId } = req.query;
  // let accessToken;
  // if (!req.headers.authorization) return res.status(401).send();
  // if (req.headers.authorization)
  //   [, accessToken] = req.headers.authorization.split("psApiKey ");
  // if (accessToken !== pideloSeguroApiKey)
  //   return res.status(401).send({ message: "Api key is not valid." });
  try {
    const trip = await Trip.findOne({
      _id: tripId,
    });

    if (!trip) {
      return res.status(404).send();
    }

    return res.status(200).send(trip);
  } catch (err) {
    return res.status(500).json(err);
  }
});

onerp.put("/cancelTrip", async (req, res) => {
  const { tripId } = req.body;
  let accessToken;
  if (!req.headers.authorization) return res.status(401).send();
  if (req.headers.authorization)
    [, accessToken] = req.headers.authorization.split("psApiKey ");
  if (accessToken !== pideloSeguroApiKey)
    return res.status(401).send({ message: "Api key is not valid." });
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
    return res.status(500).json(err);
  }
});

export default onerp;
