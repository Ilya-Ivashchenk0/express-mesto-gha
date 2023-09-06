const Cards = require('../models/card')

module.exports.getAllCards = (req, res) => {
  Cards.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка: ${err}` }))
}

module.exports.createCard = (req, res) => {
  const { name, link } = req.body
  const owner = req.user.id

  Cards.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' })
      }
      res.status(500).send({ message: `Произошла ошибка: ${err}` })
    })
}

module.exports.deleteCardById = (req, res) => Cards.findByIdAndRemove(req.params.cardId)
  .then((card) => {
    if (!card) {
      return res.status(404).send({ message: 'Карточка с указанным _id не найдена.' })
    }
    return res.send({ data: card })
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(404).send({ message: 'Карточка с указанным _id не найдена.' })
    }
  })

module.exports.addLikeCard = (req, res) => Cards.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user.id } },
  { new: true }
)
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятия лайка.' })
    }
    if (err.name === 'CastError') {
      res.status(404).send({ message: 'Передан несуществующий _id карточки.' })
    }
    res.status(500).send({ message: `Произошла ошибка: ${err}` })
  })

module.exports.deleteLikeCard = (req, res) => Cards.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user.id } },
  { new: true }
)
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятия лайка.' })
    }
    if (err.name === 'CastError') {
      res.status(404).send({ message: 'Передан несуществующий _id карточки.' })
    }
    res.status(500).send({ message: `Произошла ошибка: ${err}` })
  })
