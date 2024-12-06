const { Storage } = require('@google-cloud/storage');
require('dotenv').config();

// Membuat koneksi ke Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

// Mendapatkan referensi ke bucket yang ditentukan di .env
const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME);

module.exports = bucket;
