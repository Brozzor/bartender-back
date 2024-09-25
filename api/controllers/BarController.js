module.exports = {
    get: async (req, res) => {
        const bar = await Bar.findOne({
            id: sails.config.tenant.id
        });
        bar.token = undefined;
        return res.json(bar)
    },

    update: async (req, res) => {
        const { name, pumps, eventPassword, glassType} = req.body;
        await Bar.updateOne({ id: sails.config.tenant.id }, { name, pumps, eventPassword, glassType})
        await CocktailService.refreshCocktailsStock()
        return res.sendStatus(200);
    },
};
