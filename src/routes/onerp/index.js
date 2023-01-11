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

export default onerp;
