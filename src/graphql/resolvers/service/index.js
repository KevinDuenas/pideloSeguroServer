import serviceQueries from "./queries";
import serviceMutations from "./mutations";
import serviceFields from "./fields";

const resolveService = {
  one: (service, loaders) => {
    // Note: Aggregation results do not have a toObject property
    const serviceObject = service?.toObject?.() ?? service;

    return {
      ...serviceObject,
      id: serviceObject._id,
    };
  },
  many: (services, loaders) =>
    services.map((service) => resolveService.one(service, loaders)),
};

export { serviceQueries, serviceMutations, serviceFields };
export default resolveService;
