import { User, Trip } from "@db/models";

const reportsQueries = {
  investorsReport: async (
    _,
    { firstDay, lastDay },
    { loaders, user: { id } }
  ) => {
    // const report = await Trip.aggregate([
    //   {
    //     $match: {
    //       createdAt: { $gte: firstDay, $lt: lastDay },
    //       deleted: false,
    //     },
    //   },
    //   { $unwind: "$onerpInfo" },
    //   {
    //     $group: {
    //       startedTrips: { $sum: 1 },
    //       quantity: { $sum: "$products.quantity" },
    //       tripsIncome: {
    //         $sum: { $multiply: ["$cost", 0.15] },
    //       },
    //     },
    //   },
    //   { $sort: { money: -1 } },
    // ]);

    const costs = [
      {
        cost: 5000,
        title: "Oficinas",
        description: "Gastos por renta de oficinas para personal.",
      },
      {
        cost: 12000,
        title: "Comisiones",
        description: "Gastos por comisiones",
      },
      {
        cost: 4032,
        title: "Marketing",
        description: "Gastos por publicidad en redes sociales entre otros.",
      },
      {
        cost: 252,
        title: "Otros",
        description: "Margen por imprevistos.",
      },
    ];

    return {
      driversCount: 10,
      startedTrips: 1000,
      tripsIncome: 8000.0,
      successTrips: 960,
      notStartedTrips: 30,
      cancelledTrips: 10,
      costs,
      utilitiesPerShare: 400,
      shares: 2,
      utilities: 800,
    };
  },
};

export default reportsQueries;
