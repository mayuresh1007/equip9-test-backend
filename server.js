var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var app = express()
require('dotenv').config()
var port = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(cors())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

const Users = require('./routes/Users') // register the routers
// console.log("Users--->",Users)
app.use('/users', Users)

app.listen(port, function() {
  console.log(`backend app listening at http://localhost:${port}`);
})
