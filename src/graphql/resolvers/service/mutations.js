import { Service } from "@db/models";
import resolveService from "@graphql/resolvers/service";

const serviceMutations = {
  createPassengersService: async (
    _,
    { service },
    { user: { id }, loaders }
  ) => {
    const newService = new Service({
      ...service,
      serviceType: "PASSENGERS",
    });
    const savedService = await newService.save();
    return resolveService.one(savedService, loaders);
  },
  createDeliveryService: async (_, { service }, { user: { id }, loaders }) => {
    const newService = new Service({
      ...service,
      serviceType: "DELIVERY",
    });
    const savedService = await newService.save();
    return resolveService.one(savedService, loaders);
  },
  createFoodDeliveryService: async (
    _,
    { service },
    { user: { id }, loaders }
  ) => {
    const newService = new Service({
      ...service,
      serviceType: "FOOD_DELIVERY",
    });
    const savedService = await newService.save();
    return resolveService.one(savedService, loaders);
  },
};

export default serviceMutations;
