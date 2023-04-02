const Sequelize = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'user',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    first_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    mobile_number: {
      type: Sequelize.CHAR(10),
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    // profilephoto: {
    //   type: Sequelize.STRING,
    //   allowNull: true
    // },
    createdby: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "user"
    },
    
    updatedby: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "user"
    },
  },
  {
    timestamps: true,// false will not do defalut createion
    createdAt: true,
    createdAt: "createddate",
    updatedAt: true,
    updatedAt: "updateddate",
    timezone: '+00:00', // explicitly set the timezone to UTC
    tableName: "user",
    freezeTableName: true,//If freezeTableName is true, sequelize will not try to alter the model name to get the table name. Otherwise, the model name will be pluralized
  }
)
