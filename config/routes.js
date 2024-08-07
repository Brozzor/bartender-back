/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  'POST /api/v1/auth/login' : 'AuthController.loginCustomer',
  'POST /api/v1/auth/admin/login' : 'AuthController.loginAdmin',

  'POST /api/v1/user' : 'UserController.create',
  'GET /api/v1/user/me' : 'UserController.me',
  'PUT /api/v1/user/me' : 'UserController.updateMe',
  'PUT /api/v1/user/password' : 'UserController.updatePassword',
  'POST /api/v1/user/forgetPassword' : 'UserController.forgetPassword',
  'PUT /api/v1/user/resetPassword' : 'UserController.resetPassword',

  'POST /api/v1/a/file' : 'FileController.upload',
  'GET /api/v1/file/:slug' : 'FileController.download',
  'GET /api/v1/file/id/:id' : 'FileController.download',
  'GET /api/v1/a/file' : 'FileController.listAdmin',
  'DELETE /api/v1/a/file/:id' : 'FileController.delete',
  'GET /api/v1/a/file/:id' : 'FileController.get',

  'POST /api/v1/cocktail/order' : 'CocktailController.order',
  'POST /api/v1/cocktail' : 'CocktailController.create',
  'GET /api/v1/cocktail' : 'CocktailController.list',
  'DELETE /api/v1/cocktail/:id' : 'CocktailController.remove',

  'GET /api/v1/bar' : 'BarController.get',
  'PUT /api/v1/bar' : 'BarController.update',

  'GET /api/v1/consumable' : 'ConsumableController.list',
  'POST /api/v1/consumable' : 'ConsumableController.create',
  'DELETE /api/v1/consumable/:id' : 'ConsumableController.remove',

  // log
  'GET /api/v1/log' : 'LogController.list',
  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};
