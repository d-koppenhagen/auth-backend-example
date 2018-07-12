const logger = require('../utils/logger');

exports.getData = (req, res, next) => {
  logger.info('exampleController | received GET');
  res.json({
    key1: generateExampleData(),
    key2: generateExampleData(),
    key3: [generateExampleData(), generateExampleData()],
    key4: {
      a: generateExampleData(),
      b: generateExampleData()
    },
  });
}

function generateExampleData() {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < 8; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}