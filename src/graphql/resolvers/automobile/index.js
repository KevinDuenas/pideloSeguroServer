import automobileQueries from "./queries";
import automobileMutations from "./mutations";
import automobileFields from "./fields";

const resolveAutomobile = {
  one: (automobile, loaders) => {
    // Note: Aggregation results do not have a toObject property
    const automobileObject = automobile?.toObject?.() ?? automobile;

    return {
      ...automobileObject,
      id: automobileObject._id,
    };
  },
};

export { automobileQueries, automobileMutations, automobileFields };
export default resolveAutomobile;
