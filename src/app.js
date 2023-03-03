// Express stuff
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Graphql stuff
import { apolloServer, httpServer } from "@graphql";

import { auth, onerp, main, stripeRouter } from "@routes";
import healthCheck from "@middlewares/health-check";

const corsConfig = {
  credentials: true,
  origin: true,
};
const app = express();
const start = async () => {
  await apolloServer.start();

  // Middlewares
  app.use(express.json(), cors(corsConfig), cookieParser());

  apolloServer.applyMiddleware({
    app,
    cors: corsConfig,
    path: "/graphql",
  });

  httpServer.listen(4041);

  // Routes
  app.use("/auth", auth);
  app.use("/onerp", onerp);
  app.use("/main", main);
  app.use("/stripe", stripeRouter);
  app.use("/", healthCheck);
};

start();

export default app;
