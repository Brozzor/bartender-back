module.exports = {
    list: async (req, res) => {
        const logs = await Log.find({}).limit(20).sort('createdAt DESC');
        return res.json(logs);
    }
};