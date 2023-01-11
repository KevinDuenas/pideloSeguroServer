import { ApolloServer } from "apollo-server-express";
import { env } from "@config/environment";
import schema from "@graphql/schema";
import context from "@graphql/context";
import { WebSocketServer } from "ws";
import express from "express";
import { createServer } from "http";
import { useServer } from "graphql-ws/lib/use/ws";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

const playgroundSettings = {
  settings: {
    "editor.theme": "dark",
    "request.credentials": "include",
    playground: true,
    introspection: true,
  },
};

// Create an Express app and HTTP server; we will attach both the WebSocket
// server and the ApolloServer to this HTTP server.
const app = express();
const httpServer = createServer(app);

const wsServer = new WebSocketServer({
  // This is the `httpServer` we created in a previous step.
  server: httpServer,
  // Pass a different path here if app.use
  // serves expressMiddleware at a different path
  path: "/graphql",
});

// Hand in the schema we just created and have the
// WebSocketServer start listening.
const serverCleanup = useServer({ schema }, wsServer);

const apolloServer = new ApolloServer({
  schema,
  context,
  playground: !env.production ? playgroundSettings : false,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
  wsServer,
});

export { apolloServer, httpServer };
