import { db, api } from "@config/loggers";
import { port } from "@config/environment";
import { connectDB } from "@db/scripts";
import { startTripsCronjobs } from "@cronJobs/trips";
import app from "./app";

const start = async () => {
  db.await("Connecting to database");
  try {
    await connectDB();
    db.success("🔥  Connected to DB");
    startTripsCronjobs();
    app.listen(port);
    api.success(`🚀  GraphQL server running at port: ${port}`);
  } catch (e) {
    db.error("Failed to connect to DB", e);
    api.error("Not able to run GraphQL server");
  }
};

start();
