import { User } from "@db/models";

const userAllowed = (roles, userRole) =>
  roles.some((role) => role?.toUpperCase() === userRole?.toUpperCase());

const auth = {
  overall: async ({ user, requiresToBeOneOf }) => {
    const { overallRole } = await User.findOne({ _id: user });

    if (requiresToBeOneOf) {
      if (!overallRole || !userAllowed(requiresToBeOneOf, overallRole))
        throw new Error("Unauthorized");
    }

    return overallRole;
  },
};

export default auth;
