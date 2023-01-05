import { User, Config } from "@db/models";
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
};

export default userQueries;
