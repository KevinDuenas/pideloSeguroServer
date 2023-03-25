import { User, Config, Service } from "@db/models";
import { defaultParams } from "@config/constants";
import resolveUser from "@graphql/resolvers/user";
import resolveService from "@graphql/resolvers/service";

const userQueries = {
  user: async (_, { id: userId }, { loaders, user: { id } }) => {
    const user = await User.findOne({ _id: userId });
    if (!user) throw new Error("User id doesn't exists.");
    return resolveUser.one(user, loaders);
  },
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
  driverServices: async (_, __, { loaders, user: { id } }) => {
    //const driver = await User.findOne({ _id: id, overallRole: "DRIVER" });

    const principal = await Service.findOne({
      _id: "6411fd03eb8225aeac3d16b9",
    });

    const others = await Service.find({
      _id: { $in: ["640ac30a5a807dafb9fb612b", "6411fd3feb8225aeac3d16c0"] },
    });

    return {
      principal: () => resolveService.one(principal, loaders),
      other: () => resolveService.many(others, loaders),
    };
  },
  usersTotals: async (_, __, { loaders, user: { id } }) => {
    let users = await User.aggregate([
      { $match: { deleted: false } },
      { $group: { _id: "$overallRole", n: { $sum: 1 } } },
    ]);
    let usersCount = {
      ADMIN: 0,
      USER: 0,
      DRIVER: 0,
      SOCKHOLDER: 0,
      INVESTOR: 0,
      SUPPORT: 0,
    };
    for (let userType of users) {
      usersCount[userType._id] = userType.n;
    }
    return usersCount;
  },
};

export default userQueries;
