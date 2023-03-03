import { verify } from "jsonwebtoken";
import DataLoader from "dataloader";
import { secrets } from "@config/environment";
import {
  User,
  Config,
  Trip,
  VerificationRequest,
  Automobile,
  Payment,
} from "@db/models";
import resolveUser from "@graphql/resolvers/user";
import resolveConfig from "@graphql/resolvers/user";
import resolveTrip from "@graphql/resolvers/trip";
import resolveVerificationRequest from "@graphql/resolvers/verificationRequest";
import resolveAutomobile from "@graphql/resolvers/automobile";
import resolvePayment from "@graphql/resolvers/payment";

const createLoader = (Model, resolve) => {
  const loader = new DataLoader(async (ids) => {
    const data = await Model.find({ _id: { $in: ids } });

    // DataLoaders depends on the order of the input to return the result
    // So, it is needed to map results in order to create a correct output
    // I haven't found a solution better than O(n), and letting mongo do it
    // through an aggregation is not compatible with model resolvers
    const dataMap = data.reduce((acc, curr) => {
      acc[curr._id] = curr;
      return acc;
    }, {});

    return ids.map((id) => dataMap[id]);
  });

  return {
    one: async (id, loaders) => {
      const result = await loader.load(id.toString());
      return resolve.one(result, loaders);
    },
    many: async (ids, loaders) => {
      const results = await loader.loadMany(ids.map((id) => id.toString()));
      return resolve.many(results, loaders);
    },
  };
};

const context = async ({ req }) => {
  const { authorization } = req.headers;

  let accessToken;
  let userId;

  if (authorization) [, accessToken] = authorization.split("Bearer ");
  else throw new Error("GraphQL API is only accesible with an access token");
  // NOTE: We are not catching errors since access token should be renewed before getting here
  if (accessToken) ({ userId } = verify(accessToken, secrets.access));

  const loaders = {
    user: createLoader(User, resolveUser),
    automobile: createLoader(Automobile, resolveAutomobile),
    config: createLoader(Config, resolveConfig),
    trip: createLoader(Trip, resolveTrip),
    verificationRequest: createLoader(
      VerificationRequest,
      resolveVerificationRequest
    ),
    payment: createLoader(Payment, resolvePayment),
  };

  return { user: { id: userId }, loaders };
};

export default context;
