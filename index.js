const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const bans = [];
const validPins = ["0725", "1926"];

// Serve PIN entry page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/pin.html');
});

// Validate PIN
app.post('/validate-pin', (req, res) => {
  const { pin } = req.body;
  if (validPins.includes(pin)) {
    res.sendFile(__dirname + '/public/index.html');
  } else {
    res.send('Invalid PIN. Please go back and try again.');
  }
});

// Handle ban request
app.post('/ban', (req, res) => {
  const { username, banType, reason, customReason } = req.body;
  const finalReason = reason === 'Custom' ? customReason : reason;
  if (username && banType && finalReason) {
    bans.push({ username, banType, reason: finalReason, date: new Date() });
    res.send(`
      <html>
        <body>
          <h1>User ${username} has been ${banType === 'temporary' ? 'temporarily' : 'permanently'} banned for: ${finalReason}.</h1>
          <h2>✅ Ban Successful</h2>
          <a href="/">Go back</a>
        </body>
      </html>
    `);
  } else {
    res.send('All fields are required.');
  }
});

// Handle unban request
app.post('/unban', (req, res) => {
  const { username } = req.body;
  if (username) {
    const index = bans.findIndex(ban => ban.username === username);
    if (index !== -1) {
      bans.splice(index, 1);
      res.send(`
        <html>
          <body>
            <h1>User ${username} has been unbanned.</h1>
            <h2>✅ Unban Successful</h2>
            <a href="/unban.html">Go back</a>
          </body>
        </html>
      `);
    } else {
      res.send('User not found in ban list.');
    }
  } else {
    res.send('Username is required.');
  }
});

// Endpoint to retrieve list of bans (optional)
app.get('/bans', (req, res) => {
  res.json(bans);
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
