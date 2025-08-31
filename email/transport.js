const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'eilonblanche23@gmail.com',
        pass: 'unyo sgad unao eawx' // Use an app password if 2FA is enabled
    }
});

module.exports = transporter;
