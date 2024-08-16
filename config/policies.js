/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  '*': 'contextTenant',

  'BarController': {
    'get': ['contextTenant', 'isAdmin'],
    'update': ['contextTenant', 'isAdmin'],
  },

  'ConsumableController': {
    'list': ['contextTenant'],
    'create': ['contextTenant', 'isAdmin'],
    'remove': ['contextTenant', 'isAdmin'],
  },

  'LogController': {
    'list': ['contextTenant', 'isAdmin'],
  },

  'CocktailController': {
    'order': ['contextTenant'],
    'create': ['contextTenant', 'isAdmin'],
    'list': ['contextTenant'],
    'remove': ['contextTenant', 'isAdmin'],
  },

};
