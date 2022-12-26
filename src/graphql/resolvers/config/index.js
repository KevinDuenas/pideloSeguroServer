import configQueries from "./queries";
import configMutations from "./mutations";

const resolveConfig = {
  one: (config, loaders) => {
    // Note: Aggregation results do not have a toObject property
    const configObject = config?.toObject?.() ?? config;

    return {
      ...configObject,
      id: configObject._id,
    };
  },
};

export { configQueries, configMutations };
export default resolveConfig;
