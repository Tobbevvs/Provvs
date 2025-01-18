const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();

const PORT = 3000;

// Skapa och anslut till databasen
const db = new sqlite3.Database('./database.db');

// Skapa en tabell för att lagra kontaktmeddelanden
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS meddelanden (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    namn TEXT NOT NULL,
    meddelande TEXT NOT NULL
  )`);
  console.log('Tabellen "meddelanden" är klar!');
});

// Middleware för att logga rutter
app.use((req, res, next) => {
  console.log(`Rutt begärd: ${req.method} ${req.url}`);
  next();
});

// Middleware för att hantera formulärdata
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware för att servera statiska filer (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Rutt för startsidan
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rutt för kontaktsidan
app.get('/kontakt', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'kontakt.html'));
});

// Rutt för FAQ
app.get('/faq', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'faq.html'));
});

// API: Lista över tjänster
app.get('/api/tjanster', (req, res) => {
  res.json([
    { id: 1, namn: 'Installation av VVS', pris: 5000 },
    { id: 2, namn: 'Reparation av läckor', pris: 2000 },
    { id: 3, namn: 'Underhåll av värmesystem', pris: 3000 }
  ]);
});

// API: Lista över kunder
app.get('/api/kunder', (req, res) => {
  res.json([
    { id: 1, namn: 'Kund 1', email: 'kund1@example.com' },
    { id: 2, namn: 'Kund 2', email: 'kund2@example.com' }
  ]);
});

// POST-rutt för att hantera formulärdata och spara i databasen
app.post('/kontakt', (req, res) => {
  const { namn, meddelande } = req.body;

  db.run(`INSERT INTO meddelanden (namn, meddelande) VALUES (?, ?)`, [namn, meddelande], function (err) {
    if (err) {
      return res.status(500).send('Något gick fel med att spara ditt meddelande.');
    }
    res.send(`Tack, ${namn}, för ditt meddelande: "${meddelande}"`);
  });
});

// Rutt för att visa alla meddelanden (admin)
app.get('/admin/meddelanden', (req, res) => {
  db.all(`SELECT * FROM meddelanden`, [], (err, rows) => {
    if (err) {
      return res.status(500).send('Kunde inte hämta meddelanden.');
    }
    res.json(rows);
  });
});

// Starta servern
app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
});
