const bcrypt = require('bcrypt');

const salt = 10;
const password = 's0/\/\P4$$w0rD';
const other_password = 'not_bacon';

const encrypt = async (salt, text)=>{
    const hash = await bcrypt.hashSync(text, salt)
    console.log(hash)
    return hash    
}

const compare = async(salt, text_encryted, text_decrypted)=>{
    bcrypt.compare(someOtherPlaintextPassword, hash, function(err, result) {
        // result == false
    });
}

modules.exports = {
    encrypt
}