import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { getDatabase } from "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyDIa5hix7SCn54Qg9n7ehOYKtMDCRu6MsA",
  authDomain: "fir-244f7.firebaseapp.com",
  databaseURL: "https://fir-244f7-default-rtdb.firebaseio.com",
  projectId: "fir-244f7",
  storageBucket: "fir-244f7.appspot.com",
  messagingSenderId: "976983997413",
  appId: "1:976983997413:web:2f1c70e2136ac0782d8d0c",
  measurementId: "G-97VX7CGFBP",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const database = getDatabase(app);
