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


const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const messagesFile = path.join(__dirname, 'messages.json');

app.get('/messages.json', (req, res) => {
  fs.readFile(messagesFile, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.json([]); // If file doesn't exist, return empty array
      }
      return res.status(500).json({ error: 'Failed to read messages' });
    }
    try {
      const messages = JSON.parse(data);
      res.json(messages);
    } catch {
      res.status(500).json({ error: 'Failed to parse messages file' });
    }
  });
});

// Your other routes (e.g., POST /contact) here

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
