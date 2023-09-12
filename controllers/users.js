const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Users = require('../models/user')

module.exports.getAllUsers = (req, res, next) => {
  Users.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => next(err))
}

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params

  Users.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' })
      }
      return res.send({ data: user })
    })
    .catch((err) => next(err))
}

module.exports.createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
    about,
    avatar
  } = req.body

  if (!email && !password) {
    return res.status(400).send({ message: 'Переданы неправильные почта или пароль.' })
  }

  return bcrypt.hash(password, 10)
    .then((hash) => Users.create({
      email,
      password: hash,
      name,
      about,
      avatar
    }))
    .then((user) => res.status(201).send({ _id: user._id, email: user.email }))
    .catch((err) => next(err))
}

module.exports.updateProfile = (req, res, next) => {
  const { name, about, avatar } = req.body

  Users.findByIdAndUpdate(
    req.user._id,
    { name, about, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => next(err))
}

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body

  Users.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => next(err))
}

module.exports.login = (req, res, next) => {
  const { email, password } = req.body

  if (!email && !password) {
    return res.status(400).send({ message: 'Переданы неправильные почта или пароль.' })
  }

  return Users.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return res.status(400).send({ message: 'Пользователь с указанным логином и паролем не найден.' })
      }
      console.log(user)
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
    .catch((err) => next(err))
}

module.exports.getUserInfo = (req, res, next) => {
  const { userId } = req.body

  Users.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' })
      }
      return res.status(200).send({ data: user })
    })
    .catch((err) => next(err))
}
