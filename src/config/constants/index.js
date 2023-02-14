import { env } from "@config/environment";

const cookie = {
  names: {
    session: "session",
    refreshToken: "refresh-token",
  },
  domain: env.production ? ".pideloseguro.net" : ".pideloseguro.xyz",
};

const defaultParams = { page: 1, pageSize: Number.MAX_SAFE_INTEGER };

const defaultRange = {
  gte: new Date(0),
  lte: new Date(8.64e15),
};

export { defaultParams, defaultRange, cookie };
