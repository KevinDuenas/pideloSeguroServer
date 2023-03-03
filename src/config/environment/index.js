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

const firebaseAdminConfig = {
  type: process.env.FB_ADMIN_TYPE,
  project_id: process.env.FB_ADMIN_PROJECT_ID,
  private_key_id: process.env.FB_ADMIN_PRIVATE_KEY_ID,
  private_key: process.env.FB_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.FB_ADMIN_CLIENT_EMAIL,
  client_id: process.env.FB_ADMIN_CLIENT_ID,
  auth_uri: process.env.FB_ADMIN_AUTH_URI,
  token_uri: process.env.FB_ADMIN_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FB_ADMIN_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FB_ADMIN_CLIENT_CERT_URL,
};

const firebaseDatabaseURL = process.env.FB_ADMIN_DATABASE_URL;

const googleMapsConfig = {
  apiKey: process.env.GOOGLE_MAPS_API_KEY,
};

const stripeConfig = {
  apiKey: process.env.STRIPE_API_KEY,
  webhookKey: process.env.STRIPE_WEBHOOKS_KEY,
};
const ONERPApiKey = process.env.ONERP_API_KEY;

const pideloSeguroApiKey = process.env.PS_API_KEY;

const expoAccessToken = process.env.EXPO_ACCESS_TOKEN;

export {
  port,
  secrets,
  env,
  mongo,
  AWSConfig,
  StripeConfig,
  twilioConfig,
  googleMapsConfig,
  firebaseAdminConfig,
  firebaseDatabaseURL,
  stripeConfig,
  ONERPApiKey,
  pideloSeguroApiKey,
  expoAccessToken,
};
