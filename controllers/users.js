const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Users = require('../models/user')
const errorsHandling = require('../middlewares/errorsHandling')

module.exports.getAllUsers = (req, res) => {
  Users.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => errorsHandling(err))
}

module.exports.getUserById = (req, res) => {
  const { userId } = req.params

  Users.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' })
      }
      return res.send({ data: user })
    })
    .catch((err) => errorsHandling(err))
}

module.exports.createUser = (req, res) => {
  const {
    email,
    password,
    name,
    about,
    avatar
  } = req.body

  bcrypt.hash(password, 10)
    .then((hash) => Users.create({
      email,
      password: hash,
      name,
      about,
      avatar
    }))
    .then((user) => res.status(201).send({ _id: user._id, email: user.email }))
    .catch((err) => errorsHandling(err))
}

module.exports.updateProfile = (req, res) => {
  const { name, about, avatar } = req.body

  Users.findByIdAndUpdate(
    req.user._id,
    { name, about, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => errorsHandling(err))
}

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body

  Users.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => errorsHandling(err))
}

module.exports.login = (req, res) => {
  const { email, password } = req.body

  Users.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return res.status(401).send({ message: 'Пользователь с указанным логином и паролем не найден.' })
      }

      return bcrypt.compare(password, user.password)
        .then((check) => {
          if (!check) {
            return res.status(401).send({ message: 'Переданы неправильные почта или пароль.' })
          }
          const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
          )

          return res.cookie('token', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true
          })
            .status(200)
            .send({ message: 'Вход выполнен успешно!' })
        })
    })
    .catch((err) => errorsHandling(err))
}

module.exports.getUserInfo = (req, res) => {
  const { userId } = req.body

  Users.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' })
      }
      return res.send({ data: user })
    })
    .catch((err) => errorsHandling(err))
}
