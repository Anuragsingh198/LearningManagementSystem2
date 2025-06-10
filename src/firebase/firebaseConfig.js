
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAixKbuUJK437IAlGpn3o5pJpuquScPTGg",
  authDomain: "learning--management-system.firebaseapp.com",
  projectId: "learning--management-system",
  storageBucket: "learning--management-system.firebasestorage.app",
  messagingSenderId: "1035243748129",
  appId: "1:1035243748129:web:cb31ff874830c6eb635c60",
  measurementId: "G-LWJEBZ7BDD"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);