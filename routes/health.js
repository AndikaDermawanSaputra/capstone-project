const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const preprocessSymptoms = require('../utils/preprocess');

// Daftar semua gejala (urutan harus sesuai model)
const allFeatures = ['gatal', 'ruam kulit', 'erupsi kulit nodal', 'bersin terus menerus', 'menggigil', 'kedingin>
    ];

// API Pendeteksi Kesehatan dengan Gejala
router.post('/diagnose',  async (req, res) => {
  const { symptoms } = req.body;

  if (!symptoms || !Array.isArray(symptoms)) {
    return res.status(400).json({ success: false, message: 'Invalid symptoms' });
  }

  try {
    const processedSymptoms = preprocessSymptoms(symptoms, allFeatures);
    const modelEndpoint = 'https://us-central1-aiplatform.googleapis.com/v1beta1/projects/capstone-project-44270>

    const response = await fetch(modelEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: processedSymptoms }),
    });

    const result = await response.json();
    const diseaseClasses =['AIDS', 'Alergi', 'Artritis', 'Asma Bronkial', 'Cacar Air', 'Cholestasis Kronis', 'De>
    ];

    const highestIndex = result.probabilities.indexOf(Math.max(...result.probabilities));
    const diagnosis = diseaseClasses[highestIndex];
 });
  } catch (error) {
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

