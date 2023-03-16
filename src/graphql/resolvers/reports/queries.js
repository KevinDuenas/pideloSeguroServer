import { User, Trip } from "@db/models";

const reportsQueries = {
  investorsReport: async (
    _,
    { firstDay, lastDay },
    { loaders, user: { id } }
  ) => {
    const user = await User.findOne({
      _id: id,
      overallRole: { $in: ["INVESTOR", "STOCKHOLDER"] },
    });

    if (!user) throw new Error("Error fetching Investor information. ");

    // const report = await Trip.aggregate([
    //   {
    //     $match: {
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
      driversCount: 0,
      startedTrips: 0,
      tripsIncome: 0.0,
      successTrips: 0,
      notStartedTrips: 0,
      cancelledTrips: 0,
      costs,
      utilitiesPerShare: 0,
      shares: 1,
      utilities: 0,
    };
  },
};

export default reportsQueries;
