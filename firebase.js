/* ============================================================================
   Firebase Configuration & Initialization (firebase.js)
   Reads secure configuration parameters from environment variables (.env)
   ============================================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    onSnapshot, 
    query, 
    orderBy, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Helper function to safely read environment variables
const getEnvVar = (key) => {
    try {
        if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
            return import.meta.env[key];
        }
    } catch (e) {
        // Fallback for non-bundler environments
    }
    return '';
};

// Read Firebase credentials safely from environment variables
const firebaseConfig = {
    apiKey: getEnvVar('VITE_FIREBASE_API_KEY'),
    authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: getEnvVar('VITE_FIREBASE_APP_ID')
};

// Verify if environment variables are configured
if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'your_api_key_here') {
    console.warn("⚠️ Firebase environment variables are missing! Please set your actual API keys in the .env file.");
}

// Initialize Firebase Application
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore Database
const db = getFirestore(app);

// Export db instance and Firestore functions for script.js
export { 
    db, 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    onSnapshot, 
    query, 
    orderBy, 
    serverTimestamp 
};
