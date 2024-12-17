const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Vendor = sequelize.define('Vendor', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    subscription_tier: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    branch_count: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
}, {
    timestamps: false,
});

module.exports = Vendor;
