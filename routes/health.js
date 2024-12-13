
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const preprocessSymptoms = require('../utils/preprocess');
const fetch = require('node-fetch');
const tf = require('@tensorflow/tfjs-node'); // Gunakan TensorFlow.js untuk Node.js

// Daftar semua gejala (urutan harus sesuai model)
const allFeatures = [
      'gatal', 'ruam kulit', 'erupsi kulit nodal', 'bersin terus menerus', 'menggigil', 'kedinginan', 'nyeri sendi', 'nyeri perut', 'asam lambung', 'luka di lidah', 'penyusutan otot', 'muntah', 'sensasi terbakar saat buang air kecil', 'bercak saat buang air kecil', 'kelelahan', 'penambahan berat badan', 'kecemas>
    ];


// Daftar kelas penyakit sesuai model
const diseaseClasses = [
      'AIDS', 'Alergi', 'Artritis', 'Asma Bronkial', 'Cacar Air', 'Cholestasis Kronis', 'Dengue', 'Diabetes ', 'Flu Biasa', 'Gastroenteritis', 'Hepatitis A', 'Hepatitis Alkoholik', 'Hepatitis B', 'Hepatitis C', 'Hepatitis D', 'Hepatitis E', 'Hipertiroidisme', 'Hipoglikemia', 'Hipotiroidisme', 'Hypertension ', 'I>
     ];

// Fungsi untuk memproses input gejala menjadi tensor
function processInput(inputFeatures, allFeatures) {
  const processedInput = allFeatures.map(feature => inputFeatures.includes(feature) ? 1 : 0);
  return tf.tensor2d([processedInput]); // Tambahkan dimensi batch
}

      
// Fungsi untuk memproses input gejala menjadi tensor
function processInput(inputFeatures, allFeatures) {
  const processedInput = allFeatures.map(feature => inputFeatures.includes(feature) ? 1 : 0);
  return tf.tensor2d([processedInput]); // Tambahkan dimensi batch
}

/ Endpoint untuk mendapatkan daftar semua gejala
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

// Endpoint untuk mendiagnosis berdasarkan gejala
router.post('/diagnose', async (req, res) => {
  const { symptoms } = req.body;

  if (!symptoms || !Array.isArray(symptoms)) {
    return res.status(400).json({ success: false, message: 'Gejala tidak valid' });
  }

  try {
    // Proses input gejala
    const inputTensor = processInput(symptoms, allFeatures);

    // URL model di Google Cloud Storage
    const modelEndpoint = 'https://storage.googleapis.com/model-capstone-c242/tfjs_model/model.json';

    // Muat model dari Cloud Storage
    const model = await tf.loadLayersModel(modelEndpoint);
    console.log('Model berhasil dimuat dari GCS');

    // Prediksi









const prediction = model.predict(inputTensor);
    const probabilities = (await prediction.array())[0]; // Probabilitas untuk setiap kelas

    // Identifikasi penyakit dengan probabilitas tertinggi
    const highestIndex = probabilities.indexOf(Math.max(...probabilities));
    const diagnosis = diseaseClasses[highestIndex];

    res.status(200).json({
      success: true,
      message: 'Diagnosis berhasil dilakukan',
      data: {
        diagnosis,
        confidence: `${(probabilities[highestIndex] * 100).toFixed(2)}%`,
      },
    });
  } catch (error) {
    console.error('Error dalam proses diagnosis:', error);
    res.status(500).json({ success: false, message: 'Gagal melakukan diagnosis', error: error.message });
  }
});


//API Rekomendasi
// API Rekomendasi Kesehatan
router.post('/recommendations', async (req, res) => {
  const { symptoms } = req.body;

  // Validasi input
  if (!Array.isArray(symptoms) || symptoms.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Symptoms are required and should be a non-empty array.',
    });
  }
 // Menggunakan aturan atau mapping untuk memberikan rekomendasi berdasarkan gejala
  const recommendations = {
    'demam': 'Pastikan untuk banyak istirahat dan minum banyak air. Jika demam terus berlanjut, hubungi dokter.',
    'batuk': 'Cobalah untuk minum air hangat dan menggunakan obat batuk. Jika batuk berlanjut, konsultasikan ke dokter.',
    'sakit kepala': 'Cobalah untuk istirahat dan menghindari stres. Jika sakit kepala terus berlanjut, pertimbangkan untuk berkonsultasi dengan dokter.',
    'mual': 'Minum air jahe atau teh peppermint untuk meredakan mual. Jika mual terus berlanjut, periksa ke dokter.',
  };

  let recommendationMessage = 'Kami tidak memiliki rekomendasi untuk gejala tersebut.';

  // Mengecek gejala yang diberikan dan memberikan rekomendasi
  symptoms.forEach(symptom => {
    if (recommendations[symptom]) {
      recommendationMessage = recommendations[symptom];
    }
  });

  // Mengirim respons rekomendasi
  res.status(200).json({
    success: true,
    message: 'Health recommendation generated',
    data: { recommendation: recommendationMessage },
  });
});

module.exports = router;
