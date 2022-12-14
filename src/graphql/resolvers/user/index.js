import userQueries from "./queries";
import userMutations from "./mutations";
import userFields from "./fields";

const resolveUser = {
  one: (user, loaders) => {
    // Note: Aggregation results do not have a toObject property
    const userObject = user?.toObject?.() ?? user;

    return {
      ...userObject,
      id: userObject._id,
    };
  },
  many: (users, loaders) => users.map((user) => resolveUser.one(user, loaders)),
};

export { userQueries, userMutations, userFields };
export default resolveUser;
