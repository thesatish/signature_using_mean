// backend/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const verifySignature = require('./verifySignature');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/secure', verifySignature, (req, res) => {
  res.json({ message: 'Signature verified successfully!', data: req.body });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
