import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "AIzaSyAPpYXPZ75lAgmig_7taZ7xkw8_KZBZLL0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "exclade2k26.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "exclade2k26",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "exclade2k26.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "584976214387",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "1:584976214387:web:8b087b64ef59276c973d06",
};

export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseDb = getFirestore(firebaseApp);

export function getSecondaryAuth() {
  const secondaryName = "admin-user-creation";
  const secondaryApp = getApps().find((app) => app.name === secondaryName) ?? initializeApp(firebaseConfig, secondaryName);
  return getAuth(secondaryApp);
}
