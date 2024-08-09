import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'


// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getFirestore, doc, setDoc, updateDoc, deleteDoc,collection, query, where, getDoc, getDocs, onSnapshot, arrayUnion, arrayRemove, increment } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, uploadString} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDX6vGZfVTfzNu3lmkyE7pJaTQQTqYFfS0",
  authDomain: "menu-rd.firebaseapp.com",
  projectId: "menu-rd",
  storageBucket: "menu-rd.appspot.com",
  messagingSenderId: "937838567961",
  appId: "1:937838567961:web:328a332afaaabfbd0d8088",
  measurementId: "G-BEM8386VEH"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
const analytics = getAnalytics(appFirebase);

const db = getFirestore(appFirebase);
const auth = getAuth(appFirebase);
const gProvider = new GoogleAuthProvider();

const storage = getStorage();

import { crearId }  from './createId.js';


const bajarResolucionImg = async (img) => {
  await new Promise(resolve => {
      img.onload = resolve;
  });

  const maxWidth = 500;
  const maxHeight = 500;

  let newWidth = img.width;
  let newHeight = img.height;

  // Reducir el ancho si excede el máximo permitido
  if (newWidth > maxWidth) {
      const ratio = maxWidth / newWidth;
      newWidth = maxWidth;
      newHeight *= ratio;
  }

  // Reducir la altura si excede el máximo permitido
  if (newHeight > maxHeight) {
      const ratio = maxHeight / newHeight;
      newHeight = maxHeight;
      newWidth *= ratio;
  }

  const canvas = document.createElement('canvas');
  canvas.width = newWidth;
  canvas.height = newHeight;
  
  try{
    const canvas_ctx = await canvas.getContext("2d");
    canvas_ctx.drawImage(img, 0, 0, newWidth, newHeight);
    return canvas.toDataURL('image/png')
  }catch(error){
    console.log('Error al obtener la imagen', error)
  }
}



const app = createApp(App)

app.config.globalProperties.crearId = crearId;

app.config.globalProperties.initializeApp = initializeApp;
app.config.globalProperties.getFirestore = getFirestore;
app.config.globalProperties.doc = doc;
app.config.globalProperties.setDoc = setDoc;
app.config.globalProperties.updateDoc = updateDoc;
app.config.globalProperties.db = db;
app.config.globalProperties.deleteDoc = deleteDoc;
app.config.globalProperties.collection = collection;
app.config.globalProperties.query = query;
app.config.globalProperties.where = where;
app.config.globalProperties.getDoc = getDoc;
app.config.globalProperties.auth = auth;
app.config.globalProperties.signInWithEmailAndPassword = signInWithEmailAndPassword;
app.config.globalProperties.GoogleAuthProvider = GoogleAuthProvider;
app.config.globalProperties.gProvider = gProvider;
app.config.globalProperties.signInWithPopup = signInWithPopup;
app.config.globalProperties.onAuthStateChanged = onAuthStateChanged;
app.config.globalProperties.signOut = signOut;
app.config.globalProperties.getStorage = getStorage;
app.config.globalProperties.storage = storage;
app.config.globalProperties.ref = ref;
app.config.globalProperties.uploadBytes = uploadBytes;
app.config.globalProperties.getDownloadURL = getDownloadURL;
app.config.globalProperties.uploadString = uploadString;
app.config.globalProperties.getDocs = getDocs;
app.config.globalProperties.onSnapshot = onSnapshot;
app.config.globalProperties.deleteObject = deleteObject;
app.config.globalProperties.bajarResolucionImg = bajarResolucionImg;
app.config.globalProperties.arrayUnion = arrayUnion;
app.config.globalProperties.arrayRemove = arrayRemove;
app.config.globalProperties.increment = increment;


app.mount('#app')