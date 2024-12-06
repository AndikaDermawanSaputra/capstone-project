// services/storageService.js
const { Storage } = require('@google-cloud/storage');
require('dotenv').config();

// Membuat instance Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_CLOUD_KEY_PATH,  // Path ke file JSON kredensial
});

// Menentukan bucket
const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME);

// Fungsi untuk mengupload file ke Google Cloud Storage
const uploadFile = (filePath, destination) => {
  return bucket.upload(filePath, {
    destination: destination,
    public: true,
  });
};

module.exports = { uploadFile };
