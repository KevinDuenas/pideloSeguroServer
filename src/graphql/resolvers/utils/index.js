import { Types } from 'mongoose';

export { default as auth } from './auth';
export { default as validations } from './validations';

const buildQuery = (arg, key, opts = {}) => {
  const {
    aggregation = false, // Should be used when building aggregation $match, since they do not automatically convert ObjectIds
  } = opts;

  const query = {};

  if (arg) {
    if (typeof arg.exists === 'boolean') query[key] = { $exists: arg.exists };
    if (arg.eq) query[key] = { $eq: aggregation ? Types.ObjectId(arg.eq) : arg.eq };
    if (arg.ne) query[key] = { $ne: aggregation ? Types.ObjectId(arg.ne) : arg.ne };
    if (arg.in) query[key] = { $in: aggregation ? arg.in.map((id) => Types.ObjectId(id)) : arg.in };
    if (arg.nin)
      query[key] = { $nin: aggregation ? arg.nin.map((id) => Types.ObjectId(id)) : arg.nin };
  }

  return query;
};

const buildSearch = (search) => {
  const query = {};
  const searchKeys = Object.keys(search);

  if (searchKeys.length > 0) {
    query.$or = [];
    searchKeys.forEach((key) => {
      query.$or.push({ [key]: new RegExp(search[key], 'i') });
    });
  }

  return query;
};

export { buildQuery, buildSearch };
