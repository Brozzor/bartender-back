/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */


require('dotenv').config();

module.exports.bootstrap = async function() {

  // Init WebSocket server
  WebSocketService.init();

  sails.config.tenant = {
    get: function() {
      let user = getNamespace('request-session').get('user');
      return user ? user._tenant : null;
    }
  }

  if (await Bar.count() > 0) {
    return;
  }

  await Bar.create({});

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return;
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```

};
