module.exports = {
    loginAdmin: async (req, res) => {
        // inclure recaptcha
        const user = await User.findOne({email: req.body.email})
        let token
        try {
            if (!user) throw new Error('Unauthorized')
            if (user.status === 'DELETED' || user.status === 'DISABLED') throw new Error('Unauthorized')
            const isMatch = User.comparePassword(req.body.password, user.password)
            if (!isMatch) throw new Error('Unauthorized')
            token = await Token.create({user: user.id}).fetch()
        } catch (error) {
            return res.status(401).json({ error: error.message })
        }
        if (user.status === 'DISABLED') return res.sendStatus(401)
        return res.json(token)
    },
    loginCustomer: async (req, res) => {
        console.log(sails.config.tenant)
        if (!(req.body.name && req.body.password == sails.config.tenant.eventPassword)) return res.sendStatus(401)
        await LogService.create({message: "Customer " + req.body.name + " logged in", type: "INFO"})
        return res.sendStatus(200)
    }
};
