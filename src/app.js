// Express stuff
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Graphql stuff
import server from "@graphql";

import { auth } from "@routes";
import healthCheck from "@middlewares/health-check";

const corsConfig = {
  credentials: true,
  origin: true,
};
const app = express();
const start = async () => {
  await server.start();

  // Middlewares
  app.use(express.json(), cors(corsConfig), cookieParser());

  server.applyMiddleware({
    app,
    cors: corsConfig,
    path: "/graphql",
  });

  // Routes
  app.use("/auth", auth);
  app.use("/", healthCheck);
};

start();

export default app;
