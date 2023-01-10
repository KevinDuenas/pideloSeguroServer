import { sign, verify } from "jsonwebtoken";
import { Types } from "mongoose";
import { User, Session } from "@db/models";
import { env, secrets } from "@config/environment";
import { cookie } from "@config/constants";
import { parse } from "express-useragent";

const commonCookieParams = {
  secure: env.production || env.staging,
  domain: env.production || env.staging ? cookie.domain : undefined,
  sameSite: env.production || env.staging ? "none" : undefined,
};

const tokens = {
  passwordRecovery: {
    get: (user) => {
      const passwordRecoveryToken = sign({ userId: user.id }, secrets.access, {
        expiresIn: 21600, // 3 hours
      });

      return passwordRecoveryToken;
    },
    validate: async (token) => {
      const { userId } = verify(token, secrets.access);

      const user = await User.findOne({ _id: userId });

      if (user.passwordRecoveryToken !== token)
        throw new Error("Invalid password recovery token");

      return user;
    },
  },
  access: {
    get: (user) => {
      const accessExpiresIn = 60 * 15; // 15 minutes

      const accessToken = sign(
        {
          userId: user.id, // Username needed to inmediately detect if a profile page is owned
        },
        secrets.access,
        {
          expiresIn: accessExpiresIn,
        }
      );

      return accessToken;
    },
  },
  refresh: {
    set: async (req, res, { user, expires = true }) => {
      // If a session already exists, just update that one.
      // Otherwise, create a new one for the corresponding new device
      const sessionId = req.cookies[cookie.names.session] ?? Types.ObjectId();
      const refreshExpiresIn = 60 * 60 * 24; // 24 hours

      const refreshToken = sign(
        {
          userId: user.id,
        },
        secrets.refresh,
        {
          expiresIn: expires ? refreshExpiresIn : "999 years",
        }
      );

      const { browser, version, os, platform } = parse(
        req.headers["user-agent"]
      );
      const session = await Session.findOneAndUpdate(
        { _id: sessionId },
        {
          $set: {
            _id: sessionId,
            user: user.id,
            refreshToken,
            active: true,
            browser,
            version,
            os,
            platform,
          },
        },
        { upsert: true, new: true }
      );
      res.cookie(cookie.names.refreshToken, refreshToken, {
        ...commonCookieParams,
        maxAge: refreshExpiresIn * 1000, // maxAge is in miliseconds
        httpOnly: true,
      });

      res.cookie(
        cookie.names.session,
        // Always set session.id so when it is new, it gets replaced
        session.id,
        {
          ...commonCookieParams,
        }
      );
      return {
        accessToken: tokens.access.get(user),
        refreshToken,
        // Always send session.id so when it is new, it gets replaced
        session: session.id,
      };
    },
    validate: (refreshToken) => verify(refreshToken, secrets.refresh),
    remove: async (res, refreshToken, sessionId) => {
      res.cookie(cookie.names.refreshToken, refreshToken, {
        ...commonCookieParams,
        maxAge: 0, // Expire inmediately
        httpOnly: true,
      });
      res.cookie(cookie.names.session, sessionId, {
        ...commonCookieParams,
        maxAge: 0, // Expire inmediately
      });

      // Only deactivate if sessionId is present
      // This will deactivate cookies but pontentially left the session open,
      // but is better than passing undefined sessionId,
      // which will deactivate first session it founds
      // if (sessionId) await Session.findOneAndDelete({ _id: sessionId });
    },
  },
};

export { tokens };
