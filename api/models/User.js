/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const crypto = require('crypto');
module.exports = {

    attributes: {
        firstName: {type: 'string'},
        lastName: {type: 'string'},
        email: {type: 'string', unique: true},
        password: {type: 'string'},
        resetToken : { type: 'string' },
        resetTokenExpires : { type: 'number' }
    },

    comparePassword: function (password, userPassword) {
      let hash = crypto.createHash('sha256').update(password).digest('base64');
      if (hash === userPassword) return true
      return false
    },
  
    beforeUpdate: function (user, cb) {
      User.checkPassword(user);
      cb();
    },
  
    beforeCreate: function (user, cb) {
      User.checkPassword(user);
      cb();
    },
  
    checkPassword : (user) => {
      if (user.password) {
        user.password = crypto.createHash('sha256').update(user.password).digest('base64');
      }else{
        delete user.password;
      }
    },
  
  };
  
  