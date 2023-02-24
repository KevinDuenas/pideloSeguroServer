import { stripeConfig } from "@config/environment";

const stripe = require("stripe")(stripeConfig.apiKey);

export default stripe;
