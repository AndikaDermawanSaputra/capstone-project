const mysql = require('mysql2');
require('dotenv').config();  // Memuat variabel lingkungan dari file .env

// Membuat koneksi ke MySQL menggunakan data dari .env
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',  // Host database
  user: process.env.DB_USER || 'health-innovation',      // User database
  password: process.env.DB_PASSWORD || '112233',  // Password database
  database: process.env.DB_NAME || 'sehati',  // Nama database
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

