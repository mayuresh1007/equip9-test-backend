const Sequelize = require('sequelize')
const db = {}
  // (database name, username, password, and host)
const sequelize = new Sequelize('equip9', 'root', 'mayuresh', {
  host: 'localhost',
  dialect: 'mysql',
  operatorsAliases: 0,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

db.sequelize.sync() // only sync the data with db
// db.sequelize.sync({ force: true, alter: true }) // only sync the data with db
  .then(() => {
    console.log('synced database')
  })
async function auth() {
  try {
    await sequelize.authenticate();
    console.log('Data Base Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

auth()
module.exports = db
