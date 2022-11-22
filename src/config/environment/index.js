import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT;

const secrets = {
  access: process.env.ACCESS_SECRET,
  refresh: process.env.REFRESH_SECRET,
};

const mongo = {
  url: process.env.MONGO_URI,
};

const env = {
  development: process.env.NODE_ENV === "development",
  test: process.env.NODE_ENV === "test",
  staging: process.env.NODE_ENV === "staging",
  production: process.env.NODE_ENV === "production",
};

const AWSConfig = {
  accessKeyId: process.env.AWS_S3_BUCKET_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_BUCKET_SECRET_ACCESS_KEY,
  region: process.env.AWS_S3_BUCKET_REGION,
  s3Bucket: process.env.AWS_S3_BUCKET_NAME,
};

const StripeConfig = {
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  scretKey: process.env.STRIPE_SECRET_KEY,
};

const twilioConfig = {
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  verifyService: process.env.TWILIO_VERIFY_SERVICE,
};

export { port, secrets, env, mongo, AWSConfig, StripeConfig, twilioConfig };
