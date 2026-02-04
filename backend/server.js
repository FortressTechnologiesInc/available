// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');

const Application = require('./models/Application');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection (use your MongoDB Atlas URI)
mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: 'available_nurse_staffing'
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Nodemailer transporter (configure with real SMTP)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Helper to send email to availablenursestaffing@outlook.com
async function sendToInfoEmail(subject, text) {
  if (!process.env.SMTP_USER) {
    console.log('SMTP not configured, skipping email send.');
    return;
  }

  await transporter.sendMail({
    from: `"Available Nurse Staffing" <${process.env.SMTP_USER}>`,
    to: 'availablenursestaffing@outlook.com',
    subject,
    text
  });
}

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { fullName, email, phone, message } = req.body;

    const entry = await Application.create({
      fullName,
      email,
      phone,
      position: 'N/A',
      message,
      type: 'contact'
    });

    await sendToInfoEmail(
      'New Contact Request - Available Nurse Staffing',
      `Name: ${fullName}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`
    );

    res.status(201).json({ success: true, data: entry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Apply form endpoint
app.post('/api/apply', upload.single('resume'), async (req, res) => {
  try {
    const { fullName, email, phone, position, message } = req.body;
    const resumeFile = req.file; // uploaded file metadata

    const entry = await Application.create({
      fullName,
      email,
      phone,
      position,
      message,
      type: 'application'
    });

    await sendToInfoEmail(
      'New Application - Available Nurse Staffing',
      `Name: ${fullName}
Email: ${email}
Phone: ${phone}
Position: ${position}

Message:
${message}

Resume file stored at: ${resumeFile?.path}`
    );

    res.status(201).json({ success: true, data: entry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Fallback to SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
