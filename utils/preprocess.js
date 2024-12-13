function processInput(inputFeatures, allFeatures) {
    const processedInput = allFeatures.map(feature =>
        inputFeatures.includes(feature) ? 1 : 0
    );
    return tf.tensor2d([processedInput], [1, allFeatures.length]); // Tambahkan dimensi batch
}

