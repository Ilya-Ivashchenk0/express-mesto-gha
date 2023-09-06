module.exports = (req, res, next) => {
  console.log({ Запрос: req.method, Время: new Date().toLocaleString() })
  next()
}
