import { ApolloServer } from "apollo-server-express";
import { env } from "@config/environment";
import schema from "@graphql/schema";
import context from "@graphql/context";

const playgroundSettings = {
  settings: {
    "editor.theme": "dark",
    "request.credentials": "include",
    playground: true,
    introspection: true,
  },
};

const apolloServer = new ApolloServer({
  schema,
  context,
  playground: !env.production ? playgroundSettings : false,
});

export default apolloServer;
