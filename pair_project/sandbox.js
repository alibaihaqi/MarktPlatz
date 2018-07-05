var bcrypt = require('bcrypt');
const saltRounds = 8;
const myPlaintextPassword = 'amelia22';
var salt = bcrypt.genSaltSync(saltRounds);
var hash = bcrypt.hashSync('amelia22', '$2b$08$uOMdjwzPxPcCJCB2IA27ie');
console.log(hash)
