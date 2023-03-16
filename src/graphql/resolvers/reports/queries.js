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
    if (!user) throw new Error("Error fetching Investor information.");

    const driversCount = await User.countDocuments({ overallRole: "DRIVER" });
    const report = await Trip.aggregate([
      {
        $match: {
          deleted: false,
        },
      },
      {
        $group: {
          _id: 0,
          startedTrips: { $sum: 1 },
          quantity: { $sum: "$products.quantity" },
          tripsIncome: {
            $sum: {
              $cond: [
                { $ne: ["$status", "CANCELED"] },
                { $sum: ["$psFee"] },
                0,
              ],
            },
          },
          startedTrips: {
            $sum: {
              $cond: [{ $ne: ["$status", "CANCELED"] }, 1, 0],
            },
          },
          successTrips: {
            $sum: {
              $cond: [{ $eq: ["$status", "CLOSED"] }, 1, 0],
            },
          },
          notStartedTrips: {
            $sum: {
              $cond: [{ $eq: ["$status", "CANCELED"] }, 1, 0],
            },
          },
          cancelledTrips: {
            $sum: {
              $cond: [{ $eq: ["$status", "CANCELED"] }, 1, 0],
            },
          },
        },
      },
      { $sort: { money: -1 } },
    ]);

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
    const costsTotal = 21284;
    const utilities = report[0].tripsIncome - costsTotal;

    return {
      driversCount,
      ...report[0],
      costs,
      earningsPerShare: utilities / 40 > 0 ? utilities / 40 > 0 : 0,
      shares: user.shares,
      utilities: utilities > 0 ? utilities > 0 : 0,
    };
  },
};

export default reportsQueries;
