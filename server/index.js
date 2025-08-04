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
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE
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

// Slugify utility
function toSlug(str) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

app.post('/api/castles', (req, res) => {
    const { name } = req.body;
    if(!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    // Generate unique slug
    const baseSlug = toSlug(name);
    let slug = baseSlug;
    let i = 1;
    function insertWithUniqueSlug() {
        db.get('SELECT 1 FROM castles WHERE slug = ?', [slug], (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (row) {
                slug = `${baseSlug}-${i++}`;
                insertWithUniqueSlug();
            } else {
                db.run('INSERT INTO castles (name, slug) VALUES (?, ?)', [name, slug], function(err) {
                    if(err) {
                        return res.status(500).json({ error: err.message });
                    }
                    res.status(201).json({ id: this.lastID, name, slug });
                });
            }
        });
    }
    insertWithUniqueSlug();
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})