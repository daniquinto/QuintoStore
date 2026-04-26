import { initializeApp } from "firebase/app";



const firebaseConfig = {
  apiKey: "AIzaSyAfMkMXKjRv-OJjFogz_7g1yE_DsPvDOAs",
  authDomain: "mystore-ae8cf.firebaseapp.com",
  projectId: "mystore-ae8cf",
  storageBucket: "mystore-ae8cf.firebasestorage.app",
  messagingSenderId: "1054479431498",
  appId: "1:1054479431498:web:123965ba2ae4fef75773b3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
