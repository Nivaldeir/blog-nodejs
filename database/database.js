const Sequelize = require('sequelize')

const connection = new Sequelize('guiapress', 'root', '0068620748', {
    host: "localhost",
    dialect: 'mysql',
    timezone: "-03:00"
});

module.exports = connection;