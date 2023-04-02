const express = require('express')
const users = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Joi = require('joi')
const User = require('../models/User')
users.use(cors())

process.env.SECRET_KEY = 'strongsecret'

// app.get('/',(req, res) => {
//   res.send("mayuresh");
// })
// console.log("mayuresh--------",users)
users.post('/register', (req, res) => {
  // const today = new Date()
  const data = req.body;
  const userData = Joi.object().keys(
    {
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      mobile_number: Joi.number().required(),
      profilephoto: Joi.string().allow(''),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      // created: today
    })

  const validate = userData.validate(data)
  console.log(validate)
  const error = validate.error;
  if (error) {
    console.log(error.ValidationError)
    res.status(201).send({
      status: "failed",
      message: `failed ${error.details[0].message}`,
      error: error.details[0].message
    })
  } else {
    const newUser = User.findOne({
      where: {
        email: data.email
      }
    })
    console.log("debug",newUser)
    if (newUser !== null) {
      res.status(200).send({ "status": "failed", "message": "Email already exists" })
    } else {
      console.log("data----->", data.first_name)
      try {
        const salt = bcrypt.genSalt(10)
        const hashPassword = bcrypt.hash(data.password, salt)
        const NewUser = User.create({
          first_name: data.first_name,
          last_name: data.last_name,
          mobile_number: data.mobile_number,
          email: data.email,
          password: hashPassword
        })
        // const token = jwt.sign( process.env.JWT_SECRET_KEY, { expiresIn: '5d' })
        const token = jwt.sign({ id: NewUser.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })
        res.status(201).send({ "status": "success", "message": "Registration Success", "token": token, user: NewUser })
        console.log(NewUser)
      } catch (error) {
        console.log(error)
        res.send({ "status": "failed", "message": "Unable to Register" })
      }

    }
    //TODO bcrypt
    // .then(user => {
    //   if (!user) {
    //     bcrypt.hash(data.password, 10, (err, hash) => {
    //       userData.password = hash
    //       User.create(userData)
    //         .then(user => {
    //           res.json({ status: user.email + 'Registered!' })
    //         })
    //         .catch(err => {
    //           res.send('error: ' + err)
    //         })
    //     })
    //   } else {
    //     res.json({ error: 'User already exists' })
    //   }
    // })
    // .catch(err => {
    //   res.send('error: ' + err)
    // })
  }
})
users.post('/login', (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
            expiresIn: 1440
          })
          res.send(token)
        }
      } else {
        res.status(400).json({ error: 'User does not exist' })
      }
    })
    .catch(err => {
      res.status(400).json({ error: err })
    })
})

users.get('/profile', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

  User.findOne({
    where: {
      id: decoded.id
    }
  })
    .then(user => {
      if (user) {
        res.json(user)
      } else {
        res.send('User does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

module.exports = users


// module.exports = function (app) { 
//   const userController = require('../controllers/usersController')
//   app.get("/", (req, res) => {
//   res.status(200).send({
//     message: "welcome to fresh Ecommerce api !!!"
//   });
//   })
  
//   app.get("/register", userController.Register);
//   app.get("/ListCostumer", userController.ListCostumer);
// }