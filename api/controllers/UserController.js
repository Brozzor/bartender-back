/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const randomstring = require('randomstring');

module.exports = {
    create : async function(req, res) {
        // inclure recaptcha
        const { firstname, lastname, email, password } = req.body;

        const isEmailAlreadyUse = await User.findOne({ email });
        if (isEmailAlreadyUse) return res.status(422).send({ error: 'ERR_EMAIL_ALREADY_USE' });

        let user;
        try {
            user = await User.create({ firstname, lastname, email, password }).fetch();
        } catch (error) {
           throw res.sendStatus(500);
        }
        
        const token = await Token.create({ user: user.id }).fetch()
        return res.json({token: token.token})
    },

    me : async function(req, res) {
        return res.json({
            firstname: req.user.firstname,
            lastname: req.user.lastname,
            email: req.user.email,
            status: req.user.status
        })
    },

    updateMe : async function(req, res) {
        const { firstname, lastname } = req.body;
        const user = await User.updateOne({ id: req.user.id }, { 
            firstname: firstname ? firstname : req.user.firstname, 
            lastname: lastname ? lastname : req.user.lastname
        })
        return res.json(user);
    },

    updatePassword : async function(req, res) {
        const { oldPassword, newPassword } = req.body;
        if (!User.comparePassword(oldPassword, req.user.password)) return res.sendStatus(401);
        const user = await User.updateOne({ id: req.user.id }, { password: newPassword })
        return res.json(user);
    },

    forgetPassword : async function(req, res) {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.sendStatus(404);
        if (user && (!user.resetTokenExpires || (user.resetTokenExpires + (60 * 60 * 1000) < Date.now()))){
            const resetToken = randomstring.generate(60)
            const resetTokenExpires = Date.now() + (60 * 60 * 1000);
            await MailService.sendMail(email, 'Réinitialiser votre mot de passe', 'resetPassword', { token: resetToken, url: sails.config.tenant.url })
            await User.updateOne({ id: user.id }, { resetToken, resetTokenExpires });
            return res.sendStatus(200);
        }
        return res.sendStatus(200);
    },

    resetPassword : async function(req, res) {
        const { token, password } = req.body;
        if (!token || !password) return res.sendStatus(400)
        const user = await User.findOne({ resetToken: token })
        if (user && (!user.resetTokenExpires || user.resetTokenExpires + (60 * 60 * 1000) < Date.now())) return response.status(422).send({ error: 'ERR_TOKEN_EXPIRED' })
        await User.updateOne({ id: user.id }, { password, resetToken: null, resetTokenExpires: null })
        return res.sendStatus(200);
    },

    /*
        Administrator
    */

    update : async function(req, res) {
        const { firstname, lastname, email, status } = req.body;
        await User.updateOne({ id: req.params.id }, { firstname, lastname, email, status })
        return res.sendStatus(200);
    },

    get : async function(req, res) {
        const user = await User.findOne({ id: req.params.id })
        user.password = undefined;
        return res.json(user);
    },

    listAdmin: async function (req, res) {
        try {
            const users = await QueryService.executePaginatedQuery('user/listAdmin', req.query.filter, req.query.page, req.query.pageSize, req.query.sort)
            return res.json(users);
        } catch (error) {
            console.error(error);
            return res.sendStatus(400);
        }
    },

    adminCreate : async function(req, res) {
        const { firstname, lastname, email, password, status } = req.body;
        const user = await User.create({ firstname, lastname, email, password, status }).fetch();
        return res.json(user);
    },

    delete : async function(req, res) {
        await User.updateOne({ id: req.params.id }, { status: 'DELETED' })
        await Token.destroy({ user: req.params.id })
        return res.sendStatus(200);
    },


};