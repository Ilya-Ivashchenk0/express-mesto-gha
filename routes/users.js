const router = require('express').Router()
const {
  getAllUsers,
  getUserById,
  createUser,
  getUserInfo,
  updateProfile,
  updateAvatar
} = require('../controllers/users')

router.get('/', getAllUsers)
router.get('/:userId', getUserById)
router.post('/', createUser)
router.patch('/me', getUserInfo)
router.patch('/me', updateProfile)
router.patch('/me/avatar', updateAvatar)

module.exports = router
