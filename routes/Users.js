const express = require('express')
const users = express.Router()
const cors = require('cors')// making connection for frontend
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Joi = require('joi')
const User = require('../models/User.js')
require('dotenv').config(); // for using .env file 
users.use(cors())


// const securePassword = async (password) => {
//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash(password, salt);
//   return hashedPassword;
// };


users.get('/list', async (req, res) => {
  result = {};
  const listData =await User.findAll()
    .then((result) => res.send(result))
    .catch((err) => console.log(err));
});


// console.log(process.env.JWT_SECRET_KEY)
users.post('/register', async (req, res) => {
  const today = new Date()
   // const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
  const data = req.body;
  const schema = Joi.object().keys(
    {
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      mobile_number: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
      profilephoto: Joi.string().allow(''),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      created: today
    })

  const validate = schema.validate(data)
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
    const newUser =await User.findOne({
      where: {
        email: data.email
      }
    })
      .then(async (result) => {
        if (result == null) {
          try {      
            const hashedPassword = await bcrypt.hash(data.password, 10)
              console.log("hashedPassword",hashedPassword)
            const NewUser = await User.create({
              first_name: data.first_name,
              last_name: data.last_name,
              mobile_number: data.mobile_number,
              email: data.email,
              password: hashedPassword
            })
            const token = jwt.sign({ id: NewUser.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })
            res.status(201).send({ "status": "success", "message": "Registration Success", "token": token, user: NewUser })
            console.log(NewUser)
          } catch (error) {
            console.log(error)
            res.send({ "status": "failed", "message": "Unable to Register" })
          }
        } else {
          res.status(200).send({ "status": "failed", "message": "Email already exists" })
        }
      }).catch((error) => {
        console.log(["error"], error);
        res.send({
          errorCode: 103,
          status: false,
          returnMessage: "Error",
          data: error,
        });
      });
    
  }
})
users.post('/login', (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then( user => {
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          let token = jwt.sign(user.dataValues, process.env.JWT_SECRET_KEY, {
            expiresIn: '1d'
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
  var decoded = jwt.verify(req.headers['authorization'], process.env.JWT_SECRET_KEY)
  console.log(decoded)
  User.findOne({
    where: {
      id: decoded.id
    }
  })
    .then(user => {
      if (user) {
        res.send(user)
      } else {
        res.send('User does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})
users.get('/update', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.JWT_SECRET_KEY)
  console.log(decoded)
  User.findOne({
    where: {
      id: decoded.id
    }
  })
    .then(user => {
      if (user) {
        console.log("mayuresh")
        res.send(user)
      } else {
        res.send('User does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

// users.put('/update',async (req, res) => {
//   try {
//     console.log("called udpate by backend")
//     var decoded = jwt.verify(req.headers['authorization'], process.env.JWT_SECRET_KEY)
//     console.log(decoded)
//     // Find the user with the specified ID
//     const user = await User.findOne({
//       where: {
//         id: decoded.id
//       }
//     })
//     console.log("backend user update method",user)
//     return 
//     if (!user) {
//       // If no user is found with the specified ID, send a 404 error response
//       return res.status(404).json({ message: 'User not found' });
//     }
//     // Update the user's data
//     // let update_user = await user.update(req.body);
//     let data = req.body;
//     let update_user = await user.update({
//       first_name: data.first_name,
//       last_name: data.last_name,
//       mobile_number: data.mobile_number,
//       email: data.email,
//     })
//     .then((result)=>{
//       if(result){
//         req.send({
//           statusCode:200,
//           message:"User updated successfully"
//         });
//       }
//         else{
//       res.send({statusCode:404,
//       message:"User Not found"})
//         }
//       })
//     console.log(test)
//   } catch (error) {
//     // If an error occurs, send a 500 error response with the error message
//     res.status(500).json({ message: error.message });
//   }
// });

module.exports = users
