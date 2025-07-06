const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./castle.db', (err) => {
    if (err) {
        console.error('Error opening database ' + err.message);
    } else {
        console.log('Connected to the castle database.');
    }
});

db.run(`CREATE TABLE IF NOT EXISTS castles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL    
)`);

// GET ALL CASTLES
app.get('/api/castles', (req, res) => {
    db.all('SELECT * FROM castles', [], (err, rows) => {
        if(err) {
            res.status(500).json({ error: err.message })
            return;
        }
        res.json({ castles: rows });
    });
});

app.post('/api/castles', (req, res) => {
    const { name } = req.body;
    if(!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    db.run('INSERT INTO castles (name) VALUES (?)', [name], function(err) {
        if(err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, name });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})