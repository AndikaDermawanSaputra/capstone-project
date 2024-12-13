require('dotenv').config(); // Memuat variabel dari file .env
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const healthRoutes = require('./routes/health');
const { addUserData, storeDiagnosisHistory } = require('./firestoreService');
const admin = require('firebase-admin');

// Memuat kredensial Firebase dari .env
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

// Mengatur express app
const app = express();
app.use(bodyParser.json());

// Menampilkan project ID dan bucket name
const project = process.env.GOOGLE_CLOUD_PROJECT_ID;  // Mengambil Project ID
const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME; // Mengambil Bucket Name

console.log('capstone-project-c242-ps493:', project);
console.log('model-capstone-c242:', bucketName);

// Routes
app.use(express.json());  // Pastikan body request bisa diparse dalam format JSON
app.use('/api/auth', authRoutes);  // Menggunakan rute untuk autentikasi (register, login)
app.use('/api/user', userRoutes);  // Menggunakan rute untuk pengguna (save, edit data)
app.use('/api/health', healthRoutes);  // Menggunakan rute untuk health (diagnose, recommendations)

// Rute untuk menyimpan riwayat diagnosis
app.post('/api/health/diagnosis/:userUid', async (req, res) => {
  const { userUid } = req.params;
  const diagnoseData = req.body;  // Data diagnosis yang diterima dalam request body

  try {
    await storeDiagnosisHistory(userUid, diagnoseData);  // Memanggil fungsi untuk menyimpan riwayat diagnosis
    res.status(200).json({ success: true, message: 'Diagnosis history stored successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to store diagnosis history' });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



