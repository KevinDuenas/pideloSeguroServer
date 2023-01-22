import fb from "firebase-admin";
import serviceAccount from "./../../../serviceAccountKey.json";

fb.initializeApp({
  credential: fb.credential.cert(serviceAccount),
  databaseURL: "https://pideloseguro-default-rtdb.firebaseio.com",
});

const firestoreDB = fb.firestore();

export { firestoreDB };
