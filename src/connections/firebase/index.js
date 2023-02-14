import fb from "firebase-admin";
import { firebaseAdminConfig, firebaseDatabaseURL } from "@config/environment";

fb.initializeApp({
  credential: fb.credential.cert(firebaseAdminConfig),
  databaseURL: firebaseDatabaseURL,
});

const firestoreDB = fb.firestore();

export { firestoreDB };
