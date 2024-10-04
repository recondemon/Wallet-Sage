// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyADBch2-blhl8Iu5EDFLnDp2VlXvV00_A8',
  authDomain: 'money-sage-1354b.firebaseapp.com',
  projectId: 'money-sage-1354b',
  storageBucket: 'money-sage-1354b.appspot.com',
  messagingSenderId: '466052455922',
  appId: '1:466052455922:web:90c0d753dc98d910b35f6b',
  measurementId: 'G-235E4V9XWP',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
