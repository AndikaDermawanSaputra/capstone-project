const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const healthRoutes = require('./routes/health');

const app = express();
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/health', healthRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Server
const PORT = 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

