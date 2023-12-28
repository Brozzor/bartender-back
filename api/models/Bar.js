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
      url:  { type: 'string',  required: true, minLength: 3 },
      isSsl: { type: 'boolean',  defaultsTo : false },
      status : {type: 'string', isIn: ['OFFLINE', 'ONLINE', 'USED', 'NO_GLASS' ], defaultsTo: 'OFFLINE'},

    },

    beforeCreate: function (values, next) {
      values.token = randomstring.generate(20);
      values.name = values.name.toLowerCase();
      next();
    }
  
  };
  