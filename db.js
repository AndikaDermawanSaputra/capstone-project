const mysql = require('mysql2');
require('dotenv').config();  // Memuat variabel lingkungan dari file .env

// Membuat koneksi ke MySQL menggunakan data dari .env
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',  // Host database
  user: process.env.DB_USER || 'root',      // User database
  password: process.env.DB_PASSWORD || '',  // Password database
  database: process.env.DB_NAME || 'healthcare_app',  // Nama database
});

// Menghubungkan ke database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ', err.stack);
    return;
  }
  console.log('Connected to the database as id ' + connection.threadId);
});

// Menyediakan koneksi database ke file lain
module.exports = connection;
