import { User, Development } from "@db/models";
import { generate } from "generate-password";
import { hashSync, compareSync } from "bcryptjs";
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
  createAdminUser: async (_, { user }, { user: { id }, loaders }) => {
    const repeteadEmail = await User.findOne({
      email: user.email.toLowerCase(),
    });
    if (repeteadEmail) throw new Error("Email already in use.");
    const newUser = new User({
      ...user,
      email: user.email.toLowerCase(),
      password: hashSync(user.password),
      overallRole: "ADMIN",
    });
    const savedUser = await newUser.save();
    return resolveUser.one(savedUser, loaders);
  },
  editAdminUser: async (_, { userId, user }, { user: { id }, loaders }) => {
    const editedUser = await User.findOneAndUpdate(
      { _id: userId, deleted: false, overallRole: "ADMIN" },
      { ...user },
      {
        new: true,
      }
    );

    if (!editedUser) throw new Error("User not found.");
    return resolveUser.one(editedUser, loaders);
  },
  createInvestorUser: async (_, { user }, { user: { id }, loaders }) => {
    const repeteadEmail = await User.findOne({
      email: user.email.toLowerCase(),
    });
    if (repeteadEmail) throw new Error("Email already in use.");
    const newUser = new User({
      ...user,
      password: hashSync(user.password),
      overallRole: "INVESTOR",
      email: user.email.toLowerCase(),
    });
    const savedUser = await newUser.save();
    return resolveUser.one(savedUser, loaders);
  },
  editInvestorUser: async (_, { userId, user }, { user: { id }, loaders }) => {
    const editedUser = await User.findOneAndUpdate(
      { _id: userId, deleted: false, overallRole: "INVESTOR" },
      { ...user },
      {
        new: true,
      }
    );

    if (!editedUser) throw new Error("User not found.");
    return resolveUser.one(editedUser, loaders);
  },
  createSupportUser: async (_, { user }, { user: { id }, loaders }) => {
    const repeteadEmail = await User.findOne({
      email: user.email.toLowerCase(),
    });
    if (repeteadEmail) throw new Error("Email already in use.");
    const newUser = new User({
      ...user,
      password: hashSync(user.password),
      overallRole: "SUPPORT",
      email: user.email.toLowerCase(),
    });
    const savedUser = await newUser.save();
    return resolveUser.one(savedUser, loaders);
  },
  editSupportUser: async (_, { userId, user }, { user: { id }, loaders }) => {
    const editedUser = await User.findOneAndUpdate(
      { _id: userId, deleted: false, overallRole: "SUPPORT" },
      { ...user },
      {
        new: true,
      }
    );

    if (!editedUser) throw new Error("User not found.");
    return resolveUser.one(editedUser, loaders);
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
