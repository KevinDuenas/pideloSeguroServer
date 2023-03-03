import { Router } from "express";
import { User } from "@db/models";
import { send } from "@connections/aws/email";
import { tokens } from "./utils";

const main = Router();

main.patch("/validateDriver", async (req, res) => {
  const { token } = req.body;

  try {
    const user = await tokens.validateDriver.validate(token);
    if (!user) return res.status(401).send();
    user.validateToken = "";
    await user.save();
    return res.status(200).send();
  } catch (err) {
    return res.status(500).json(err);
  }
});

export default main;
