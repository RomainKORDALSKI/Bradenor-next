const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = require("./User");
const Event = require("./Event");

User.associate({ Event });
Event.associate({ User });

module.exports = { sequelize, User, Event };
