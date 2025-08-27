const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db');
const Status = require('./status');
const User = require('./users');
const Dentist = require('./dentists');

class Appointment extends Model {}

Appointment.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    timeFrom: { type: DataTypes.TIME, allowNull: false },
    timeTo: { type: DataTypes.TIME, allowNull: false },
    dateCreated: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    dateUpdated: { type: DataTypes.DATE },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    dentist_id: { type: DataTypes.INTEGER, allowNull: false },
    status_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    modelName: 'appointment',
    tableName: 'appointments',
    timestamps: true,
    createdAt: 'dateCreated',
    updatedAt: 'dateUpdated',
  }
);

// Associations
User.hasMany(Appointment, { foreignKey: 'user_id' });
Appointment.belongsTo(User, { foreignKey: 'user_id' });

Dentist.hasMany(Appointment, { foreignKey: 'dentist_id' });
Appointment.belongsTo(Dentist, { foreignKey: 'dentist_id' });

Status.hasMany(Appointment, { foreignKey: 'status_id' });
Appointment.belongsTo(Status, { foreignKey: 'status_id' });

module.exports = Appointment;
