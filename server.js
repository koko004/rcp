const express = require('express');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 80;
const ADMIN_USER = process.env.ADMIN_USER || 'Federacion';
const ADMIN_PASS = process.env.ADMIN_PASS || 'Faf12345*';

const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = process.env.EMAIL_PORT || 587;
const EMAIL_USER = process.env.EMAIL_USER || '';
const EMAIL_PASS = process.env.EMAIL_PASS || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@rcp-cursos.com';

let transporter = null;
if (EMAIL_USER && EMAIL_PASS) {
    transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: EMAIL_PORT,
        secure: false,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS
        }
    });
}

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
    try {
        const data = fs.readFileSync(path.join(__dirname, 'data', 'inscripciones.json'), 'utf8') || '[]';
        res.json(JSON.parse(data));
    } catch (err) {
        res.json([]);
    }
});

async function sendConfirmationEmail(inscripcion) {
    if (!transporter) {
        console.log('Email no configurado, saltando envío');
        return;
    }

    const nombreCurso = inscripcion.courseType === 'completo' ? 'Salvacorazones: RCP y DEA' : 'Reciclaje Salvacorazones';

    const mailOptions = {
        from: EMAIL_FROM,
        to: inscripcion.email,
        subject: 'Confirmación de inscripción - Cursos RCP',
        html: `
            <h2>Confirmación de Inscripción</h2>
            <p>Hola ${inscripcion.nombre},</p>
            <p>Tu inscripción ha sido registrada correctamente.</p>
            
            <h3>Detalles de la inscripción:</h3>
            <ul>
                <li><strong>Nombre:</strong> ${inscripcion.nombre} ${inscripcion.apellidos}</li>
                <li><strong>DNI:</strong> ${inscripcion.dni}</li>
                <li><strong>Teléfono:</strong> ${inscripcion.telefono}</li>
                <li><strong>Email:</strong> ${inscripcion.email}</li>
                <li><strong>Club:</strong> ${inscripcion.club}</li>
                <li><strong>Responsable del Club:</strong> ${inscripcion.responsable}</li>
                <li><strong>Curso:</strong> ${nombreCurso}</li>
                <li><strong>Lugar:</strong> ${inscripcion.lugar}</li>
                <li><strong>Fecha:</strong> ${inscripcion.fecha}</li>
            </ul>
            
            <p>Próximamente recibirás más información sobre el curso.</p>
            
            <p>Un saludo,<br>
            Federación de Fútbol del Principado de Asturias</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email de confirmación enviado a:', inscripcion.email);
    } catch (err) {
        console.error('Error enviando email:', err);
    }
}

app.post('/api/inscripciones', async (req, res) => {
    const dataPath = path.join(__dirname, 'data', 'inscripciones.json');
    let data = [];
    try {
        if (fs.existsSync(dataPath)) {
            data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        }
    } catch (err) {
        data = [];
    }

    const inscripcion = { ...req.body, fechaRegistro: new Date().toISOString() };
    data.push(inscripcion);
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

    await sendConfirmationEmail(inscripcion);

    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});