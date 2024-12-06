// services/firestoreService.js
const admin = require('firebase-admin');
require('dotenv').config();

// Menginisialisasi Firebase Admin SDK dengan kredensial Firestore
admin.initializeApp({
  credential: admin.credential.cert(process.env.FIREBASE_PRIVATE_KEY_PATH),  // Path ke file kredensial
  storageBucket: process.env.FIREBASE_BUCKET_NAME,
});

// Mendapatkan referensi ke Firestore
const db = admin.firestore();

// Fungsi untuk menambahkan data ke Firestore
const addUserData = async (userData) => {
  const usersRef = db.collection('users');
  const docRef = await usersRef.add(userData);
  return docRef.id;
};

module.exports = { addUserData };
