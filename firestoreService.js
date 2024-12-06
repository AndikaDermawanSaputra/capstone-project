const admin = require('firebase-admin');
require('dotenv').config();   // Pastikan .env file sudah benar
const serviceAccount = require(process.env.FIREBASE_CREDENTIAL_PATH); 

// Inisialisasi Firebase app
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} else {
  admin.app(); // Gunakan app yang sudah ada jika sudah diinisialisasi
}

// Sekarang kamu bisa menggunakan Firestore atau layanan Firebase lainnya
const db = admin.firestore();

// Fungsi untuk menambahkan data ke Firestore

const addUserData = async (userData) => {
  const usersRef = db.collection('users');
  const docRef = await usersRef.add(userData);
  console.log('Document added with ID:', docRef.id);  // Pastikan id didapatkan
  return docRef.id;
};
