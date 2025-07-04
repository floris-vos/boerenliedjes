const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

app.post('/contact', (req, res) => {
  const message = req.body;
  const filePath = path.join(__dirname, 'messages.json');

  fs.readFile(filePath, (err, data) => {
    let messages = [];
    if (!err && data.length > 0) {
      messages = JSON.parse(data);
    }
    messages.push(message);

    fs.writeFile(filePath, JSON.stringify(messages, null, 2), err => {
      if (err) return res.status(500).json({ success: false });
      res.json({ success: true });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
