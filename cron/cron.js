const cron = require('node-cron');
const { Op } = require('sequelize');
const emailSender = require('../email/sender')
const Appointment = require('../database/models/appointments');
const User = require('../database/models/users');
const Dentist = require('../database/models/dentists');
const Status = require('../database/models/status');

async function getAppointmentsFrom9AMTodayTo9AMTomorrow() {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const appointments = await Appointment.findAll({
        where: {
            [Op.or]: [
                { date: todayStr, timeFrom: { [Op.gte]: '09:00:00' } },
                { date: tomorrowStr, timeFrom: { [Op.lte]: '09:00:00' } }
            ],
            status_id: [1,3]
        },
        include: [
            { model: User },
            { model: Dentist }
        ],
        order: [['date', 'ASC'], ['timeFrom', 'ASC']],
    });
    return appointments;
}

cron.schedule(process.env.CRON_SCHEDULE, async () => {
    try {
        const appointments = await getAppointmentsFrom9AMTodayTo9AMTomorrow();
        console.log("APPOINTMENTS", appointments.length);
        for (const appointment of appointments) {
            let emailUserParams = { email: appointment.user.email, user : appointment.user.name, dentist : appointment.dentist.name, date : appointment.date, timeFrom : appointment.timeFrom, timeTo : appointment.timeTo };
            await emailSender(emailUserParams, "user");
            let emailDentistParams = { email: appointment.dentist.email, dentist : appointment.dentist.name, user : appointment.user.name, date : appointment.date, timeFrom : appointment.timeFrom, timeTo : appointment.timeTo }
            await emailSender(emailDentistParams, "dentist");
        }
    } catch (err) {
        console.error('Error fetching appointments:', err);
    }
});

