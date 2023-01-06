import { User } from "@db/models";

const userFields = {
  User: {
    status: async (_, __, { loaders, user: { id: userId } }) => {
      return "MISSING";
    },
  },
};

export default userFields;
