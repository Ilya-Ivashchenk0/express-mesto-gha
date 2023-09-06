const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('./db')
const loger = require('./utils/loger')

const { PORT = 3000 } = process.env

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors())
app.use(loger)

app.use((req, res, next) => {
  req.user = {
    id: '64f696a14f8c7af881a3246c'
  }

  next()
})

app.use('/users', require('./routes/users'))
app.use('/cards', require('./routes/cards'))

app.listen(PORT, () => {
  console.log('Server listening on port:', PORT)
})
