import { VerificationRequest, User } from "@db/models";
import { send } from "@connections/aws/email";
import moment from "moment";

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

      await newRequest.save();
      await send.driverVerificationRequest("vidalcavazos@gmail.com", {
        fullname: `${user.firstName} ${user.firstLastName} ${user.secondLastName}`,
        phoneNumber: user.phoneNumber,
        email: user.email,
        dob: moment(user.dob).format("DD/MM/YYYY"),
        documentOne: user.documents[0].uri,
        documentTwo: user.documents[1].uri,
      });
      return true;
    } catch (err) {
      throw new Error(err);
    }
  },
};

export default verificationRequestMutations;
