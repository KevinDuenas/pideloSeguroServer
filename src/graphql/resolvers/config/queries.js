import { Config } from "@db/models";
import resolveUser from "@graphql/resolvers/user";
import { defaultParams } from "@config/constants";
import { buildQuery, buildSearch } from "@graphql/resolvers/utils";

const configQueries = {
  driverDocuments: async (_, __, { loaders, user: { id } }) => {
    const config = await Config.findOne({});

    return config.driverDocuments;
  },
};

export default configQueries;
