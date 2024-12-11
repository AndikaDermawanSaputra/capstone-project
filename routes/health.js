                                               
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const preprocessSymptoms = require('../utils/preprocess');
const fetch = require('node-fetch');
const tf = require('@tensorflow/tfjs-node'); // Gunakan TensorFlow.js untuk Node.js

// Daftar semua gejala (urutan harus sesuai model)
const allFeatures = [
      'gatal', 'ruam kulit', 'erupsi kulit nodal', 'bersin terus menerus', 'menggigil', 'kedinginan', 'nyeri sen>
    ];

// Daftar kelas penyakit sesuai model
const diseaseClasses = [
      'AIDS', 'Alergi', 'Artritis', 'Asma Bronkial', 'Cacar Air', 'Cholestasis Kronis', 'Dengue', 'Diabetes ', '>
    ];


// Fungsi untuk memproses input gejala menjadi tensor
function processInput(inputFeatures, allFeatures) {
  const processedInput = allFeatures.map(feature => inputFeatures.includes(feature) ? 1 : 0);
  return tf.tensor2d([processedInput]); // Tambahkan dimensi batch
}

// Endpoint untuk mendapatkan daftar semua gejala
router.get('/symptoms', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Daftar gejala berhasil diambil',
      data: allFeatures,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil daftar gejala', error: error.message });
  }
});

// API Pendeteksi Kesehatan dengan Gejala
router.post('/diagnose', async (req, res) => {
  const { symptoms } = req.body;

  // Validasi input gejala
  if (!symptoms || !Array.isArray(symptoms)) {
    return res.status(400).json({ success: false, message: 'Invalid symptoms' });
  }

  try {
    // Preprocessing gejala untuk dimasukkan ke model
    const processedSymptoms = preprocessSymptoms(symptoms, allFeatures);













    // Endpoint model di Google Cloud
    const modelEndpoint = 'https://us-central1-aiplatform.googleapis.com/v1beta1/projects/capstone-project-44270>

    // Mengirimkan data ke model endpoint
    const response = await fetch(modelEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer YOUR_ACCESS_TOKEN`, // Gantilah dengan token yang benar jika perlu
      },
      body: JSON.stringify({ instances: [processedSymptoms] }), // Menggunakan array untuk instances
    });

    const result = await response.json();
    const diseaseClasses = ['AIDS', 'Alergi', 'Artritis', 'Asma Bronkial', 'Cacar Air', 'Cholestasis Kronis', 'D>

    // Menentukan diagnosis berdasarkan probabilitas tertinggi
    const highestIndex = result.predictions[0].indexOf(Math.max(...result.predictions[0]));
    const diagnosis = diseaseClasses[highestIndex];

    // Mengirimkan hasil diagnosa ke client
    res.json({
      success: true,
      diagnosis: diagnosis,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error during diagnosis' });
  }
});

// API Rekomendasi Kesehatan
router.post('/recommendations',  async (req, res) => {
  const { symptoms } = req.body;

  const symptomsText = `Saya mengalami ${symptoms.join(', ')}`;
  const vertexEndpoint = 'https://us-central1-aiplatform.googleapis.com/v1beta1/projects/capstone-project-442701>

  try {
    const response = await fetch(vertexEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: symptomsText }] }] }),
    });

    const result = await response.json();
    const recommendation = result.contents[0].parts[0].text;

    res.status(200).json({
      success: true,
      message: 'Health recommendation generated',
      data: { recommendation },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error generating recommendation' });
  }
});

module.exports = router;
