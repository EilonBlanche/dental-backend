const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_SERVICE_EMAIL,
        pass: process.env.EMAIL_SERVICE_PASSWORD
    }
});

module.exports = transporter;
