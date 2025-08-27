const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db');

class Status extends Model {}

Status.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'status',
    tableName: 'status',
    timestamps: false,
  }
);

module.exports = Status;
