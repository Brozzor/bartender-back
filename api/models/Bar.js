/**
 * Bar.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const randomstring = require("randomstring");
module.exports = {

    attributes: {
      name: {type: 'string', defaultsTo: 'BarTender'},
      token: {type: 'string'},
      isOnline: {type: 'boolean', defaultsTo: false},

    },

    beforeCreate: function (values, next) {
      // Hash password
      values.token = randomstring.generate(20);
      values.name = values.name.toLowerCase();
      next();
    }
  
  };
  