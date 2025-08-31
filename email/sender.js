const transporter = require('./transport');
const parser = require('./parser');
async function sendEmail(emailParams, type) {
    try {
        const mailOptions = {
            from: "Dental Office",
            to : emailParams.email,
            subject : "Upcoming Appointment Reminder",
            html : (type === 'user') ? parser.parseUserTemplate(emailParams) : parser.parseDentistTemplate(emailParams)
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = sendEmail;
