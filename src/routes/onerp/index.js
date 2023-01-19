import { Router } from "express";
import { User, Config, Trip } from "@db/models";
import { cookie } from "@config/constants";
import { pubSub } from "@connections/firebase";

const onerp = Router();

onerp.post("/requestTrip", async (req, res) => {
  const { destinations, onerpInfo, tripType } = req.body;

  try {
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
    return res.status(201).send(newTrip);
  } catch (err) {
    return res.status(500).json(err);
  }
});

onerp.get("/activeTrips", async (req, res) => {
  const { storeId } = req.body;

  try {
    const trips = await Trip.find({
      "onerpInfo.storeId ": storeId,
      status: { $in: ["DRIVER_PENDING", "ACTIVE"] },
    }).sort({ createdAt: "desc" });

    return res.status(200).send(trips);
  } catch (err) {
    return res.status(500).json(err);
  }
});

export default onerp;
