import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDnvVxNqk9QXhrV-M56MSMRCM8PBHkWX3g",
    authDomain: "my-awesome-project-ai-app.firebaseapp.com",
    projectId: "my-awesome-project-ai-app",
    storageBucket: "my-awesome-project-ai-app.firebasestorage.app",
    messagingSenderId: "366011355263",
    appId: "1:366011355263:web:4272e3f37cc29fdfe9ef4a"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);