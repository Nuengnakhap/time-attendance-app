import { initializeApp } from "firebase/app";

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/functions";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBANTsbRKYV3pAx1TbeCyGLstNiQQcmCwU",
  authDomain: "time-attendance-onez.firebaseapp.com",
  projectId: "time-attendance-onez",
  storageBucket: "time-attendance-onez.appspot.com",
  messagingSenderId: "642856516925",
  appId: "1:642856516925:web:16b06daa42102fca15d954",
  measurementId: "G-FEJY2LHJXV",
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);
const db = getFirestore(app);

const firebase = { app, storage, db };

export default firebase;
