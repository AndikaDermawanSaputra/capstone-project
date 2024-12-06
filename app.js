require('dotenv').config(); // Memuat variabel dari file .env
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const healthRoutes = require('./routes/health');
const { addUserData } = require('./firestoreService');
const admin = require('firebase-admin');


// Inisialisasi Firebase app
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} else {
  admin.app(); // Gunakan app yang sudah ada
}

// Sekarang kamu bisa mengimpor firestoreService.js atau langsung menggunakan Firestore di sini
const db = admin.firestore();
const app = express();
app.use(bodyParser.json());

const project = process.env.GOOGLE_CLOUD_PROJECT_ID;  // Mengambil Project ID
const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME; // Mengambil Bucket Name

console.log('capstone-project-442701:', project);
console.log('capstone-project-442701.appspot.com:', bucketName);

// Routes
// Middleware untuk parsing JSON
app.use(express.json());  // Pastikan body request bisa diparse dalam format JSON
// Menggunakan rute untuk autentikasi (register, login)
app.use('/api/auth', authRoutes);
// Menggunakan rute untuk pengguna (save, edit data)
app.use('/api/user', userRoutes);
// Menggunakan rute untuk health (diagnose, recommendations)
app.use('/api/health', healthRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Server
const PORT = 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



