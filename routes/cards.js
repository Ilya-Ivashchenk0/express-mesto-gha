const router = require('express').Router()
const {
  getAllCards,
  createCard,
  deleteCardById,
  addLikeCard,
  deleteLikeCard
} = require('../controllers/cards')

router.get('/', getAllCards)
router.post('/', createCard)
router.delete('/:cardId', deleteCardById)
router.put('/:cardId/likes', addLikeCard)
router.delete('/:cardId/likes', deleteLikeCard)

module.exports = router
