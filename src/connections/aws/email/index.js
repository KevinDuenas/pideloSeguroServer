import AWS from "@connections/aws/client";

const ses = new AWS.SES({ apiVersion: "2010-12-01" });

const getCommonConfig = (to) => ({
  Destination: {
    ToAddresses: [to],
  },
  Source: "Equipo PideloSeguro <no-reply@pideloseguro.net>",
});

const send = {
  driverVerificationRequest: (
    to,
    {
      fullname,
      phoneNumber,
      email,
      dob,
      documentOne,
      documentTwo,
      validateLink,
    }
  ) =>
    ses
      .sendTemplatedEmail({
        ...getCommonConfig(to),
        Template: "driver-verification-request",
        TemplateData: JSON.stringify({
          fullname,
          phoneNumber,
          email,
          dob,
          documentOne,
          documentTwo,
          validateLink,
        }),
      })
      .promise(),
  recoverPassword: (to, { link }) =>
    ses
      .sendTemplatedEmail({
        ...getCommonConfig(to),
        Template: "recover-password-ps",
        TemplateData: JSON.stringify({ link }),
      })
      .promise(),
};

export { send };
