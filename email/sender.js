const transporter = require('./transport');

async function sendEmail({ to, subject, text, html }) {
    try {
        const mailOptions = {
            from: "Dental Office",
            to,
            subject,
            text,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = sendEmail;
