module.exports = (err, req, res, next) => {
  let statusCode = 500
  let message = 'На сервере произошла ошибка.'

  if (err.code === 11000) {
    statusCode = 409
    message = 'Пользователь с таким email уже существует.'
  }

  if (err.code === 'ValidationError') {
    statusCode = 400
    message = 'Переданы некорректные данные при обновлении профиля.'
  }

  if (err.code === 'CastError') {
    statusCode = 400
    message = 'Пользователь с указанным _id не найден.'
  }

  // if (err.code === 11000) {
  //   statusCode = 409
  //   message = 'Пользователь с таким email уже существует'
  // }

  return res.status(statusCode).send({ message })
}
