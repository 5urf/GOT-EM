let generator = require('generate-password');

module.exports = () => {
  return generator.generate({
    length: 10,
    numbers: true,
    symbols: true
  });  
}


