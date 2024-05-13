const bcrypt = require('bcrypt');
const saltRounds = 5;


async function hashPassword(password) {
  try{
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }
    catch(err){
        throw new Error("Error hashing password");
    }
};

async function comparePasswords(plainTextPassword, hashedPassword) {
    try{
        const match = await bcrypt.compare(plainTextPassword, hashedPassword);
        return match;
    }
        catch(err){
            throw new Error("Error comparing passwords");
        }
    }

module.exports = { hashPassword, comparePasswords };