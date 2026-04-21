import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDfwkxrDu84aSavw7tc5yra62__T6ghbVw",
  authDomain: "gen-lang-client-0709280604.firebaseapp.com",
  projectId: "gen-lang-client-0709280604",
  storageBucket: "gen-lang-client-0709280604.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
