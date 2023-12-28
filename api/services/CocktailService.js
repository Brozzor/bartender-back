module.exports = {

    order : async function(data){
        const selectedCocktail = await Cocktail.findOne({'id': data.id}); // add bar id
        const pumps = await Configuration.find({
            key: { 
                'startsWith': 'pump'
            }
        })

        let actionPump = await this.selectedPumps(pumps, selectedCocktail);
        actionPump = await this.recalculatedPumpsTime(actionPump, data.amount);
        actionPump = await this.formatArrayToJsonBar(actionPump);
  
        const postToBar = await this.requestBar(actionPump);

        await LogService.create({
            value: "Création du cocktail : " + selectedCocktail.name + " par " + data.name,
            type: "order",
        });
    
    },

    postRequest : async function(actionPump){
        let res;
        try {
            res = await sails.axios.post('http://88.126.102.109:49154/makeCocktail', JSON.stringify(actionPump), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
        } catch (error) {
            res = false;
        }
        
        return res;
    },

    selectedPumps : async function(pumps, selectedCocktail) {
        let actionPump = []
        for await (const elem of pumps){
            for await (const elem2 of selectedCocktail.consommable){
                if (elem.value === elem2.id){
                    const selectedConsommable = await Consommable.findOne({'id': elem2.id});
                    let drink = {}
                    drink['name'] = elem.name,
                    drink['time'] = parseInt(elem2.time),
                    drink['isAlcool'] = selectedConsommable.isAlcool
            
                    actionPump.push(drink)
                    
                }
            }
        }
        
        return actionPump
    },

    recalculatedPumpsTime : async function(actionPump, amount){
        let alcoolTimeAdded = 0;
        let noAlcoolTime = 0;

        let nbAlcool = 0;
        let nbNoAlcool = 0;

        let augmentationPercent = 0;

        switch (parseInt(amount)) {
            case 2:
                augmentationPercent = 30
                break;
            case 3:
                augmentationPercent = 50
                break;
        }

        for (const elem of actionPump) {
            if (elem.isAlcool){
                nbAlcool++;
            }else{
                nbNoAlcool++;
                noAlcoolTime+= elem.time
            }
        }

        for (let elem of actionPump) {
            if (elem.isAlcool){
               let calc = ((augmentationPercent/100)/nbAlcool) * elem.time;
               elem.time += calc
               alcoolTimeAdded += calc;
               
            }
        }

        for (let elem of actionPump) {
            if (!elem.isAlcool){
               let percentElemInDrink = (elem.time * 100 ) / noAlcoolTime;
               let resElemRemoveInDrink = ((percentElemInDrink/100)/nbNoAlcool) * alcoolTimeAdded;
               elem.time -= resElemRemoveInDrink
            }
        }

        return actionPump
    },

    formatArrayToJsonBar : async function(data){
        let res = {};
        
        for (const elem of data) {
            res[elem.name] = elem.time;
        }

        return res;
    },

}