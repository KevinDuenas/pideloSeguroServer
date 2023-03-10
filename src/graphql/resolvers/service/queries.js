import { Service } from "@db/models";
import resolveService from "@graphql/resolvers/service";

const serviceQueries = {
  // userByToken: async (_, __, { loaders, user: { id } }) => {
  //   const user = await User.findOne({ _id: id });
  //   return resolveUser.one(user, loaders);
  // },
};

export default serviceQueries;
