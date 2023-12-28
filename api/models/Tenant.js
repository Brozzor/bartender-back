module.exports = {
    attributes: {
      name:  { type: 'string',  required: true, minLength: 3 },
      url:  { type: 'string',  required: true, minLength: 3 },
      ssl: { type: 'boolean',  defaultsTo : false },
      status : { type: 'string', isIn : ['ENABLED', 'DISABLED',  'DELETED'],  defaultsTo : 'ENABLED' }
    },
    isMultiTenant : false
}  