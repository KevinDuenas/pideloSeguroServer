import { User, Development } from "@db/models";
import { hashSync, compareSync } from "bcryptjs";
import { generate } from "generate-password";
import resolveUser from "@graphql/resolvers/user";

const userMutations = {
  updateUserByToken: async (_, { user }, { user: { id }, loaders }) => {
    const userToSet = { ...user };

    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      { $set: { ...userToSet } },
      { new: true }
    );
    return resolveUser.one(updatedUser, loaders);
  },
};

export default userMutations;
