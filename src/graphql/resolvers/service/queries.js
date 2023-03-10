import { Service } from "@db/models";
import resolveService from "@graphql/resolvers/service";

const serviceQueries = {
  services: async (_, { state, params }, { loaders, user: { id } }) => {
    const query = {
      deleted: false,
      state,
    };
    return {
      results: async () => {
        const { page, pageSize } = params;
        const servicePromise = Service.find(query)
          .skip(pageSize * (page - 1))
          .limit(pageSize);
        const results = await servicePromise;
        return resolveService.many(results, loaders);
      },
      count: () => Service.countDocuments(query),
      params,
    };
  },
};

export default serviceQueries;
