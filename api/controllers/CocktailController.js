/**
 * CocktailController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const WebSocket = require('ws');
module.exports = {
    create : async function(req, res) {
        await Cocktail.create(req.body);
        return res.sendStatus(201);
    },
    order : async function(req, res) {
        console.log("order", req.body)
        console.log(sails.config.sockets.connectedSockets)
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
    list : async function(req, res){
        const cocktails = await Cocktail.find({});
        return res.json(cocktails);
    },
    remove : async function(req, res){
        await Cocktail.destroyOne(req.params.id)
        return res.sendStatus(200);
    }


};
