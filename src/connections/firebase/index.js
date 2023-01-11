import { initializeApp } from "firebase-admin/app";
import { credential } from "firebase-admin";
import serviceAccount from "./../../../serviceAccountKey.json";

initializeApp({
  credential: credential.cert(serviceAccount),
  databaseURL: "https://pideloseguro-default-rtdb.firebaseio.com",
});

import { PubSub } from "graphql-firebase-subscriptions";
const pubSub = new PubSub({ onlyNew: true });

export { pubSub };
