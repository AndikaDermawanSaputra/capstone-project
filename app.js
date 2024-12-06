require('dotenv').config(); // Memuat variabel dari file .env
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const healthRoutes = require('./routes/health');
const { uploadFile } = require('./services/storageService');
const { addUserData } = require('./services/firestoreService');


const app = express();
app.use(bodyParser.json());

const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;  // Mengambil Project ID
const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME; // Mengambil Bucket Name

console.log('Project ID:', projectId);
console.log('Bucket Name:', bucketName);

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/health', healthRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Server
const PORT = 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

