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

// Firestore database
const db = admin.firestore();

/**
 * Fungsi untuk menambahkan data pengguna ke Firestore
 * @param {Object} userData - Data pengguna yang ingin disimpan
 * @returns {Promise<string>} - ID dokumen yang baru dibuat
 */
const addUserData = async (userData) => {
  try {
    const usersRef = db.collection('users');
    const docRef = await usersRef.add(userData);
    console.log('Document added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding document:', error);
    throw new Error('Gagal menambahkan data pengguna');
  }
};


/**
 * Fungsi untuk menyimpan riwayat diagnosis pengguna
 * @param {string} userUid - UID pengguna
 * @param {Object} diagnoseData - Data diagnosis yang ingin disimpan
 * @returns {Promise<void>}
 */
const storeDiagnosisHistory = async (userUid, diagnoseData) => {
  try {
    const historyRef = db.collection('diagnose_history').doc(userUid);
    await historyRef.set({
      ...diagnoseData,
      timestamp: admin.firestore.FieldValue.serverTimestamp(), // Tambahkan timestamp
    }, { merge: true }); // Merge untuk mencegah overwrite data lama
    console.log('Diagnosis history stored for user:', userUid);
  } catch (error) {
    console.error('Error storing diagnosis history:', error);
    throw new Error('Gagal menyimpan riwayat diagnosis');
  }
};

module.exports = { addUserData, storeDiagnosisHistory };
