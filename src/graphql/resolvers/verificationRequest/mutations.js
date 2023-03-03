import { VerificationRequest, User } from "@db/models";
import { send } from "@connections/aws/email";
import moment from "moment";
import { env } from "@config/environment";
import { tokens } from "@routes/main/utils";

const verificationRequestMutations = {
  createDriverVerificationRequest: async (_, __, { user: { id }, loaders }) => {
    try {
      const user = await User.findOne({ _id: id });
      const activeRequest = await VerificationRequest.findOne({
        driver: id,
        status: "REVIEW_PENDING",
        type: "DRIVER_REQUEST",
      });

      if (!user) throw new Error("Driver not found");
      if (activeRequest) throw new Error("Driver has an active request.");

      const newRequest = new VerificationRequest({
        folio: "PRUEBA",
        driver: id,
      });
      let validateToken = tokens.validateDriver.get(user, newRequest);
      user.validateToken = validateToken;
      await newRequest.save();
      await user.save();
      let validateLink = "";
      if (env.development) {
        validateLink = `http://localhost:3000/validateDriver?token=${validateToken}`;
      } else if (env.staging) {
        validateLink = `https://pideloseguro.xyz/validateDriver?token=${validateToken}`;
      } else if (env.production) {
        validateLink = `https://pideloseguro.net/validateDriver?token=${validateToken}`;
      }
      await send.driverVerificationRequest("vidalcavazos@gmail.com", {
        fullname: `${user.firstName} ${user.firstLastName} ${user.secondLastName}`,
        phoneNumber: user?.phoneNumber ?? "",
        email: user?.email ?? "",
        dob: moment(user.dob).format("DD/MM/YYYY"),
        documentOne: user?.documents[0]?.uri ?? "Link",
        documentTwo: user?.documents[1]?.uri ?? "Link",
        validateLink,
      });
      return true;
    } catch (err) {
      throw new Error(err);
    }
  },
};

export default verificationRequestMutations;
