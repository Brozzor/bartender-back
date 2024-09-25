/**
 * CocktailController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
module.exports = {
    create : async function(req, res) {
        await Cocktail.create(req.body);
        await CocktailService.refreshCocktailsStock()
        return res.sendStatus(201);
    },
    order : async function(req, res) {
        try {
            await CocktailService.order(req.body);
        } catch (error) {
            console.error(error);
            return res.sendStatus(500);
        }
        return res.sendStatus(200);
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
