const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const metrics = require('./utils/metrics');

const app = express();

app.get("/", (req, res) => {
  res.send("Student Management Backend is running 🚀");
});

app.use(cors());
app.use(bodyParser.json());
app.use(metrics.requestCounter);
app.use('/metrics', metrics.metricsEndpoint);

app.use('/auth', authRoutes);
app.use('/students', studentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Student mgmt backend running on port ${PORT}`);
});
