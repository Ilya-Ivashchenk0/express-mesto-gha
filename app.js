const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const loger = require('./utils/loger')

const { PORT = 3000 } = process.env

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
})

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB')
})

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err)
})

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors())
app.use(loger)

app.use((req, res, next) => {
  req.user = {
    _id: '64f696a14f8c7af881a3246c'
  }

  next()
})

app.use('/users', require('./routes/users'))
app.use('/cards', require('./routes/cards'))

app.use((req, res, next) => {
  res.status(404).json({ message: 'Карточка или пользователь не найдены, или был запрошен несуществующий роут.' })
})

app.listen(PORT, () => {
  console.log('Server listening on port:', PORT)
})
