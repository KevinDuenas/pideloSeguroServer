import { User, Payment } from "@db/models";
import stripe from "@connections/stripe";
import resolvePayment from "@graphql/resolvers/payment";

const paymentMutations = {
  createStripePayment: async (
    _,
    { amountInCents },
    { loaders, user: { id } }
  ) => {
    const user = await User.findOne({ _id: id });
    if (!user) throw new Error("User was not found.");
    if (!user.stripeCustomerId)
      throw new Error("User don't have stripe customer id.");
    if (amountInCents < 2000 || amountInCents > 50000)
      throw new Error("Deposit limits: Min 20.00  Max 500.00");
    const paymentMethod = await stripe.paymentMethods.list({
      customer: user?.stripeCustomerId,
      type: "card",
    });
    const paymentId = paymentMethod?.data[0]?.id;
    if (!paymentId) throw new Error("Not payment registered.");
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "mxn",
      payment_method: paymentId,
      confirm: "true",
      off_session: true,
      customer: user.stripeCustomerId,
    });

    const newPayment = await new Payment({
      stripePaymentIntentId: paymentIntent.id,
      amount: Number(amountInCents / 100).toFixed(2),
      user: id,
      status: "INITIALIZED",
      type: "DRIVER_RECHARGE",
      method: "STRIPE",
    });

    const savedPayment = await newPayment.save();
    return resolvePayment.one(savedPayment, loaders);
  },
  addStripePaymentMethod: async (_, __, { loaders, user: { id } }) => {
    const user = await User.findOne({ _id: id });
    const amount = 1000;
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
  removePaymentMethod: async (_, __, { loaders, user: { id } }) => {
    if (!id) throw new Error("Access token is required");
    const user = await User.findOne({ _id: id });
    if (!user) throw new Error("User not found.");
    const paymentMethod = await stripe.paymentMethods.list({
      customer: user?.stripeCustomerId,
      type: "card",
    });
    const paymentId = paymentMethod?.data[0]?.id;
    if (!paymentId) throw new Error("Not payment method founded.");
    const deletedPayment = await stripe.paymentMethods.detach(paymentId);
    if (deletedPayment) return true;
    return false;
  },
  createDepositPayment: async (_, { deposit }, { loaders, user: { id } }) => {
    const driver = await User.findOne({
      _id: deposit.user,
      overallRole: "DRIVER",
    });

    if (!driver) throw new Error("User needs to be a driver.");
    const newPayment = new Payment({
      ...deposit,
      status: "SUCCEEDED",
      type: "DRIVER_RECHARGE",
      method: "DEPOSIT",
    });

    const savedPayment = await newPayment.save();
    return resolvePayment.one(savedPayment, loaders);
  },
};

export default paymentMutations;
