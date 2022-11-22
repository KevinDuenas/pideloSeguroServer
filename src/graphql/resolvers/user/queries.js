import { User } from "@db/models";
import resolveUser from "@graphql/resolvers/user";
import { defaultParams } from "@config/constants";
import { buildQuery, buildSearch } from "@graphql/resolvers/utils";

const userQueries = {
  userByToken: async (_, __, { loaders, user: { id } }) => {
    const user = await User.findOne({ _id: id });

    return resolveUser.one(user, loaders);
  },
};

export default userQueries;
