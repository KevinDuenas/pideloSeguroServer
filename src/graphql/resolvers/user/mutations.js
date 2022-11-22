import { User, Development } from "@db/models";
import { hashSync, compareSync } from "bcryptjs";
import { generate } from "generate-password";
import { auth } from "@graphql/resolvers/utils";
import resolveUser from "@graphql/resolvers/user";
import { send } from "@connections/aws/email";

const userMutations = {
  updateUserByToken: async (_, { user }, { user: { id }, loaders }) => {
    const userToSet = { ...user };

    // Users can only update their role if an ADMIN does it through updateUser mutation
    delete userToSet.overallRole;

    if (userToSet.username)
      userToSet.username = userToSet.username.toLowerCase();

    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      { $set: { ...userToSet } },
      { new: true }
    );
    return resolveUser.one(updatedUser, loaders);
  },
};

export default userMutations;
