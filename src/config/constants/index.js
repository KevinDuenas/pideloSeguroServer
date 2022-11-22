const cookie = {
  names: {
    session: "session",
    refreshToken: "refresh-token",
  },
  domain: ".pideloseguro.com",
};

const defaultParams = { page: 1, pageSize: Number.MAX_SAFE_INTEGER };

const defaultRange = {
  gte: new Date(0),
  lte: new Date(8.64e15),
};

export { defaultParams, defaultRange, cookie };
