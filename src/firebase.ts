import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import type { FirebaseOptions } from "firebase/app";

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID as string,
  measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID as string
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);