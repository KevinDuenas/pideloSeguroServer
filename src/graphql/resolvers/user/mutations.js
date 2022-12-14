import { User, Development } from "@db/models";
import { generate } from "generate-password";
import resolveUser from "@graphql/resolvers/user";

const userMutations = {
  updateUserByToken: async (_, { user }, { user: { id }, loaders }) => {
    const userToSet = { ...user };

    if (!id) throw new Error("User not found.");

    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      { $set: { ...userToSet } },
      { new: true }
    );
    return resolveUser.one(updatedUser, loaders);
  },
  uploadUserDocumentByToken: async (
    _,
    { document },
    { user: { id }, loaders }
  ) => {
    const user = await User.findOne({ _id: id });

    if (!user) throw new Error("User not found.");

    const index = user.documents.findIndex((doc) =>
      doc._id.equals(document._id)
    );

    if (index >= 0) {
      user.documents[index] = document;
    } else {
      user.documents.push(document);
    }

    const updatedUser = await user.save();
    return resolveUser.one(updatedUser, loaders);
  },
};

export default userMutations;
