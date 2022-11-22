import twilio from "twilio";
import { twilioConfig } from "@config/environment";

const twilioClient = twilio(twilioConfig.accountSid, twilioConfig.authToken);

export { twilioClient };
