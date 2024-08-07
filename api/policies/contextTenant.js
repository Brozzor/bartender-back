/**
 * contextBar
 *
 * @description :: Policy to check if user is a global admin
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Policies
 */
const {getNamespace} = require("cls-hooked");
const MongoClient = require('mongodb').MongoClient;
module.exports = async function (req, res, next) {
    let ns = getNamespace('request-session');
    ns.run(async () => {
        //const bar = await Bar.findOne({url : req.headers['x-tenant']})
        const bar = await Bar.findOne() // for only one bar
        if (!bar) return res.sendStatus(400);
        if (!sails.tenant_db_con[bar.id]){
            const db = await MongoClient.connect(process.env.MONGODB_URL)
            sails.tenant_db_con[bar.id] = db.db(process.env.MONGODB_SLAVE_DB + bar.id);
            console.log("Connected to BAR DATABASE " + bar.id + ' ('+bar.url+')')
        }
        ns.set("user", {tenant : bar.id, _tenant : bar });
        let emitter = await BarService.createDbConnection(bar.id);
        res.on("finish", function () {
            emitter.emit("end");
        });

        next()
    })

};