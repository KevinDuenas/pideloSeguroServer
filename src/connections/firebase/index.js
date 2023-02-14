import fb from "firebase-admin";
import { firebaseAdminConfig, firebaseDatabaseURL } from "@config/environment";
console.log("one", firebaseAdminConfig);
console.log("two", firebaseDatabaseURL);
fb.initializeApp({
  credential: fb.credential.cert(firebaseAdminConfig),
  databaseURL: firebaseDatabaseURL,
});

const firestoreDB = fb.firestore();

export { firestoreDB };
