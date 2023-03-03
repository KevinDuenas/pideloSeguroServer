import { Router } from "express";
import stripe from "@connections/stripe";
import { Payment } from "@db/models";
import { stripeConfig } from "@config/environment";

const endpointSecret = undefined;
const express = require("express");
const stripeRouter = Router();

stripeRouter.post(
  "/webhooks",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    let event = request.body;
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = request.headers["stripe-signature"];
      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          signature,
          endpointSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
      }
    }

    let paymentIntent;
    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        paymentIntent = event.data.object;
        console.log(
          `PaymentIntent ${paymentIntent.id} for ${paymentIntent.amount} was successful!`
        );
        await Payment.findOneAndUpdate(
          {
            stripePaymentIntentId: paymentIntent.id,
          },
          {
            status: "SUCCEEDED",
          }
        );
        break;
      case "payment_intent.processing":
        paymentIntent = event.data.object;
        console.log(
          `PaymentIntent ${paymentIntent.id} for ${paymentIntent.amount} is processing`
        );
        await Payment.findOneAndUpdate(
          {
            stripePaymentIntentId: paymentIntent.id,
          },
          {
            status: "PROCESSING",
          }
        );
        break;
      case "payment_intent.payment_failed":
        paymentIntent = event.data.object;
        console.log(
          `PaymentIntent ${paymentIntent.id} for ${paymentIntent.amount} failed!`
        );
        await Payment.findOneAndUpdate(
          {
            stripePaymentIntentId: paymentIntent.id,
          },
          {
            status: "FAILED",
          }
        );
        break;

      default:
        // Unexpected event type
        console.log(`Unhandled event  type ${event.type}.`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

export default stripeRouter;
