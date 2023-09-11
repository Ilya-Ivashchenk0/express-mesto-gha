const env = require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const loger = require('./utils/loger')
const { login, createUser } = require('./controllers/users')
const auth = require('./middlewares/auth')
const errorsHandling = require('./middlewares/errorsHandling')

const port = process.env.PORT || 3000

mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true })
mongoose.connection.on('connected', () => console.log('MongoDB is connected to the server.'))
mongoose.connection.on('error', (err) => console.error('MongoDB connection error:', err))

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors())
app.use(loger)

app.post('/signin', login)
app.post('/signup', createUser)

app.use(auth)

app.use('/users', require('./routes/users'))
app.use('/cards', require('./routes/cards'))

app.use(errorsHandling)

app.use((req, res, next) => {
  res.status(404).json({ message: 'Карточка или пользователь не найдены, или был запрошен несуществующий роут.' })
})

app.listen(port, () => console.log('Server listening on port:', port))
