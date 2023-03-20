import { User, Config } from "@db/models";
import { defaultParams } from "@config/constants";
import resolveUser from "@graphql/resolvers/user";

const userQueries = {
  userByToken: async (_, __, { loaders, user: { id } }) => {
    const user = await User.findOne({ _id: id });

    return resolveUser.one(user, loaders);
  },
  userDocumentsStatus: async (_, __, { loaders, user: { id } }) => {
    const { documents: userDocuments } = await User.findOne({ _id: id });
    const { driverDocuments } = await Config.findOne({});
    const copy = [...driverDocuments];

    if (!userDocuments) throw new Error("User not found.");

    copy.forEach((element, index) => {
      copy[index] = { uploadRequired: true, ...copy[index]._doc };
    });

    for (let document of userDocuments) {
      let index = copy.findIndex((doc) => doc._id.equals(document._id));
      if (index >= 0) {
        copy[index].uploadRequired = false;
      }
    }
    return copy;
  },
  drivers: async (_, __, { loaders, user: { id } }) => {
    const drivers = await User.find({ overallRole: "DRIVER" });
    return resolveUser.many(drivers, loaders);
  },
  users: async (
    _,
    { type, params = defaultParams },
    { loaders, user: { id } }
  ) => {
    const query = {
      deleted: false,
      overallRole: type,
    };

    return {
      results: async () => {
        const { page, pageSize } = params;
        const usersPromise = User.find(query)
          .skip(pageSize * (page - 1))
          .limit(pageSize)
          .sort({ createdAt: -1 });

        const results = await usersPromise;
        return resolveUser.many(results, loaders);
      },
      count: () => User.countDocuments(query),
      params,
    };
  },
};

export default userQueries;
