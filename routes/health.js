const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const preprocessSymptoms = require('../utils/preprocess');

// Daftar semua gejala (urutan harus sesuai model)
const allFeatures = ['gatal', 'ruam kulit', 'erupsi kulit nodal', 'bersin terus menerus', 'menggigil', 'kedinginan', 'nyeri sendi', 'nyeri perut', 'asam lambung', 'luka di lidah', 'penyusutan otot', 'muntah', 'sensasi terbakar saat buang air kecil', 'bercak saat buang air kecil', 'kelelahan', 'penambahan berat badan', 'kecemasan', 'tangan dan kaki dingin', 'perubahan mood', 'penurunan berat badan', 'gelisah', 'lesu', 'bercak di tenggorokan', 'gula darah tidak teratur', 'batuk', 'demam tinggi', 'mata cekung', 'sesak napas', 'berkeringat', 'dehidrasi', 'gangguan pencernaan', 'sakit kepala', 'kulit kekuningan', 'urine gelap', 'mual', 'hilang nafsu makan', 'nyeri di belakang mata', 'sakit punggung', 'sembelit', 'sakit perut', 'diare', 'demam ringan', 'urine kuning', 'mata kuning', 'gagal hati akut', 'pembengkakan perut', 'kelenjar getah bening bengkak', 'kelelahan', 'penglihatan buram', 'dahak', 'iritasi tenggorokan', 'mata merah', 'tekanan sinus', 'pilek', 'hidung tersumbat', 'nyeri dada', 'kelemahan di anggota tubuh', 'detak jantung cepat', 'nyeri saat buang air besar', 'nyeri di area anus', 'tinja berdarah', 'iritasi di anus', 'nyeri leher', 'pusing', 'kram', 'memar', 'obesitas', 'kaki bengkak', 'pembuluh darah bengkak', 'wajah dan mata bengkak', 'tiroid membesar', 'kuku rapuh', 'pembengkakan ekstremitas', 'rasa lapar berlebihan', 'kontak di luar nikah', 'bibir kering dan bertingling', 'bicara cadel', 'nyeri lutut', 'nyeri sendi pinggul', 'kelemahan otot', 'leher kaku', 'sendi bengkak', 'kekakuan pergerakan', 'gerakan berputar', 'kehilangan keseimbangan', 'ketidakstabilan', 'kelemahan satu sisi tubuh', 'hilang indra penciuman', 'ketidaknyamanan kandung kemih', 'bau urine menyengat', 'rasa ingin buang air kecil terus', 'gas keluar', 'gatal dalam', 'penampilan toksik', 'depresi', 'iritabilitas', 'nyeri otot', 'altered sensorium', 'bintik merah di tubuh', 'nyeri perut', 'menstruasi tidak normal', 'bercak dischromic', 'mata berair', 'nafsu makan meningkat', 'poliuria', 'riwayat keluarga', 'dahak lendir', 'dahak berkarat', 'kurang konsentrasi', 'gangguan penglihatan', 'menerima transfusi darah', 'menerima suntikan tidak steril', 'koma', 'pendarahan lambung', 'pembesaran perut', 'riwayat konsumsi alkohol', 'kelebihan cairan', 'darah di dahak', 'vena menonjol di betis', 'palpitasi', 'nyeri saat berjalan', 'jerawat bernanah', 'komedo', 'bekas luka', 'kulit mengelupas', 'debu seperti perak', 'lekukan kecil di kuku', 'kuku meradang', 'lepuh', 'luka merah di hidung', 'kerak kuning mengalir', 'diagnosa'
    ];

// API Pendeteksi Kesehatan dengan Gejala
router.post('/diagnose',  async (req, res) => {
  const { symptoms } = req.body;

  if (!symptoms || !Array.isArray(symptoms)) {
    return res.status(400).json({ success: false, message: 'Invalid symptoms' });
  }

  try {
    const processedSymptoms = preprocessSymptoms(symptoms, allFeatures);
    const modelEndpoint = 'https://us-central1-aiplatform.googleapis.com/v1beta1/projects/capstone-project-442701/locations/us-central1/endpoints/6720013858339028992:predict'; // Ganti dengan endpoint model GCP Anda

    const response = await fetch(modelEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: processedSymptoms }),
    });

    const result = await response.json();
    const diseaseClasses =['AIDS', 'Alergi', 'Artritis', 'Asma Bronkial', 'Cacar Air', 'Cholestasis Kronis', 'Dengue', 'Diabetes ', 'Flu Biasa', 'Gastroenteritis', 'Hepatitis A', 'Hepatitis Alkoholik', 'Hepatitis B', 'Hepatitis C', 'Hepatitis D', 'Hepatitis E', 'Hipertiroidisme', 'Hipoglikemia', 'Hipotiroidisme', 'Hypertension ', 'Impetigo', 'Infeksi Jamur', 'Infeksi Saluran Kemih', 'Jerawat', 'Malaria', 'Migrain', 'Osteoartritis', 'Paralisia (perdarahan otak)', 'Penyakit Kuning', 'Penyakit Refluks Gastroesofagus (GERD)', 'Penyakit Tukak Lambung', 'Pneumonia', 'Psoriasis', 'Reaksi Obat', 'Serangan Jantung', 'Spondilosis Servikal', 'Tifus', 'Tuberkulosis', 'Varises', 'Vertigo', 'Wasir Dimorfik'
    ];

    const highestIndex = result.probabilities.indexOf(Math.max(...result.probabilities));
    const diagnosis = diseaseClasses[highestIndex];

    res.status(200).json({
      success: true,
      message: 'Diagnosis successful',
      data: { diagnosis, confidence: result.probabilities[highestIndex] },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error during diagnosis' });
  }
});

// API Rekomendasi Kesehatan
router.post('/recommendations',  async (req, res) => {
  const { symptoms } = req.body;

  const symptomsText = `Saya mengalami ${symptoms.join(', ')}`;
  const vertexEndpoint = 'https://us-central1-aiplatform.googleapis.com/v1beta1/projects/capstone-project-442701/locations/us-central1/endpoints/5435573170864128000:predict'; // Ganti dengan endpoint model GCP Anda

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

