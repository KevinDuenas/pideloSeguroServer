import { User, Payment } from "@db/models";
import stripe from "@connections/stripe";

const paymentMutations = {
  createStripePayment: async (_, { amount }, { loaders, user: { id } }) => {
    const user = await User.findOne({ _id: id });

    if (!user) throw new Error("User was not found.");
    if (!user.stripeCustomerId) {
      const stripeCustomer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.firstLastName} ${user.secondLastName}`,
        phone: user.phoneNumber,
      });
      user.stripeCustomerId = stripeCustomer.id;
      await user.save();
    }

    const paymentIntent = await stripe.paymentIntents.create({
      customer: user.stripeCustomerId,
      setup_future_usage: "off_session",
      amount: amount,
      currency: "mxn",
      statement_descriptor: "Pidelo Seguro",
      automatic_payment_methods: { enabled: true },
    });

    const newPayment = await new Payment({
      stripePaymentIntentId: paymentIntent.id,
      amount: Number(amount / 100).toFixed(2),
      user: id,
      status: "INITIALIZED",
      type: "DRIVER_RECHARGE",
      method: "STRIPE",
    });

    await newPayment.save();
    return paymentIntent.client_secret;
  },
};

export default paymentMutations;
