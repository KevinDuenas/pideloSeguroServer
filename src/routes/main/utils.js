import { sign, verify } from "jsonwebtoken";
import { Types } from "mongoose";
import { User, Session, VerificationRequest } from "@db/models";
import { env, secrets } from "@config/environment";

const tokens = {
  validateDriver: {
    get: (user, request) => {
      const validateToken = sign(
        { userId: user.id, requestId: request.id },
        secrets.access,
        {
          expiresIn: 404000,
        }
      );

      return validateToken;
    },
    validate: async (token) => {
      const { userId, requestId } = verify(token, secrets.access);
      const user = await User.findOne({ _id: userId });

      if (user.validateToken !== token)
        throw new Error("Invalid validate token");

      const request = await VerificationRequest.findOneAndUpdate(
        {
          _id: requestId,
          driver: userId,
        },
        { status: "APPROVED" },
        { new: true }
      );

      if (!request) throw new Error("Request is not linked with this user.");

      return user;
    },
  },
};

export { tokens };
