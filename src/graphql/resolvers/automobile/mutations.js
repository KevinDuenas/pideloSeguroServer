import { Automobile } from "@db/models";
import resolveAutomobile from "@graphql/resolvers/verificationRequest";

const AutomobileMutations = {
  addAutomobileByToken: async (
    _,
    { automobile },
    { user: { id }, loaders }
  ) => {
    if (!id) throw new Error("Driver token is required to add a automobile.");

    const newAutomobile = new Automobile({
      ...automobile,
      driver: id,
    });

    const savedAutomobile = await newAutomobile.save();
    return resolveAutomobile.one(savedAutomobile, loaders);
  },
};

export default AutomobileMutations;
