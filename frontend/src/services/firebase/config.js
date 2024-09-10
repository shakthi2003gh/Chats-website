import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyChflV3GRguXongoUaWkOuXfS4ixFfoOwo",
  authDomain: "chats-webapp.firebaseapp.com",
  projectId: "chats-webapp",
  storageBucket: "chats-webapp.appspot.com",
  messagingSenderId: "776357188216",
  appId: "1:776357188216:web:039aede26880306ba9138d",
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
