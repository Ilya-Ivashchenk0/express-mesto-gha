const jwt = require('jsonwebtoken')

const handleAuthError = (res) => {
  res
    .status(401)
    .send({ message: 'Необходима авторизация' })
}

const extractBearerToken = (header) => header.replace('Bearer ', '')

module.exports = (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' })
  }

  const token = extractBearerToken(authorization)
  let payload

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    return handleAuthError(res)
  }

  req.user = payload

  return next()
}
