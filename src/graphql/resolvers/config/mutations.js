import { Config } from "@db/models";
import { hashSync, compareSync } from "bcryptjs";
import { generate } from "generate-password";
import { auth } from "@graphql/resolvers/utils";

const configMutations = {
  createDocument: async (_, { document }, { user: { id }, loaders }) => {
    await Config.updateOne({}, { $push: { driverDocuments: document } });
    return true;
  },
};

export default configMutations;
