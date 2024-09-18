const sequelize = require('@/app/config/db');
const User = require('@/app/models/User');
const Event = require('@/app/models/Event');

User.hasMany(Event, { foreignKey: 'userId', as: 'events' });
Event.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = { User, Event, sequelize };
