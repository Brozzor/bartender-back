module.exports = {

    order : async function(data){
        const selectedCocktail = await Cocktail.findOne({'id': data.id});
        let pumps = await this.selectedPumps(data.id);
        pumps = await this.recalculatedPumpsPercent(pumps, data.alcoolPower);
        pumps = await this.formatToBar(pumps);
        await WebSocketService.send({
            type: "ORDER",
            pumps
        });
        console.log(pumps)
        await LogService.create({
            value: "Création du cocktail : " + selectedCocktail.name + " par " + data.name,
            type: "order",
        });
    
    },

    selectedPumps : async function(cocktailId) {
        const cocktail = await Cocktail.findOne({'id': cocktailId});
        let pumps = []
        for (let i in sails.config.tenant.pumps){
            for (const elem2 of cocktail.consumables){
                if (sails.config.tenant.pumps[i] === elem2.id){
                    const consumable = await Consumable.findOne({'id': elem2.id});
                    let drink = {
                        name: consumable.name,
                        percent: parseInt(elem2.percent),
                        isAlcool: consumable.isAlcool,
                        pumpId: parseInt(i)+1,
                    }
                    pumps.push(drink)
                }
            }
        }
        return pumps
    },

    recalculatedPumpsPercent : async function(pumps, alcoolPower){
        let augmentationPercent = 0;
        if (alcoolPower === '2') augmentationPercent = 40;
        if (alcoolPower === '3') augmentationPercent = 70;

        let percentAdded = 0;
        let nbWithoutAlcoolPercent = 0;
        for (let pump of pumps) {
            if (pump.isAlcool){
                const percentToAdd = (pump.percent * augmentationPercent) / 100;
                pump.percent += percentToAdd
                percentAdded += percentToAdd
            }else{
                nbWithoutAlcoolPercent += pump.percent
            }
        }

        for (let pump of pumps) {
            if (!pump.isAlcool){
                const percentToRemove = (pump.percent * percentAdded) / nbWithoutAlcoolPercent;
                pump.percent -= percentToRemove
            }
        }

        return pumps
    },

    formatToBar : async function(pumps){
        let res = {};
        glassWeight = sails.config.glass[sails.config.tenant.glassType]
        for (const pump of pumps) {
            res[pump.pumpId] = pump.percent * glassWeight / 100;
        }

        return res;
    },

}