const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 80;
const ADMIN_USER = process.env.ADMIN_USER || 'Federacion';
const ADMIN_PASS = process.env.ADMIN_PASS || 'Faf12345*';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/credentials', (req, res) => {
    res.json({ user: ADMIN_USER });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USER && password === ADMIN_PASS) {
        res.json({ success: true, token: Buffer.from(`${username}:${password}`).toString('base64') });
    } else {
        res.status(401).json({ success: false });
    }
});

app.get('/api/inscripciones', (req, res) => {
    const data = fs.readFileSync(path.join(__dirname, 'data', 'inscripciones.json'), 'utf8') || '[]';
    res.json(JSON.parse(data));
});

app.post('/api/inscripciones', (req, res) => {
    const dataPath = path.join(__dirname, 'data', 'inscripciones.json');
    let data = [];
    if (fs.existsSync(dataPath)) {
        data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    }
    data.push({ ...req.body, fechaRegistro: new Date().toISOString() });
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
