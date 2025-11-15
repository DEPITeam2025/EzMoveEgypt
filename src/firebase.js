// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCHkcc6E_8-YYXW7oYWpPnqc68h_3Ao_X4",
  authDomain: "ezmoveegypt.firebaseapp.com",
  projectId: "ezmoveegypt",
  storageBucket: "ezmoveegypt.firebasestorage.app",
  messagingSenderId: "128889027645",
  appId: "1:128889027645:web:55619730387a0620fe3e54",
  measurementId: "G-FGFS6PV2RQ",
};

const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);
