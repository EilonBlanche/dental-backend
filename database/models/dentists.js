const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db');

class Dentist extends Model {}

Dentist.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(50), allowNull: false },
    specialization: { type: DataTypes.STRING(50), allowNull: true },
    email: { type: DataTypes.STRING(50), allowNull: true },
    availableStart: { type: DataTypes.TIME, allowNull: true },
    availableEnd: { type: DataTypes.TIME, allowNull: true },  
    dateCreated: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    dateUpdated: { type: DataTypes.DATE },
  },
  {
    sequelize,
    modelName: 'dentist',
    tableName: 'dentists',
    timestamps: true,
    createdAt: 'dateCreated',
    updatedAt: 'dateUpdated',
  }
);

module.exports = Dentist;
