const Users = require('../models/user')

module.exports.getAllUsers = (req, res) => {
  Users.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: 'На сервере произошла ошибка' }))
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
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Пользователь по указанному _id не найден.' })
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' })
    })
}

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body

  Users.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' })
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' })
    })
}

module.exports.updateProfile = (req, res) => {
  const { name, about, avatar } = req.body

  Users.findByIdAndUpdate(
    req.user._id,
    { name, about, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' })
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Пользователь с указанным _id не найден.' })
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' })
    })
}

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body

  Users.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(404).send({ message: 'Переданы некорректные данные при обновлении профиля.' })
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Пользователь с указанным _id не найден.' })
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' })
    })
}
