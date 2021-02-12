var bcrypt = require('bcrypt');
const saltRounds = 8;
const myPlaintextPassword = 'amelia22';
var salt = bcrypt.genSaltSync(saltRounds);
var hash = bcrypt.hashSync('amour11', salt);
console.log(salt)
console.log(hash)
