import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import type { FirebaseOptions } from "firebase/app";

const firebaseConfig: FirebaseOptions = {
  apiKey: 'AIzaSyB6xji7cb-AQKh6z5fCq5WbmB8ORrkiq4k',
  authDomain: 'political-youth-of-ukraine.firebaseapp.com',
  projectId: 'political-youth-of-ukraine',
  storageBucket: 'political-youth-of-ukraine.firebasestorage.app',
  messagingSenderId: '892983040185',
  appId: '1:892983040185:web:b8c6a994e11d81854be368',
  measurementId: 'G-CTC3J4QGRZ'
};

export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
