const Cards = require('../models/card')

module.exports.getAllCards = (req, res, next) => {
  Cards.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => next(err))
}

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body
  const owner = req.user._id

  Cards.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => next(err))
}

module.exports.deleteCardById = (req, res, next) => Cards.findByIdAndRemove(req.params.cardId)
  .then((card) => {
    if (!card) {
      return res.status(404).send({ message: 'Карточка с указанным _id не найдена.' })
    }
    if (req.user._id !== card.owner) {
      return res.status(200).send({ message: 'У вас нет прав для удаления этой карточки.' })
    }
    return res.status(200).send({ data: card })
  })
  .catch((err) => next(err))

module.exports.addLikeCard = (req, res, next) => Cards.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true }
)
  .then((card) => {
    if (!card) {
      return res.status(404).send({ message: 'Передан несуществующий _id карточки.' })
    }
    return res.send({ data: card })
  })
  .catch((err) => next(err))

module.exports.deleteLikeCard = (req, res, next) => Cards.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true }
)
  .then((card) => {
    if (!card) {
      return res.status(404).send({ message: 'Передан несуществующий _id карточки.' })
    }
    return res.send({ data: card })
  })
  .catch((err) => next(err))
