const mongoose = require('mongoose')
const isEmail = require('validator/lib/isEmail')
const isURL = require('validator/lib/isURL')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false
  },
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30
  },
  avatar: {
    type: String,
    validate: {
      validator: (v) => isURL(v),
      message: 'Неправильный формат ссылки',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'
  }
})

module.exports = mongoose.model('user', userSchema)
