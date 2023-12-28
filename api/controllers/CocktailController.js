/**
 * CocktailController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const WebSocket = require('ws');
module.exports = {
    create : async function(req, res) {
        await Cocktail.create(data);
        return res.sendStatus(200);
    },
    order : async function(req, res) {
        //console.log(sails.config.sockets.connectedSockets)
        sails.config.sockets.connectedSockets.forEach((ws) => {
            console.log(ws.bar)
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ message: 'Nouveau cocktail créé!' }));
            }
          });
        return res.sendStatus(200);
        try {
            await CocktailService.order(req.body);
        } catch (error) {
            return res.sendStatus(500);
        }
    },
    display : async function(req, res){
        // find with bar id
        return await Cocktail.find({});
    },
    remove : async function(req, res){
        await Cocktail.destroyOne(req.params.id)
        return res.sendStatus(200);
    }


};
