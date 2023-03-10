import { Service } from "@db/models";
import resolveService from "@graphql/resolvers/service";

const serviceMutations = {
  // updateUserByToken: async (_, { user }, { user: { id }, loaders }) => {
  //   const userToSet = { ...user };
  //   if (!id) throw new Error("User not found.");
  //   const updatedUser = await User.findOneAndUpdate(
  //     { _id: id },
  //     { $set: { ...userToSet } },
  //     { new: true }
  //   );
  //   return resolveUser.one(updatedUser, loaders);
  // },
};

export default serviceMutations;
