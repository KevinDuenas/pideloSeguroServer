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
  editPassengersService: async (
    _,
    { serviceId, service },
    { user: { id }, loaders }
  ) => {
    const editedService = await Service.findOneAndUpdate(
      { _id: serviceId, deleted: false },
      { ...service },
      {
        new: true,
      }
    );
    if (!editedService) throw new Error("Service not found.");
    return resolveService.one(editedService, loaders);
  },
  createDeliveryService: async (_, { service }, { user: { id }, loaders }) => {
    const newService = new Service({
      ...service,
      serviceType: "DELIVERY",
    });
    const savedService = await newService.save();
    return resolveService.one(savedService, loaders);
  },
  editDeliveryService: async (
    _,
    { serviceId, service },
    { user: { id }, loaders }
  ) => {
    const editedService = await Service.findOneAndUpdate(
      { _id: serviceId, deleted: false },
      { ...service },
      {
        new: true,
      }
    );

    if (!editedService) throw new Error("Service not found.");
    return resolveService.one(editedService, loaders);
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
  editFoodDeliveryService: async (
    _,
    { serviceId, service },
    { user: { id }, loaders }
  ) => {
    const editedService = await Service.findOneAndUpdate(
      { _id: serviceId, deleted: false },
      { ...service },
      {
        new: true,
      }
    );
    if (!editedService) throw new Error("Service not found.");
    return resolveService.one(editedService, loaders);
  },
};

export default serviceMutations;
