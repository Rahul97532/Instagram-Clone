import firebase from 'firebase';
const firebaseConfig = {
  apiKey: "AIzaSyC7YdAJeBEgS33lsEVSXomHjwyDFfDSAl0",
  authDomain: "instagram-clone-fad16.firebaseapp.com",
  projectId: "instagram-clone-fad16",
  storageBucket: "instagram-clone-fad16.appspot.com",
  messagingSenderId: "105210439355",
  appId: "1:105210439355:web:9db5079eed12bfa230ab9e",
  measurementId: "G-7L5CDG0T4K",
};
const firebaseApp= firebase.initializeApp(firebaseConfig);

const db=firebaseApp.firestore();
const auth= firebaseApp.auth();
const storage=firebaseApp.storage();
export {db, auth, storage};