module.exports = {
    list: async function (req, res) {
        const consumables = await Consumable.find({}).sort('name ASC');
        return res.json(consumables);
    },

    remove: async function (req, res) {
        await Consumable.destroyOne(req.params.id)
        return res.sendStatus(200);
    },

    create: async function (req, res) {
        const { name, isAlcool } = req.body;
        await Consumable.create({ name, isAlcool });
        return res.sendStatus(200);
    },
}