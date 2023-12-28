const {getNamespace} = require("cls-hooked");
const EventEmitter = require('events');
const MongoClient = require('mongodb').MongoClient;
module.exports = {
    createDbConnection : async (barId) => {
        const eventEmitter = new EventEmitter();
  
        return new Promise(async (a, r) => {
            if (!sails.tenant_db_con[barId]) {
              const db = await MongoClient.connect(process.env.MONGODB_URL)
              sails.tenant_db_con[barId] = db.db(process.env.MONGODB_TENANT_DB + barId);
            }
            a(eventEmitter);
        });
      
    },

    create : async (data) => {
        let bar = await Bar.create({
            name: data.name,
            url: data.url
        }).fetch();
        if (!bar) throw new Error("Error while creating bar");
        const ns = getNamespace("request-session");
        ns.run(async () => {
            try {
                await BarService.refreshConfig(bar); 
            } catch (error) {
                console.error(error)
                await BarService.delete(bar.id);
            }
        })
        
        return bar;
    },

    delete : async (id) => {
        const bar = await Bar.findOne({id}).orFail();
        await Bar.destroyOne({id});
        const db = await MongoClient.connect('mongodb://127.0.0.1:27017/')
        await db.db('infinity_shop_' + id).dropDatabase()
        console.log("Dropped TENANT DATABASE " + id + ' ('+bar.url+')')
        return bar;
    },

    refreshAllConfig: async () => {
        const bars = await Bar.find();
        for (let bar of bars){
            await BarService.refreshConfig(bar);
        }
    },

    refreshConfig: async (bar) => {
        const ns = getNamespace("request-session");
            ns.run(async () => {
                ns.set("user", {tenant : bar.id, _tenant : bar });
                let emitter = await BarService.createDbConnection(bar.id);
                const configs = await Config.find();
                for (let config of sails.config.display){
                    const configFind = configs.find(c => c.key === config.key)
                    if (configFind) {
                    if (configFind.description !== config.description || configFind.type !== config.type){
                        await Config.updateOne({id : configFind.id} , {
                            description: config.description,
                            type: config.type,
                        });
                    }
                    continue
                    }
                    await Config.create(config);
                }

                for (let config of configs){
                    let configInDisplay = sails.config.display.find(c => c.key === config.key);
                    if (!configInDisplay) await Config.destroyOne({id : config.id});
                }
                emitter.emit("end");
            })
    }

}