// Fungsi untuk memproses gejala menjadi array 1 dan 0
module.exports = (symptoms, allFeatures) => {
  return allFeatures.map(feature => (symptoms.includes(feature) ? 1 : 0));
};
