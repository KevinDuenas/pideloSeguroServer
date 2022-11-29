import { Router } from "express";
import { User } from "@db/models";
import { compareSync, hashSync } from "bcryptjs";
import { send } from "@connections/aws/email";
import { cookie } from "@config/constants";
import { tokens } from "./utils";
import { twilioConfig, env } from "@config/environment";
import { twilioClient } from "@connections/twilio";

const auth = Router();

auth.get("/access", async (req, res) => {
  try {
    const refreshToken = req.cookies[cookie.names.refreshToken];
    // const sessionExists = await Session.findOne({ refreshToken });
    //if (!sessionExists) throw new Error('Invalid Token');
    const { userId } = tokens.refresh.validate(refreshToken);
    const user = await User.findOne({ _id: userId });
    const accessToken = tokens.access.get(user);
    return res.status(200).json({
      accessToken,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

auth.post("/sendCode", async (req, res) => {
  const { phoneNumber, isLogin } = req.body;

  try {
    const user = await User.findOne({
      phoneNumber: phoneNumber,
    });
    if (isLogin && !user) {
      throw new Error("Phone number is not linked to any user.");
    }

    if (!isLogin && user) {
      throw new Error("Phone number is already linked to any user.");
    }

    twilioClient.verify.v2
      .services(twilioConfig.verifyService)
      .verifications.create({ to: phoneNumber, channel: "sms" })
      .then((verification) => {
        const { status } = verification;
        return res.status(200).json({
          hasAccount: user ? true : false,
        });
      })
      .catch((err) => {
        return res.status(500).json(err);
      });
  } catch (err) {
    return res.status(500).json(err);
  }
});

auth.post("/register", async (req, res) => {
  const { phoneNumber, firstName, firstLastName, secondLastName, code } =
    req.body;

  try {
    const phoneSearch = await User.findOne({
      phoneNumber: phoneNumber,
    });
    if (phoneSearch)
      return res.status(401).json({
        message: "Phone number already in user.",
        error: "The phoneNumber already has an account.",
      });

    const user = new User({
      firstName,
      firstLastName,
      secondLastName,
      phoneNumber,
    });

    twilioClient.verify.v2
      .services(twilioConfig.verifyService)
      .verificationChecks.create({ to: phoneNumber, code: code })
      .then(async (verification_check) => {
        let { status } = verification_check;

        if (status === "approved") {
          await user.save();
          const { refreshToken, accessToken, session } =
            await tokens.refresh.set(req, res, {
              user,
            });
          return res.status(200).json({
            refreshToken,
            accessToken,
            session,
          });
        } else {
          res.status(401).json({
            message: "Verification failed",
            error: "Check the verication code or phone number",
          });
        }
      })
      .catch((err) => {
        return res.status(500).json(err);
      });
  } catch (err) {
    return res.status(500).json(err);
  }
});

auth.post("/login", async (req, res) => {
  const { phoneNumber, code } = req.body;
  try {
    const user = await User.findOne({
      phoneNumber: phoneNumber,
    });
    if (!user)
      return res.status(401).json({
        message: "Sending Code Failed",
        error: "The phoneNumber is not associated with an account.",
      });

    twilioClient.verify.v2
      .services(twilioConfig.verifyService)
      .verificationChecks.create({ to: phoneNumber, code: code })
      .then(async (verification_check) => {
        let { status } = verification_check;
        if (status === "approved") {
          const { refreshToken, accessToken, session } =
            await tokens.refresh.set(req, res, {
              user,
            });
          return res.status(200).json({
            refreshToken,
            accessToken,
            session,
          });
        } else {
          res.status(401).json({
            message: "Verification failed",
            error: "Check the verication code or phone number",
          });
        }
      })
      .catch((err) => {
        return res.status(500).json(err);
      });
  } catch (err) {
    return res.status(500).json(err);
  }
});

auth.post("/logout", async (req, res) => {
  const sessionId = req.cookies[cookie.names.session];
  const refreshToken = req.cookies[cookie.names.refreshToken];
  try {
    await tokens.refresh.remove(res, refreshToken, sessionId);
    return res.status(200).send("OK");
  } catch (err) {
    return res.status(500).json(err);
  }
});

auth.post("/validate", async (req, res) => {
  const { passwordRecoveryToken } = req.body;
  try {
    await tokens.passwordRecovery.validate(passwordRecoveryToken);
    return res.status(200).send("OK");
  } catch (err) {
    return res.status(500).json(err);
  }
});

auth.post("/reset", async (req, res) => {
  const { passwordRecoveryToken, password } = req.body;
  try {
    const user = await tokens.passwordRecovery.validate(passwordRecoveryToken);
    user.password = hashSync(password);
    user.passwordRecoveryToken = "";
    await user.save();
    return res.status(200).send("OK");
  } catch (err) {
    return res.status(500).json(err);
  }
});

export default auth;
