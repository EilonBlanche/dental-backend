const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db');
const bcrypt = require('bcryptjs');

class User extends Model {
  async checkPassword(password) {
    return await bcrypt.compare(password, this.password);
  }
}

User.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(50), allowNull: false },
    email: { type: DataTypes.STRING(50), unique: true, allowNull: false },
    password: { type: DataTypes.STRING(128), allowNull: false },
    isAdmin: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }, // new field
    dateCreated: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    dateUpdated: { type: DataTypes.DATE },
  },
  {
    sequelize,
    modelName: 'user',
    tableName: 'users',
    timestamps: true,
    createdAt: 'dateCreated',
    updatedAt: 'dateUpdated',
  }
);

User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
});

User.beforeUpdate(async (user) => {
  if (user.changed('password')) user.password = await bcrypt.hash(user.password, 10);
});

module.exports = User;