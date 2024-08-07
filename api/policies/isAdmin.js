module.exports = async function (req, res, next) {
    if (req.headers.authorization) {
        const bearer = req.headers.authorization.split(" ")[1];
        const token = await Token.findOne({
            token: bearer,
        }).populate("user");
        if (!token || token.expiredAt < new Date().getTime()) return res.sendStatus(403);
        req.user = token.user;

        return next();
    } else {
        return res.sendStatus(401);
    }
}