const fs = require('fs');
const path = require('path');

// Convert timeFrom and timeTo to AM/PM format
function formatTimeRange(timeFrom, timeTo) {
    const toAMPM = time => {
        const [hour, minute] = time.split(':');
        let h = parseInt(hour);
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return `${h}:${minute} ${ampm}`;
    };
    return `${toAMPM(timeFrom)} - ${toAMPM(timeTo)}`;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function parseUserTemplate(appointment) {
    const templatePath = path.join(__dirname, 'templates', 'user-template.html');
    const template = fs.readFileSync(templatePath, 'utf-8');
    return template
        .replace('{{userName}}',appointment.user)
        .replace('{{dentistName}}', appointment.dentist)
        .replace('{{appointmentDate}}', formatDate(appointment.date))
        .replace('{{appointmentTime}}', formatTimeRange(appointment.timeFrom, appointment.timeTo));
}

function parseDentistTemplate(appointment) {
    const templatePath = path.join(__dirname, 'templates', 'dentist-template.html');
    const template = fs.readFileSync(templatePath, 'utf-8');
    return template
        .replace('{{dentistName}}', appointment.dentist)
        .replace('{{userName}}', appointment.user)
        .replace('{{appointmentDate}}', formatDate(appointment.date))
        .replace('{{appointmentTime}}', formatTimeRange(appointment.timeFrom, appointment.timeTo));
}

module.exports = { parseUserTemplate, parseDentistTemplate };
