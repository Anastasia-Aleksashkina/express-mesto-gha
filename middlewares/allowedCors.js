const { allowedCors } = require('../utils/constants');

module.exports = (req, res, next) => {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  const requestHeaders = req.headers['access-control-request-headers']; // Cохраняем список заголовков исходного запроса
  const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE'; // Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
  res.header('Access-Control-Allow-Credentials', true);

  // Проверяем, что источник запроса есть среди разрешённых
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin); // Устанавливаем заголовок, который разрешает браузеру запросы с источника, записанного в переменную origin
  }
  // Если это предварительный запрос, добавляем нужные заголовки
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS); // Разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Headers', requestHeaders); // Разрешаем кросс-доменные запросы с заданными заголовками
    return res.end(); // Завершаем обработку запроса и возвращаем результат клиенту
  }
  return next();
};
