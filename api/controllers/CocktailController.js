/**
 * CocktailController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    create : async function(req, res) {
        await Cocktail.create(data);
        return res.sendStatus(200);
    },
    order : async function(req, res) {
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
